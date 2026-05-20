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
  chartValueLabelsThousandsPlugin,
  compactChartOptions,
  customerCountYScale,
  formatCountInThousands,
  markChartThousandsLabels,
  readChartAccentColors,
  readThemeColor,
  unmarkChartThousandsLabels,
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

    const series = data[granularity];

    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;

      Chart.register(chartValueLabelsThousandsPlugin);

      ref.current?.destroy();
      ref.current = null;

      const el = document.getElementById(canvasId) as HTMLCanvasElement | null;
      if (!el) return;

      markChartThousandsLabels(canvasId);
      const { primary } = readChartAccentColors();

      const maxTicks =
        granularity === "month" ? 12 : granularity === "week" ? 12 : 6;
      const yScale = customerCountYScale(series.values);

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
              pointRadius: 3,
              pointHoverRadius: 5,
              tension: 0.35,
            },
          ],
        },
        options: {
          ...compactChartOptions("line"),
          layout: { padding: { top: 28, right: 8, bottom: 4, left: 4 } },
          plugins: {
            ...compactChartOptions("line").plugins,
            legend: { display: false },
            tooltip: {
              ...compactChartOptions("line").plugins?.tooltip,
              callbacks: {
                label: (ctx: { parsed: { y: number } }) =>
                  ` ${formatCountInThousands(ctx.parsed.y)}`,
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
              suggestedMin: yScale.suggestedMin,
              suggestedMax: yScale.suggestedMax,
              grid: {
                color: readThemeColor("--border"),
              },
              ticks: {
                stepSize: yScale.stepSize,
                color: readThemeColor("--muted"),
                font: { size: 10 },
                callback: (v) =>
                  typeof v === "number" ? formatCountInThousands(v) : v,
              },
            },
          },
        },
        plugins: [chartValueLabelsThousandsPlugin],
      } as ConstructorParameters<typeof Chart>[1]) as ChartType;
    })();

    return () => {
      cancelled = true;
      unmarkChartThousandsLabels(canvasId);
      ref.current?.destroy();
      ref.current = null;
    };
  }, [data, granularity, canvasId, enabled, theme]);
}
