"use client";

import { useEffect, useRef } from "react";
import type { Chart as ChartType } from "chart.js";
import type { DashboardCharts, PurchaseTimeData } from "@/types/dashboard";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { colorWithAlpha } from "@/libs/theme";
import {
  chartValueLabelsPlugin,
  compactChartOptions,
  readChartAccentColors,
  readThemeColor,
} from "./chartOptions";

export function useDashboardCharts(
  charts: DashboardCharts | undefined,
  purchaseTime: PurchaseTimeData | undefined,
  labels: {
    campaign: string;
    purchaseTime: string;
  }
) {
  const ref = useRef<Record<string, ChartType | null | undefined>>({});
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!charts && !purchaseTime) return;

    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;

      Chart.register(chartValueLabelsPlugin);

      const { primary, success, warning } = readChartAccentColors();

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

      if (charts) mount("campaign", "chart-campaign", {
        type: "bar",
        data: {
          labels: charts.campaign.labels,
          datasets: [
            {
              label: labels.campaign,
              data: charts.campaign.values,
              backgroundColor: charts.campaign.values.map((v, i) =>
                i % 3 === 0 ? primary : i % 3 === 1 ? success : warning
              ),
            },
          ],
        },
        options: compactChartOptions("barH"),
        plugins: [chartValueLabelsPlugin],
      });

      if (purchaseTime) {
        const peakSet = new Set(purchaseTime.peakIndices);
        mount("purchaseTime", "chart-purchase-time", {
          type: "bar",
          data: {
            labels: purchaseTime.labels,
            datasets: [
              {
                label: labels.purchaseTime,
                data: purchaseTime.values,
                backgroundColor: purchaseTime.values.map((_, i) =>
                  peakSet.has(i) ? warning : colorWithAlpha(primary, 0.33)
                ),
                borderRadius: 6,
              },
            ],
          },
          options: {
            ...compactChartOptions("bar"),
            plugins: {
              ...compactChartOptions("bar").plugins,
              legend: { display: false },
              tooltip: {
                ...compactChartOptions("bar").plugins?.tooltip,
                callbacks: {
                  label: (ctx: { parsed: { y?: number } }) =>
                    ` ${ctx.parsed.y ?? 0}%`,
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
                max: 25,
                grid: {
                  color: readThemeColor("--border"),
                },
                ticks: {
                  color: readThemeColor("--muted"),
                  font: { size: 10 },
                  callback: (v: string | number) => `${v}%`,
                },
              },
            },
          },
          plugins: [chartValueLabelsPlugin],
        });
      }
    })();

    return () => {
      cancelled = true;
      Object.keys(ref.current).forEach((k) => {
        ref.current[k]?.destroy();
        ref.current[k] = null;
      });
    };
  }, [charts, purchaseTime, labels, theme]);
}
