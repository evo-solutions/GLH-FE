"use client";

import { useEffect, useRef } from "react";
import type { Chart as ChartType } from "chart.js";
import type {
  CustomerCountChartData,
  CustomerCountGranularity,
} from "@/types/dashboard";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { colorWithAlpha } from "@/libs/theme";
import {
  chartValueLabelsPlugin,
  compactChartOptions,
  readChartAccentColors,
  readThemeColor,
} from "./chartOptions";

export function useCustomerCountChart(
  data: CustomerCountChartData | undefined,
  granularity: CustomerCountGranularity,
  canvasId: string,
  enabled: boolean
) {
  const ref = useRef<ChartType | null>(null);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!enabled || !data) return;

    const series =
      granularity === "month"
        ? data.month
        : granularity === "week"
          ? data.week
          : data.day;

    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;

      if (granularity !== "week") {
        Chart.register(chartValueLabelsPlugin);
      }

      ref.current?.destroy();
      ref.current = null;

      const el = document.getElementById(canvasId) as HTMLCanvasElement | null;
      if (!el) return;

      const { primary } = readChartAccentColors();

      const maxTicks =
        granularity === "month" ? 12 : granularity === "week" ? 13 : 10;

      ref.current = new Chart(el, {
        type: "line",
        data: {
          labels: series.labels,
          datasets: [
            {
              label: "",
              data: series.values,
              borderColor: primary,
              backgroundColor: colorWithAlpha(primary, 0.13),
              fill: true,
              borderWidth: 2,
              pointRadius: granularity === "week" ? 0 : 3,
              pointHoverRadius: 5,
              tension: 0.35,
            },
          ],
        },
        options: {
          ...compactChartOptions("line"),
          plugins: {
            ...compactChartOptions("line").plugins,
            legend: { display: false },
            tooltip: {
              ...compactChartOptions("line").plugins?.tooltip,
              callbacks: {
                label: (ctx: { parsed: { y: number } }) =>
                  ` ${ctx.parsed.y.toLocaleString()}`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: readThemeColor("--muted"),
                font: { size: granularity === "week" ? 8 : 10 },
                maxTicksLimit: maxTicks,
                maxRotation: 0,
              },
            },
            y: {
              beginAtZero: false,
              grid: {
                color: readThemeColor("--border"),
              },
              ticks: {
                color: readThemeColor("--muted"),
                font: { size: 10 },
                callback: (v) =>
                  typeof v === "number" ? v.toLocaleString() : v,
              },
            },
          },
        },
        plugins: granularity === "week" ? [] : [chartValueLabelsPlugin],
      } as ConstructorParameters<typeof Chart>[1]) as ChartType;
    })();

    return () => {
      cancelled = true;
      ref.current?.destroy();
      ref.current = null;
    };
  }, [data, granularity, canvasId, enabled, theme]);
}

export function customerCountTrend(values: number[]) {
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  if (first === 0) {
    return { growthUp: last >= 0, growthPct: 0 };
  }
  const pct = Math.round(((last - first) / first) * 1000) / 10;
  return { growthUp: last >= first, growthPct: Math.abs(pct) };
}
