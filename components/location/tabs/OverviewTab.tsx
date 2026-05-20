"use client";

import { Spin, Tag } from "antd";
import { useTranslations } from "next-intl";
import { useLocationMeta, useLocationOverview } from "@/hooks/useLocation";
import type { LocationMeta, LocationOverview } from "@/types/location";
import { CustomerCountChartPanel } from "@/components/dashboard/CustomerCountChartPanel";
import { RevenueChartPanel } from "@/components/dashboard/RevenueChartPanel";
import { useLocationOverviewCharts } from "../useLocationOverviewCharts";

function LocationInfoCard({ meta }: { meta: LocationMeta }) {
  const t = useTranslations("location");

  return (
    <section className="location-panel location-info-card">
      <p className="location-info-address m-0">
        {meta.code} · {meta.address}, {meta.city}
      </p>
      <div className="location-detail-meta-row">
        <Tag color={meta.type === "owned" ? "processing" : "warning"}>{meta.typeLabel}</Tag>
        <Tag>{meta.statusLabel}</Tag>
        <Tag>{meta.phone}</Tag>
        <Tag>
          {t("openSince")}: {meta.openSince}
        </Tag>
      </div>
    </section>
  );
}

function KpiGrid({ data }: { data: LocationOverview }) {
  return (
    <div className="location-kpi-grid">
      {data.kpis.map((kpi) => (
        <div key={kpi.label} className="location-kpi-card">
          <div className="location-kpi-label">{kpi.label}</div>
          <div className="location-kpi-value">{kpi.value}</div>
          <div
            className={`location-kpi-growth ${kpi.growthUp ? "dashboard-growth-up" : "dashboard-growth-down"}`}
          >
            {kpi.growth}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OverviewTab({ locationId }: { locationId: string }) {
  const t = useTranslations("location");
  const { data: meta } = useLocationMeta(locationId);
  const { data, isLoading, isError } = useLocationOverview(locationId, true);

  useLocationOverviewCharts(
    data,
    {
      staffCosts: t("overviewCharts.staffCosts"),
      sales: t("overviewCharts.sales"),
      warehouse: t("overviewCharts.warehouse"),
      segmentTotal: t("charts.segmentTotal"),
    },
    !!data
  );

  if (isLoading || !meta) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-muted text-center py-12">{t("error")}</p>;
  }

  return (
    <>
      <LocationInfoCard meta={meta} />
      <KpiGrid data={data} />
      <div className="location-charts-row">
        <CustomerCountChartPanel
          variant="location"
          data={data.customerCount}
          canvasId="loc-chart-customer-count"
          title={t("overviewCharts.customerCount")}
          labels={{
            week: t("overviewCharts.customerCountWeek"),
            month: t("overviewCharts.customerCountMonth"),
            year: t("overviewCharts.customerCountYear"),
          }}
        />
        <RevenueChartPanel
          variant="location"
          data={data.revenue}
          canvasId="loc-chart-revenue"
          title={t("overviewCharts.totalRevenue")}
          datasetLabel={t("overviewCharts.totalRevenue")}
          labels={{
            week: t("overviewCharts.revenueWeek"),
            month: t("overviewCharts.revenueMonth"),
            year: t("overviewCharts.revenueYear"),
          }}
        />
      </div>
      <div className="location-chart-grid location-chart-grid--3">
        <div className="location-chart-panel">
          <h4>{t("overviewCharts.staffCosts")}</h4>
          <p className="location-chart-desc">{t("overviewCharts.staffCostsDesc")}</p>
          <div className="location-chart-wrap">
            <canvas id="loc-chart-costs" />
          </div>
        </div>
        <div className="location-chart-panel">
          <h4>{t("overviewCharts.sales")}</h4>
          <p className="location-chart-desc">{t("overviewCharts.salesDesc")}</p>
          <div className="location-chart-wrap">
            <canvas id="loc-chart-sales" />
          </div>
        </div>
        <div className="location-chart-panel">
          <h4>{t("overviewCharts.warehouse")}</h4>
          <p className="location-chart-desc">{t("overviewCharts.warehouseDesc")}</p>
          <div className="location-chart-wrap">
            <canvas id="loc-chart-warehouse" />
          </div>
        </div>
      </div>
    </>
  );
}
