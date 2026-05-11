"use client";

import { useEffect, useRef } from "react";
import type { Chart as ChartType } from "chart.js";
import type { ProductRevenueChartData } from "@/types/dashboard";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import {
  chartValueLabelsPlugin,
  compactChartOptions,
  readThemeColor,
} from "./chartOptions";

const PRODUCT_LINE_COLORS = [
  "#0d6e8d",
  "#1b5e3c",
  "#c9a94f",
  "#1f6fad",
  "#c45c4a",
  "#6b4fa0",
  "#2a9d8f",
  "#e76f51",
  "#5a7580",
  "#84a98c",
  "#bc6c25",
];

export function useProductRevenueChart(
  data: ProductRevenueChartData | undefined,
  canvasId: string,
  enabled: boolean,
  labels: {
    productRevenueUnit: string;
  }
) {
  const ref = useRef<ChartType | null>(null);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!enabled || !data) return;

    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;

      Chart.register(chartValueLabelsPlugin);

      ref.current?.destroy();
      ref.current = null;

      const el = document.getElementById(canvasId) as HTMLCanvasElement | null;
      if (!el) return;

      ref.current = new Chart(el, {
        type: "line",
        data: {
          labels: data.labels,
          datasets: data.products.map((p, i) => {
            const color = PRODUCT_LINE_COLORS[i % PRODUCT_LINE_COLORS.length];
            const trend = p.growthUp ? "↑" : "↓";
            return {
              label: `${p.name} (${trend}${p.growthPct}%)`,
              data: p.values,
              borderColor: color,
              backgroundColor: "transparent",
              borderWidth: 2,
              pointRadius: 2,
              pointHoverRadius: 4,
              tension: 0.35,
            };
          }),
        },
        options: {
          ...compactChartOptions("line"),
          plugins: {
            ...compactChartOptions("line").plugins,
            legend: {
              display: true,
              position: "right",
              align: "start",
              labels: {
                boxWidth: 10,
                boxHeight: 2,
                padding: 8,
                font: { size: 9, weight: 500 },
                color: readThemeColor("--text", "#0e2a33"),
              },
            },
            tooltip: {
              ...compactChartOptions("line").plugins?.tooltip,
              callbacks: {
                label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) =>
                  ` ${ctx.dataset.label ?? ""}: ${ctx.parsed.y} ${labels.productRevenueUnit}`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: readThemeColor("--muted", "#5a7580"),
                font: { size: 10 },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: readThemeColor("--border", "rgba(13, 110, 141, 0.18)"),
              },
              ticks: {
                color: readThemeColor("--muted", "#5a7580"),
                font: { size: 10 },
              },
              title: {
                display: true,
                text: labels.productRevenueUnit,
                color: readThemeColor("--muted", "#5a7580"),
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
  }, [data, canvasId, enabled, labels, theme]);
}
