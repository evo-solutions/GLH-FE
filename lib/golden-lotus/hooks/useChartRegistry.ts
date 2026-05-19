"use client";

import { useCallback, useRef } from "react";
import type { Chart as ChartType } from "chart.js";

export function useChartRegistry() {
  const chartsRef = useRef<Record<string, ChartType | null>>({});

  const destroyChart = useCallback((key: string) => {
    const c = chartsRef.current[key];
    if (c) {
      c.destroy();
      chartsRef.current[key] = null;
    }
  }, []);

  const destroyAllCharts = useCallback(() => {
    Object.keys(chartsRef.current).forEach(destroyChart);
  }, [destroyChart]);

  return { chartsRef, destroyChart, destroyAllCharts };
}
