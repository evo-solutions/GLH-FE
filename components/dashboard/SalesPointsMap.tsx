"use client";

import { ShopOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { SalesPoint, SalesPointsMapData, SalesTrend } from "@/types/dashboard";
import {
  VIETNAM_MAP_PATH,
  VIETNAM_MAP_VIEWBOX,
} from "./vietnamMapGeo";

const VN_SILHOUETTE = (
  <svg
    viewBox={VIETNAM_MAP_VIEWBOX}
    className="dashboard-vn-svg"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden
  >
    <defs>
      <linearGradient id="vnMapFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
        <stop offset="100%" stopColor="var(--success)" stopOpacity="0.12" />
      </linearGradient>
    </defs>
    <path
      fill="url(#vnMapFill)"
      stroke="var(--primary)"
      strokeOpacity="0.35"
      strokeWidth="1.5"
      strokeLinejoin="round"
      d={VIETNAM_MAP_PATH}
    />
  </svg>
);

const TREND_MARKER_CLASS: Record<SalesTrend, string> = {
  up: "stable",
  down: "danger",
  flat: "warning",
};

function formatChangePct(changePct: number): string {
  if (changePct > 0) return `+${changePct.toFixed(1)}%`;
  if (changePct < 0) return `${changePct.toFixed(1)}%`;
  return "0%";
}

export function SalesPointsMap({ data }: { data: SalesPointsMapData }) {
  const t = useTranslations("dashboard.salesMap");

  return (
    <section className="dashboard-insight-card dashboard-insight-card--map">
      <header className="dashboard-insight-header">
        <h4 className="dashboard-insight-title">
          <ShopOutlined className="text-pharma" />
          {t("title")}
        </h4>
        <div className="dashboard-map-summary">
          <span>
            <strong>{data.summary.storeCount}</strong> {t("stores")}
          </span>
          <span className="dashboard-map-summary-dot dashboard-map-summary-dot--stable" />
          <span>{data.summary.upCount}</span>
          <span className="dashboard-map-summary-dot dashboard-map-summary-dot--danger" />
          <span>{data.summary.downCount}</span>
          <span className="dashboard-map-summary-dot dashboard-map-summary-dot--warning" />
          <span>{data.summary.flatCount}</span>
        </div>
      </header>

      <div className="dashboard-map-stage" role="img" aria-label={t("aria")}>
        {VN_SILHOUETTE}
        {data.points.map((point) => (
          <SalesPointMarker key={point.id} point={point} />
        ))}
      </div>

      <footer className="dashboard-map-legend">
        <span>
          <i className="dashboard-legend-dot dashboard-legend-dot--stable" />
          {t("legendUp")}
        </span>
        <span>
          <i className="dashboard-legend-dot dashboard-legend-dot--danger" />
          {t("legendDown")}
        </span>
        <span>
          <i className="dashboard-legend-dot dashboard-legend-dot--warning" />
          {t("legendFlat")}
        </span>
      </footer>
    </section>
  );
}

function SalesPointMarker({ point }: { point: SalesPoint }) {
  const t = useTranslations("dashboard.salesMap");
  const markerClass = TREND_MARKER_CLASS[point.trend];

  return (
    <div
      className={`dashboard-hotspot dashboard-hotspot--${markerClass}`}
      style={{ top: point.top, left: point.left }}
      tabIndex={0}
    >
      <span className="dashboard-hotspot-pulse" aria-hidden />
      <div className="dashboard-hotspot-tooltip">
        <strong>{point.name}</strong>
        <dl>
          <div>
            <dt>{t("todayRevenue")}</dt>
            <dd>{point.todayRevenue}</dd>
          </div>
          <div>
            <dt>{t("vsYesterday")}</dt>
            <dd className={`dashboard-sales-trend dashboard-sales-trend--${point.trend}`}>
              {formatChangePct(point.changePct)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
