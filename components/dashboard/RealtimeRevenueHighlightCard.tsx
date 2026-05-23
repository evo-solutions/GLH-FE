"use client";

import { useMemo } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useTranslations } from "next-intl";
import { useRealtimeRevenue } from "@/hooks/useRealtimeRevenue";
import { parseRevenueBillions } from "@/lib/realtimeRevenue";
import type { DashboardDailyRevenueHighlight } from "@/types/dashboard";
import { MiniSparkline } from "./MiniSparkline";

export function RealtimeRevenueHighlightCard({
  data,
}: {
  data: DashboardDailyRevenueHighlight;
}) {
  const t = useTranslations("dashboard.highlight");
  const initial = parseRevenueBillions(data.todayValue);
  const { value, formatted, formattedIncrement, tickFlash } =
    useRealtimeRevenue(initial);
  const up = data.changePct >= 0;

  const sparkline = useMemo(() => {
    const points = [...data.sparkline7d];
    if (points.length > 0) points[points.length - 1] = value;
    return points;
  }, [data.sparkline7d, value]);

  const unit = data.unit?.trim() || t("billionUnit");

  return (
    <Card
      size="small"
      variant="borderless"
      className="dashboard-highlight-card dashboard-revenue-live-card"
    >
      <div className="dashboard-revenue-live-spark" aria-hidden>
        <MiniSparkline values={sparkline} width={108} height={44} />
      </div>

      <div className="dashboard-revenue-live-top">
        <span className="dashboard-revenue-live-label">{t("dailyRevenue")}</span>
        <span className="dashboard-revenue-live-badge">{t("live")}</span>
      </div>

      <div
        className={`dashboard-revenue-live-total ${tickFlash ? "dashboard-revenue-live-total--pulse" : ""}`}
      >
        <span className="dashboard-revenue-live-amount">{formatted}</span>
        <span className="dashboard-revenue-live-unit"> {unit}</span>
      </div>

      {formattedIncrement ? (
        <p
          className={`dashboard-revenue-live-tick ${tickFlash ? "dashboard-revenue-live-tick--flash" : ""}`}
        >
          +{formattedIncrement} {t("justRecorded")}
        </p>
      ) : (
        <p className="dashboard-revenue-live-tick dashboard-revenue-live-tick--placeholder">
          {t("waitingTick")}
        </p>
      )}

      <p
        className={`dashboard-revenue-live-compare ${up ? "dashboard-revenue-live-compare--up" : "dashboard-revenue-live-compare--down"}`}
      >
        {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        <span className="dashboard-revenue-live-compare-pct">
          {up ? "+" : ""}
          {data.changePct.toFixed(1)}%
        </span>
        <span className="dashboard-revenue-live-compare-label">
          {data.changeLabel}
        </span>
      </p>
    </Card>
  );
}
