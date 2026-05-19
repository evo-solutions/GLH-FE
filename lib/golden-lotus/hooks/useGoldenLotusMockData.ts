"use client";

import { useMessages } from "next-intl";
import type { DashboardHighlightMsgs, GoldenLotusBundle } from "../types";
import type { GlChartMsgs } from "../types/chart-messages";

export function useGoldenLotusMockData() {
  const messages = useMessages();
  const gl = messages.GoldenLotus as GoldenLotusBundle;
  const gChart = messages.GoldenLotus as unknown as GlChartMsgs;
  const dashHighlight = (messages.GoldenLotus as {
    dashboard: { highlight: DashboardHighlightMsgs };
  }).dashboard.highlight;

  return { messages, gl, gChart, dashHighlight };
}
