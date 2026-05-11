"use client";

import { useState } from "react";
import { Segmented } from "antd";
import type { RevenueChartData, RevenueGranularity } from "@/types/dashboard";
import { useRevenueChart } from "./useRevenueChart";
import "./revenueChart.css";

export function RevenueChartPanel({
  data,
  canvasId,
  title,
  datasetLabel,
  labels,
  variant = "dashboard",
}: {
  data: RevenueChartData | undefined;
  canvasId: string;
  title: string;
  datasetLabel: string;
  labels: {
    week: string;
    month: string;
    year: string;
  };
  variant?: "dashboard" | "location";
}) {
  const [granularity, setGranularity] = useState<RevenueGranularity>("month");

  useRevenueChart(data, granularity, canvasId, datasetLabel, !!data);

  const panelClass =
    variant === "dashboard"
      ? "dashboard-chart-panel dashboard-chart-panel--revenue"
      : "location-chart-panel location-chart-panel--wide location-chart-panel--revenue";

  const wrapClass =
    variant === "dashboard"
      ? "dashboard-chart-wrap dashboard-chart-wrap--revenue"
      : "location-chart-wrap location-chart-wrap--revenue";

  return (
    <div className={panelClass}>
      <div className="revenue-chart-header">
        <div className="revenue-chart-header__titles">
          <h4>{title}</h4>
        </div>
        <Segmented
          size="small"
          value={granularity}
          onChange={(v) => setGranularity(v as RevenueGranularity)}
          options={[
            { label: labels.week, value: "week" },
            { label: labels.month, value: "month" },
            { label: labels.year, value: "year" },
          ]}
        />
      </div>
      <div className={wrapClass}>
        <canvas id={canvasId} />
      </div>
    </div>
  );
}
