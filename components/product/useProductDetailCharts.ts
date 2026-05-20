"use client";

import { useEffect, useRef } from "react";
import type { Chart as ChartType } from "chart.js";
import type { ProductDetail } from "@/types/product";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { colorWithAlpha } from "@/libs/theme";
import {
  chartDoughnutLabelsPlugin,
  chartValueLabelsPlugin,
  compactChartOptions,
  readChartAccentColors,
} from "@/components/dashboard/chartOptions";

export function useProductDetailCharts(data: ProductDetail | undefined, enabled: boolean) {
  const salesRef = useRef<ChartType | null>(null);
  const locationRef = useRef<ChartType | null>(null);
  const channelRef = useRef<ChartType | null>(null);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!enabled || !data) return;
    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;
      Chart.register(chartValueLabelsPlugin, chartDoughnutLabelsPlugin);

      const { primary, success, warning, chart3 } = readChartAccentColors();

      const destroy = () => {
        salesRef.current?.destroy();
        locationRef.current?.destroy();
        channelRef.current?.destroy();
        salesRef.current = null;
        locationRef.current = null;
        channelRef.current = null;
      };
      destroy();

      const salesEl = document.getElementById("product-chart-sales") as HTMLCanvasElement | null;
      if (salesEl) {
        salesRef.current = new Chart(salesEl, {
          type: "line",
          data: {
            labels: data.overview.salesTrend.labels,
            datasets: [
              {
                data: data.overview.salesTrend.values,
                borderColor: primary,
                backgroundColor: colorWithAlpha(primary, 0.12),
                fill: true,
                tension: 0.35,
                pointRadius: 3,
              },
            ],
          },
          options: compactChartOptions("line"),
          plugins: [chartValueLabelsPlugin],
        } as ConstructorParameters<typeof Chart>[1]) as ChartType;
      }

      const locEl = document.getElementById("product-chart-location") as HTMLCanvasElement | null;
      if (locEl) {
        locationRef.current = new Chart(locEl, {
          type: "doughnut",
          data: {
            labels: data.overview.locationShare.labels,
            datasets: [
              {
                data: data.overview.locationShare.values,
                backgroundColor: [primary, success, warning, chart3],
                borderWidth: 0,
              },
            ],
          },
          options: compactChartOptions("doughnut"),
          plugins: [chartDoughnutLabelsPlugin],
        } as ConstructorParameters<typeof Chart>[1]) as ChartType;
      }

      const chEl = document.getElementById("product-chart-channel") as HTMLCanvasElement | null;
      if (chEl) {
        channelRef.current = new Chart(chEl, {
          type: "doughnut",
          data: {
            labels: data.overview.channelMix.labels,
            datasets: [
              {
                data: data.overview.channelMix.values,
                backgroundColor: [primary, warning, success, chart3],
                borderWidth: 0,
              },
            ],
          },
          options: compactChartOptions("doughnut"),
          plugins: [chartDoughnutLabelsPlugin],
        } as ConstructorParameters<typeof Chart>[1]) as ChartType;
      }
    })();

    return () => {
      cancelled = true;
      salesRef.current?.destroy();
      locationRef.current?.destroy();
      channelRef.current?.destroy();
    };
  }, [data, theme, enabled]);
}
