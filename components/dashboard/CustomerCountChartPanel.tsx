"use client";

import { useMemo, useState } from "react";
import { Segmented } from "antd";
import type { CustomerCountChartData, CustomerCountGranularity } from "@/types/dashboard";
import {
  customerCountTrend,
  useCustomerCountChart,
} from "./useCustomerCountChart";
import "./customerCountChart.css";

type PanelVariant = "dashboard" | "location";

export function CustomerCountChartPanel({
  data,
  canvasId,
  variant,
  title,
  labels,
}: {
  data: CustomerCountChartData | undefined;
  canvasId: string;
  variant: PanelVariant;
  title: string;
  labels: {
    month: string;
    week: string;
    day: string;
    vsPeriodStart: string;
  };
}) {
  const [granularity, setGranularity] = useState<CustomerCountGranularity>("month");

  useCustomerCountChart(data, granularity, canvasId, !!data);

  const series = useMemo(() => {
    if (!data) return { labels: [] as string[], values: [] as number[] };
    if (granularity === "month") return data.month;
    if (granularity === "week") return data.week;
    return data.day;
  }, [data, granularity]);

  const trend = useMemo(() => customerCountTrend(series.values), [series.values]);

  const panelClass =
    variant === "dashboard"
      ? "dashboard-chart-panel dashboard-chart-panel--customer-count"
      : "location-chart-panel location-chart-panel--wide location-chart-panel--customer-count";

  const wrapClass =
    variant === "dashboard"
      ? "dashboard-chart-wrap dashboard-chart-wrap--customer-count"
      : "location-chart-wrap location-chart-wrap--customer-count";

  return (
    <div className={panelClass}>
      <div className="customer-count-chart-header">
        <div className="customer-count-chart-header__titles">
          <h4>{title}</h4>
        </div>
        <div className="customer-count-chart-header__controls">
          <span
            className={
              trend.growthUp ? "dashboard-growth-up" : "dashboard-growth-down"
            }
          >
            {trend.growthUp ? "↑" : "↓"} {trend.growthPct}% {labels.vsPeriodStart}
          </span>
          <Segmented
            size="small"
            value={granularity}
            onChange={(v) => setGranularity(v as CustomerCountGranularity)}
            options={[
              { label: labels.month, value: "month" },
              { label: labels.week, value: "week" },
              { label: labels.day, value: "day" },
            ]}
          />
        </div>
      </div>
      <div className={wrapClass}>
        <canvas id={canvasId} />
      </div>
    </div>
  );
}
