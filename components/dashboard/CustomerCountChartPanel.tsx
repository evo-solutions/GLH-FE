"use client";

import { useState } from "react";
import { Segmented } from "antd";
import type { CustomerCountChartData, CustomerCountGranularity } from "@/types/dashboard";
import { useCustomerCountChart } from "./useCustomerCountChart";
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
    week: string;
    month: string;
    year: string;
  };
}) {
  const [granularity, setGranularity] = useState<CustomerCountGranularity>("month");

  useCustomerCountChart(data, granularity, canvasId, !!data);

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
          <Segmented
            size="small"
            value={granularity}
            onChange={(v) => setGranularity(v as CustomerCountGranularity)}
            options={[
              { label: labels.week, value: "week" },
              { label: labels.month, value: "month" },
              { label: labels.year, value: "year" },
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
