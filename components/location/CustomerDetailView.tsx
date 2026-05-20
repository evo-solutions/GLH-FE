"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Chart as ChartType } from "chart.js";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useLocationCustomerDetail } from "@/hooks/useLocation";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import {
  chartDoughnutLabelsPlugin,
  chartValueLabelsPlugin,
  compactChartOptions,
  readChartAccentColors,
} from "@/components/dashboard/chartOptions";
import { colorWithAlpha } from "@/libs/theme";
import { CustomerOrderInvoiceDrawer } from "@/components/location/CustomerOrderInvoiceDrawer";
import type {
  CustomerActivityTouchpoint,
  CustomerCohortRow,
  CustomerLoyaltyBenchmarkRow,
  CustomerPurchaseSegmentRow,
  CustomerTier,
  LocationCustomerDetail,
} from "@/types/location";

function tierColor(tier: CustomerTier) {
  if (tier === "gold") return "warning";
  if (tier === "silver") return "default";
  return "processing";
}

function useCustomerCharts(data: LocationCustomerDetail | undefined, customerId: string) {
  const segmentRef = useRef<ChartType | null>(null);
  const cohortRef = useRef<ChartType | null>(null);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!data) return;
    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;
      Chart.register(chartValueLabelsPlugin, chartDoughnutLabelsPlugin);

      segmentRef.current?.destroy();
      cohortRef.current?.destroy();

      const { primary, success, warning, info } = readChartAccentColors();
      const segmentColors = [primary, success, warning, info];

      const segmentEl = document.getElementById(
        `customer-segment-chart-${customerId}`
      ) as HTMLCanvasElement | null;
      if (segmentEl) {
        const doughnutOpts = compactChartOptions("doughnut") as Record<string, unknown>;
        segmentRef.current = new Chart(segmentEl, {
          type: "pie",
          data: {
            labels: data.purchaseSegments.map((s) => s.segment),
            datasets: [
              {
                data: data.purchaseSegments.map((s) => s.weightPct),
                backgroundColor: segmentColors.slice(0, data.purchaseSegments.length),
                borderWidth: 0,
              },
            ],
          },
          options: {
            ...doughnutOpts,
            cutout: 0,
            plugins: {
              ...(doughnutOpts.plugins as object),
              tooltip: {
                ...((doughnutOpts.plugins as { tooltip?: object })?.tooltip ?? {}),
                callbacks: {
                  label: (ctx: { label?: string; parsed?: number }) =>
                    ` ${ctx.label ?? ""}: ${ctx.parsed ?? 0}%`,
                },
              },
            },
          },
          plugins: [chartDoughnutLabelsPlugin],
        } as ConstructorParameters<typeof Chart>[1]) as ChartType;
      }

      const cohortEl = document.getElementById(
        `customer-cohort-chart-${customerId}`
      ) as HTMLCanvasElement | null;
      if (cohortEl) {
        const lineOpts = compactChartOptions("line") as {
          scales?: { x?: object; y?: { ticks?: { callback?: (v: string | number) => string } } };
        };
        cohortRef.current = new Chart(cohortEl, {
          type: "line",
          data: {
            labels: data.cohortRetention.map((r) => r.period),
            datasets: [
              {
                label: "Retention %",
                data: data.cohortRetention.map((r) => r.retentionPct),
                borderColor: success,
                backgroundColor: colorWithAlpha(primary, 0.12),
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: success,
                pointBorderColor: "#fff",
                pointBorderWidth: 1,
              },
            ],
          },
          options: {
            ...compactChartOptions("line"),
            scales: {
              x: lineOpts.scales?.x,
              y: {
                ...lineOpts.scales?.y,
                min: 40,
                max: 100,
                ticks: {
                  ...lineOpts.scales?.y?.ticks,
                  callback: (v: string | number) => `${v}`,
                },
              },
            },
          },
          plugins: [chartValueLabelsPlugin],
        } as ConstructorParameters<typeof Chart>[1]) as ChartType;
      }
    })();

    return () => {
      cancelled = true;
      segmentRef.current?.destroy();
      cohortRef.current?.destroy();
    };
  }, [data, customerId, theme]);

  return { segmentCanvasId: `customer-segment-chart-${customerId}`, cohortCanvasId: `customer-cohort-chart-${customerId}` };
}

export function CustomerDetailView({
  locationId,
  customerId,
}: {
  locationId: string;
  customerId: string;
}) {
  const t = useTranslations("location.sales");
  const { data, isLoading, isError } = useLocationCustomerDetail(locationId, customerId, true);
  const { segmentCanvasId, cohortCanvasId } = useCustomerCharts(data, customerId);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string | null>(null);

  const selectedInvoice =
    selectedOrderCode && data?.orderInvoices ? data.orderInvoices[selectedOrderCode] : null;

  const activityColumns: ColumnsType<CustomerActivityTouchpoint> = [
    { title: t("activityAt"), dataIndex: "at" },
    {
      title: t("activityLocation"),
      dataIndex: "locationName",
      render: (name: string, row) => (
        <Link
          href={`/location/${row.locationId}?tab=sales`}
          className="product-location-link font-semibold"
          onClick={(e) => e.stopPropagation()}
        >
          {name}
        </Link>
      ),
    },
    { title: t("activityChannel"), dataIndex: "channel" },
    { title: t("activityTouchpoint"), dataIndex: "touchpoint" },
    {
      title: t("activityOrderCode"),
      dataIndex: "orderCode",
      render: (code: string | undefined) =>
        code ? (
          <button
            type="button"
            className="customer-order-link font-mono text-xs font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrderCode(code);
            }}
          >
            {code}
          </button>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    { title: t("activityOutcome"), dataIndex: "outcome" },
  ];

  const segmentColumns: ColumnsType<CustomerPurchaseSegmentRow> = [
    { title: t("segmentPurchase"), dataIndex: "segment" },
    { title: t("segmentWeight"), dataIndex: "weightPct", align: "right", render: (v: number) => `${v}%` },
    { title: t("segmentRevenue"), dataIndex: "labeledRevenueYear" },
    { title: t("segmentOrders90d"), dataIndex: "orders90d", align: "right" },
  ];

  const cohortColumns: ColumnsType<CustomerCohortRow> = [
    { title: t("cohortPeriod"), dataIndex: "period", width: 72 },
    { title: t("cohortRetention"), dataIndex: "retentionPct", align: "right", render: (v: number) => `${v}%` },
    { title: t("cohortNote"), dataIndex: "note", ellipsis: true },
  ];

  const loyaltyColumns: ColumnsType<CustomerLoyaltyBenchmarkRow> = [
    { title: t("loyaltySegment"), dataIndex: "segment" },
    { title: t("loyaltyMembers"), dataIndex: "members", align: "right", render: (v: number) => v.toLocaleString("vi-VN") },
    { title: t("loyaltyFrequency"), dataIndex: "avgFrequency90d", align: "right" },
    { title: t("loyaltyLtv"), dataIndex: "ltvIndex", align: "right" },
    {
      title: t("loyaltyStatus"),
      dataIndex: "status",
      render: (status: string, row) => (
        <Tag color={row.segment.includes("★") ? "processing" : "default"}>{status}</Tag>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-muted text-center py-16 m-0">{t("loadError")}</p>;
  }

  return (
    <>
      <section className="location-panel customer-summary-card">
        <div className="customer-summary-head">
          <div>
            <div className="customer-summary-name m-0">{data.name}</div>
            <div className="text-muted text-sm m-0 mt-1">
              {data.phone}
              {data.email ? ` · ${data.email}` : ""}
            </div>
          </div>
          <Tag color={tierColor(data.tier)} className="location-tier-tag">
            {data.tierLabel}
          </Tag>
        </div>

        <dl className="location-drawer-dl customer-summary-dl">
          <div>
            <dt>{t("loyaltySegmentAssigned")}</dt>
            <dd>{data.loyaltySegment}</dd>
          </div>
          <div>
            <dt>{t("rating")}</dt>
            <dd>
              {data.rating} · {data.ratingLabel}
            </dd>
          </div>
          <div>
            <dt>{t("totalSpent")}</dt>
            <dd>{data.totalSpent}</dd>
          </div>
          <div>
            <dt>{t("visits")}</dt>
            <dd>{data.visits}</dd>
          </div>
          <div>
            <dt>{t("avgBasket")}</dt>
            <dd>{data.avgBasket}</dd>
          </div>
          <div>
            <dt>{t("preferredHours")}</dt>
            <dd>{data.preferredHours.join(" · ")}</dd>
          </div>
          <div>
            <dt>{t("memberSince")}</dt>
            <dd>{data.memberSince}</dd>
          </div>
        </dl>
        {data.notes && <p className="customer-summary-notes m-0 mt-2 text-sm text-muted">{data.notes}</p>}
      </section>

      <section className="location-panel customer-detail-section">
        <h4 className="location-drawer-section-title">{t("activityTitle")}</h4>
        {data.visitedLocations.length > 0 && (
          <p className="customer-visited-locations m-0 mb-2 text-sm">
            <span className="text-muted">{t("visitedLocations")}: </span>
            {data.visitedLocations.map((loc, index) => (
              <span key={loc.locationId}>
                {index > 0 && ", "}
                <Link href={`/location/${loc.locationId}?tab=sales`} className="product-location-link">
                  {loc.locationName}
                </Link>
              </span>
            ))}
          </p>
        )}
        <div>
          <Table
            size="small"
            rowKey="id"
            columns={activityColumns}
            dataSource={data.activityTouchpoints}
            pagination={defaultTablePagination}
            className="gl-table-scroll"
            scroll={tableScroll("max-content")}
            tableLayout="auto"
            onRow={(row) => ({
              onClick: () => {
                if (row.orderCode) setSelectedOrderCode(row.orderCode);
              },
              style: row.orderCode ? { cursor: "pointer" } : undefined,
            })}
          />
        </div>
      </section>

      <CustomerOrderInvoiceDrawer
        invoice={selectedInvoice}
        open={!!selectedOrderCode && !!selectedInvoice}
        onClose={() => setSelectedOrderCode(null)}
      />

      <section className="location-panel customer-detail-section">
        <h4 className="location-drawer-section-title">{t("segmentTitle")}</h4>
        <div className="customer-chart-row">
          <div className="customer-chart-wrap">
            <canvas id={segmentCanvasId} />
          </div>
          <div className="customer-chart-table">
            <Table
              size="small"
              className="gl-table-scroll"
              rowKey="segment"
              columns={segmentColumns}
              dataSource={data.purchaseSegments}
              pagination={defaultTablePagination}
              scroll={tableScroll("max-content")}
              tableLayout="auto"
            />
          </div>
        </div>
      </section>

      <section className="location-panel customer-detail-section">
        <h4 className="location-drawer-section-title">{t("cohortTitle")}</h4>
        <div className="customer-chart-row">
          <div className="customer-chart-wrap">
            <canvas id={cohortCanvasId} />
          </div>
          <div className="customer-chart-table">
            <Table
              size="small"
              className="gl-table-scroll"
              rowKey="period"
              columns={cohortColumns}
              dataSource={data.cohortRetention}
              pagination={defaultTablePagination}
              scroll={tableScroll("max-content")}
              tableLayout="auto"
            />
          </div>
        </div>
      </section>

      <section className="location-panel customer-detail-section">
        <h4 className="location-drawer-section-title">{t("loyaltyTitle")}</h4>
        <p className="customer-section-hint m-0 mb-2">{t("loyaltyHint")}</p>
        <Table
          size="small"
          rowKey="segment"
          columns={loyaltyColumns}
          dataSource={data.loyaltyBenchmarks}
          pagination={defaultTablePagination}
          className="gl-table-scroll"
          scroll={tableScroll("max-content")}
          tableLayout="auto"
        />
      </section>
    </>
  );
}
