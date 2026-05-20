"use client";

import { useEffect, useRef } from "react";
import type { Chart as ChartType } from "chart.js";
import type { ProductRevenueChartData } from "@/types/dashboard";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import {
  chartValueLabelsPlugin,
  compactChartOptions,
  readChartAccentColors,
  readThemeColor,
} from "./chartOptions";

function productLineColors() {
  const c = readChartAccentColors();
  return [
    c.primary,
    c.success,
    c.warning,
    c.info,
    c.danger,
    c.chart2,
    c.chart3,
    c.chart4,
    c.primary,
    c.success,
    c.warning,
  ];
}

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
            const colors = productLineColors();
            const color = colors[i % colors.length];
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
                color: readThemeColor("--text"),
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
                color: readThemeColor("--muted"),
                font: { size: 10 },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: readThemeColor("--border"),
              },
              ticks: {
                color: readThemeColor("--muted"),
                font: { size: 10 },
              },
              title: {
                display: true,
                text: labels.productRevenueUnit,
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
  }, [data, canvasId, enabled, labels, theme]);
}
