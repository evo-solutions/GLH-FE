"use client";

import { useEffect, useRef } from "react";
import type { Chart as ChartType } from "chart.js";
import type { RevenueChartData, RevenueGranularity } from "@/types/dashboard";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { colorWithAlpha } from "@/libs/theme";
import {
  chartValueLabelsPlugin,
  compactChartOptions,
  readChartAccentColors,
  readThemeColor,
} from "./chartOptions";

export function useRevenueChart(
  data: RevenueChartData | undefined,
  granularity: RevenueGranularity,
  canvasId: string,
  datasetLabel: string,
  enabled: boolean
) {
  const ref = useRef<ChartType | null>(null);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!enabled || !data) return;

    const series = data[granularity];

    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;

      Chart.register(chartValueLabelsPlugin);

      ref.current?.destroy();
      ref.current = null;

      const el = document.getElementById(canvasId) as HTMLCanvasElement | null;
      if (!el) return;

      const { primary } = readChartAccentColors();
      const maxTicks =
        granularity === "month" ? 12 : granularity === "week" ? 12 : 6;

      ref.current = new Chart(el, {
        type: "line",
        data: {
          labels: series.labels,
          datasets: [
            {
              label: datasetLabel,
              data: series.values,
              borderColor: primary,
              backgroundColor: colorWithAlpha(primary, 0.1),
              fill: true,
              borderWidth: 2,
              pointRadius: 3,
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
                font: { size: 10 },
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
              },
            },
          },
        },
        plugins: [chartValueLabelsPlugin],
      } as ConstructorParameters<typeof Chart>[1]) as ChartType;
    })();

    return () => {
      cancelled = true;
      ref.current?.destroy();
      ref.current = null;
    };
  }, [data, granularity, canvasId, datasetLabel, enabled, theme]);
}
