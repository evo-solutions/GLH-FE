"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Chart as ChartType } from "chart.js";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useBusinessModuleScope } from "@/hooks/useBusinessModuleScope";
import { useLocationSales } from "@/hooks/useLocation";
import type { CustomerTier, LocationSalesCustomer } from "@/types/location";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import {
  chartDoughnutLabelsPlugin,
  chartValueLabelsPlugin,
  compactChartOptions,
  readChartAccentColors,
  readThemeColor,
} from "@/components/dashboard/chartOptions";
import { locationCustomerPath } from "@/lib/locationRoutes";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";

function tierColor(tier: CustomerTier) {
  if (tier === "gold") return "warning";
  if (tier === "silver") return "default";
  return "processing";
}

export function SalesTab({
  locationId,
  enabled,
}: {
  locationId: string;
  enabled: boolean;
}) {
  const t = useTranslations("location.sales");
  const tRoot = useTranslations("location");
  const { moduleBasePath } = useBusinessModuleScope();
  const router = useRouter();
  const { data, isLoading, isError } = useLocationSales(locationId, enabled);
  const peakRef = useRef<ChartType | null>(null);
  const tierRef = useRef<ChartType | null>(null);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!enabled || !data) return;
    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;
      Chart.register(chartValueLabelsPlugin, chartDoughnutLabelsPlugin);

      peakRef.current?.destroy();
      tierRef.current?.destroy();

      const { primary, warning, info } = readChartAccentColors();
      const silver = readThemeColor("--chart-2");

      const peakEl = document.getElementById("loc-peak-hours") as HTMLCanvasElement | null;
      if (peakEl) {
        const peakSet = new Set(data.peakHours.peakIndices);
        peakRef.current = new Chart(peakEl, {
          type: "bar",
          data: {
            labels: data.peakHours.labels,
            datasets: [
              {
                label: t("peakHoursTitle"),
                data: data.peakHours.values,
                backgroundColor: data.peakHours.values.map((_, i) =>
                  peakSet.has(i) ? warning : primary
                ),
              },
            ],
          },
          options: compactChartOptions("bar"),
          plugins: [chartValueLabelsPlugin],
        } as ConstructorParameters<typeof Chart>[1]) as ChartType;
      }

      const tierEl = document.getElementById("loc-tier-chart") as HTMLCanvasElement | null;
      if (tierEl) {
        tierRef.current = new Chart(tierEl, {
          type: "doughnut",
          data: {
            labels: data.tierChart.labels,
            datasets: [
              {
                data: data.tierChart.values,
                backgroundColor: [warning, silver, info],
                borderWidth: 0,
              },
            ],
          },
          options: compactChartOptions("doughnut"),
          plugins: [chartDoughnutLabelsPlugin],
        } as ConstructorParameters<typeof Chart>[1]) as ChartType;
      }
    })();

    return () => {
      cancelled = true;
      peakRef.current?.destroy();
      tierRef.current?.destroy();
    };
  }, [data, theme, enabled, t]);

  const columns: ColumnsType<LocationSalesCustomer> = [
    { title: t("name"), dataIndex: "name" },
    {
      title: t("tier"),
      dataIndex: "tierLabel",
      render: (_, row) => <Tag color={tierColor(row.tier)}>{row.tierLabel}</Tag>,
    },
    { title: t("phone"), dataIndex: "phone" },
    { title: t("totalSpent"), dataIndex: "totalSpent" },
    { title: t("visits"), dataIndex: "visits", align: "right" },
    { title: t("preferredHour"), dataIndex: "preferredHour" },
    { title: t("lastVisit"), dataIndex: "lastVisit" },
  ];

  if (!enabled) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-muted text-center py-12">{tRoot("error")}</p>;
  }

  return (
    <>
      <div className="location-kpi-grid">
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("totalCustomers")}</div>
          <div className="location-kpi-value">{data.summary.totalCustomers}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("goldTier")}</div>
          <div className="location-kpi-value text-base">{data.summary.goldCount}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("silverTier")}</div>
          <div className="location-kpi-value text-base">{data.summary.silverCount}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("bronzeTier")}</div>
          <div className="location-kpi-value text-base">{data.summary.bronzeCount}</div>
        </div>
      </div>

      <div className="location-split-row">
        <div className="location-chart-panel">
          <h4>{t("peakHoursTitle")}</h4>
          <div className="location-chart-wrap">
            <canvas id="loc-peak-hours" />
          </div>
        </div>
        <div className="location-chart-panel">
          <h4>{t("tierDistribution")}</h4>
          <div className="location-chart-wrap">
            <canvas id="loc-tier-chart" />
          </div>
        </div>
      </div>

      <div className="location-panel">
        <h4 className="m-0 mb-3 text-sm font-semibold">{t("customerList")}</h4>
        <Table<LocationSalesCustomer>
          className="location-customers-table gl-table-scroll"
          size="small"
          rowKey="id"
          columns={columns}
          dataSource={data.customers}
          pagination={defaultTablePagination}
          tableLayout="auto"
          scroll={tableScroll("max-content")}
          onRow={(row) => ({
            onClick: () =>
              router.push(locationCustomerPath(locationId, row.id, moduleBasePath)),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </>
  );
}
