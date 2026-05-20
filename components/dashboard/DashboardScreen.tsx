"use client";

import { Spin } from "antd";
import { useTranslations } from "next-intl";
import { useDashboardOverview } from "@/hooks/useDashboard";
import { CustomerCountChartPanel } from "./CustomerCountChartPanel";
import { DashboardPerformanceSection } from "./DashboardPerformanceSection";
import { DemandInsightsRow } from "./DemandInsightsRow";
import { HighlightCards } from "./HighlightCards";
import { RevenueChartPanel } from "./RevenueChartPanel";
import "./dashboard.css";

export function DashboardScreen() {
  const t = useTranslations("dashboard");
  const { data, isLoading, isError, refetch } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="dashboard-page flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="dashboard-page text-center py-20 text-muted">
        <p>{t("error")}</p>
        <button
          type="button"
          className="mt-3 text-pharma underline"
          onClick={() => refetch()}
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-section-title">{t("sectionOps")}</h2>

      <HighlightCards highlight={data.highlight} />

      <div className="dashboard-charts-row">
        <CustomerCountChartPanel
          variant="dashboard"
          data={data.customerCount}
          canvasId="chart-customer-count"
          title={t("charts.customerCount")}
          labels={{
            week: t("charts.customerCountWeek"),
            month: t("charts.customerCountMonth"),
            year: t("charts.customerCountYear"),
          }}
        />
        <RevenueChartPanel
          data={data.charts.revenue}
          canvasId="chart-revenue"
          title={t("charts.revenue")}
          datasetLabel={t("charts.revenue")}
          labels={{
            week: t("charts.revenueWeek"),
            month: t("charts.revenueMonth"),
            year: t("charts.revenueYear"),
          }}
        />
      </div>

      <DashboardPerformanceSection
        storePerformance={data.storePerformance}
        productPerformance={data.productPerformance}
      />

      <DemandInsightsRow
        salesPointsMap={data.salesPointsMap}
        quickAlerts={data.quickAlerts}
      />
    </div>
  );
}
