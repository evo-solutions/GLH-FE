"use client";

import { useMemo, useState } from "react";
import { Segmented, Tag } from "antd";
import { useTranslations } from "next-intl";
import { useRealtimeRevenue } from "@/hooks/useRealtimeRevenue";
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
  realtime = true,
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
  /** When true, last chart point ticks up on a random schedule. */
  realtime?: boolean;
}) {
  const tDash = useTranslations("dashboard.highlight");
  const tLoc = useTranslations("location.overviewCharts");
  const [granularity, setGranularity] = useState<RevenueGranularity>("month");

  const baseSeries = data?.[granularity];
  const initialLast =
    baseSeries && baseSeries.values.length > 0
      ? baseSeries.values[baseSeries.values.length - 1]
      : 0;

  const { value: liveValue, formatted: liveFormatted, tickFlash } =
    useRealtimeRevenue(initialLast, {
      enabled: realtime && !!data,
      minIncrementVnd: 8_000_000,
      maxIncrementVnd: 55_000_000,
    });

  const liveData = useMemo((): RevenueChartData | undefined => {
    if (!data) return undefined;
    const series = data[granularity];
    if (!series.values.length) return data;
    const values = [...series.values];
    values[values.length - 1] = liveValue;
    return {
      ...data,
      [granularity]: { ...series, values },
    };
  }, [data, granularity, liveValue]);

  useRevenueChart(liveData, granularity, canvasId, datasetLabel, !!liveData);

  const panelClass =
    variant === "dashboard"
      ? "dashboard-chart-panel dashboard-chart-panel--revenue"
      : "location-chart-panel location-chart-panel--wide location-chart-panel--revenue";

  const wrapClass =
    variant === "dashboard"
      ? "dashboard-chart-wrap dashboard-chart-wrap--revenue"
      : "location-chart-wrap location-chart-wrap--revenue";

  const displayTitle = realtime
    ? variant === "location"
      ? tLoc("totalRevenue")
      : tDash("realtimeRevenueChart")
    : title;
  const liveLabel = variant === "location" ? tLoc("live") : tDash("live");
  const billionUnit =
    variant === "location" ? tLoc("billionUnit") : tDash("billionUnit");
  const realtimeHint =
    variant === "location" ? tLoc("realtimeHint") : tDash("realtimeHint");

  return (
    <div className={panelClass}>
      <div className="revenue-chart-header">
        <div className="revenue-chart-header__titles">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="m-0">{displayTitle}</h4>
            {realtime ? (
              <Tag color="success" className="dashboard-realtime-live">
                {liveLabel}
              </Tag>
            ) : null}
          </div>
          {realtime ? (
            <div>
              <div
                className={`revenue-chart-live-total ${tickFlash ? "revenue-chart-live-total--tick" : ""}`}
              >
                {liveFormatted}
                <span className="text-base font-semibold text-[var(--text-secondary)]">
                  {" "}
                  {billionUnit}
                </span>
              </div>
              <p className="revenue-chart-live-meta m-0">{realtimeHint}</p>
            </div>
          ) : null}
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
