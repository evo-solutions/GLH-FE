"use client";

import { useEffect, useRef } from "react";
import type { Chart as ChartType } from "chart.js";
import type { LocationOverview } from "@/types/location";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import {
  chartDoughnutLabelsPlugin,
  chartValueLabelsPlugin,
  compactChartOptions,
  readChartAccentColors,
} from "@/components/dashboard/chartOptions";

export function useLocationOverviewCharts(
  data: LocationOverview | undefined,
  labels: {
    staffCosts: string;
    sales: string;
    warehouse: string;
    segmentTotal: string;
  },
  enabled: boolean
) {
  const ref = useRef<Record<string, ChartType | null>>({});
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!enabled || !data) return;

    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;

      Chart.register(chartValueLabelsPlugin, chartDoughnutLabelsPlugin);

      const { primary, success, warning, info, danger } = readChartAccentColors();

      const destroy = (key: string) => {
        ref.current[key]?.destroy();
        ref.current[key] = null;
      };

      const mount = (key: string, canvasId: string, config: object) => {
        destroy(key);
        const el = document.getElementById(canvasId) as HTMLCanvasElement | null;
        if (!el) return;
        ref.current[key] = new Chart(
          el,
          config as ConstructorParameters<typeof Chart>[1]
        ) as ChartType;
      };

      const costTotal = data.charts.staffCosts.values.reduce((a, b) => a + b, 0);

      mount("loc-costs", "loc-chart-costs", {
        type: "doughnut",
        data: {
          labels: data.charts.staffCosts.labels,
          datasets: [
            {
              data: data.charts.staffCosts.values,
              backgroundColor: [primary, warning, success],
              borderWidth: 0,
            },
          ],
        },
        options: {
          ...compactChartOptions("doughnut"),
          plugins: {
            ...compactChartOptions("doughnut").plugins,
            legend: { display: false },
            tooltip: {
              ...compactChartOptions("doughnut").plugins?.tooltip,
              callbacks: {
                label: (ctx: { label?: string; parsed: number }) => {
                  const pct = costTotal
                    ? Math.round((ctx.parsed / costTotal) * 100)
                    : 0;
                  return ` ${ctx.label}: ${ctx.parsed} (${pct}% ${labels.segmentTotal})`;
                },
              },
            },
          },
        },
        plugins: [chartDoughnutLabelsPlugin],
      });

      const peakSet = new Set(
        data.charts.sales.values
          .map((v, i) => ({ v, i }))
          .sort((a, b) => b.v - a.v)
          .slice(0, 2)
          .map((x) => x.i)
      );

      mount("loc-sales", "loc-chart-sales", {
        type: "bar",
        data: {
          labels: data.charts.sales.labels,
          datasets: [
            {
              label: labels.sales,
              data: data.charts.sales.values,
              backgroundColor: data.charts.sales.values.map((_, i) =>
                peakSet.has(i) ? warning : primary
              ),
            },
          ],
        },
        options: compactChartOptions("bar"),
        plugins: [chartValueLabelsPlugin],
      });

      mount("loc-warehouse", "loc-chart-warehouse", {
        type: "bar",
        data: {
          labels: data.charts.warehouse.labels,
          datasets: [
            {
              data: data.charts.warehouse.values,
              backgroundColor: [info, primary, success, warning, danger],
            },
          ],
        },
        options: compactChartOptions("barH"),
        plugins: [chartValueLabelsPlugin],
      });
    })();

    return () => {
      cancelled = true;
      Object.keys(ref.current).forEach((k) => {
        ref.current[k]?.destroy();
        ref.current[k] = null;
      });
    };
  }, [data, labels, theme, enabled]);
}
