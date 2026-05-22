"use client";

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import type { DashboardDailyRevenueHighlight } from "@/types/dashboard";
import { useLiveRevenueCounter } from "@/hooks/useLiveRevenueCounter";
import {
  formatJustInDelta,
  formatLiveRevenueParts,
  parseHighlightRevenueVnd,
} from "@/lib/liveRevenueCounter";
import { MiniSparkline } from "./MiniSparkline";

export function LiveDailyRevenueCard({
  data,
}: {
  data: DashboardDailyRevenueHighlight;
}) {
  const t = useTranslations("dashboard.highlight");
  const locale = useLocale();
  const baseVnd = useMemo(
    () => parseHighlightRevenueVnd(data.todayValue, data.unit),
    [data.todayValue, data.unit]
  );

  const { displayVnd, pulse, lastDeltaVnd } = useLiveRevenueCounter(baseVnd, {
    minBumpVnd: 8_000_000,
    maxBumpVnd: 95_000_000,
  });

  const display = formatLiveRevenueParts(locale, displayVnd, data.unit);
  const up = data.changePct >= 0;

  return (
    <Card size="small" variant="borderless" className="dashboard-highlight-card">
      <div className="dashboard-highlight-head">
        <div className="dashboard-highlight-title-row">
          <span className="dashboard-highlight-title">{data.title}</span>
          <span className="dashboard-highlight-live-badge">{t("live")}</span>
        </div>
        <MiniSparkline values={data.sparkline7d} />
      </div>

      <div
        className={`dashboard-highlight-value ${pulse ? "dashboard-highlight-value--pulse" : ""}`}
        aria-live="polite"
      >
        {display.main}
        <span className="dashboard-highlight-unit">{display.unit}</span>
      </div>

      {lastDeltaVnd != null ? (
        <p className="dashboard-highlight-live-tick">
          {t("justIn", { amount: formatJustInDelta(locale, lastDeltaVnd) })}
        </p>
      ) : null}

      <div
        className={`dashboard-highlight-change ${up ? "dashboard-highlight-change--up" : "dashboard-highlight-change--down"}`}
      >
        {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        <span>
          {up ? "+" : ""}
          {data.changePct.toFixed(1)}%
        </span>
        <span className="dashboard-highlight-change-label">{data.changeLabel}</span>
      </div>
    </Card>
  );
}
