"use client";

import { EnvironmentOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { DemandMapData } from "@/types/dashboard";
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
        <stop offset="0%" stopColor="rgba(13, 110, 141, 0.18)" />
        <stop offset="100%" stopColor="rgba(27, 94, 60, 0.12)" />
      </linearGradient>
    </defs>
    <path
      fill="url(#vnMapFill)"
      stroke="rgba(13, 110, 141, 0.35)"
      strokeWidth="1.5"
      strokeLinejoin="round"
      d={VIETNAM_MAP_PATH}
    />
  </svg>
);

export function DemandHotspotMap({ data }: { data: DemandMapData }) {
  const t = useTranslations("dashboard.map");

  return (
    <section className="dashboard-insight-card dashboard-insight-card--map">
      <header className="dashboard-insight-header">
        <h4 className="dashboard-insight-title">
          <EnvironmentOutlined className="text-pharma" />
          {t("title")}
        </h4>
        <div className="dashboard-map-summary">
          <span>
            <strong>{data.summary.regionsMonitored}</strong> {t("regions")}
          </span>
          <span className="dashboard-map-summary-dot dashboard-map-summary-dot--danger" />
          <span>{data.summary.dangerCount}</span>
          <span className="dashboard-map-summary-dot dashboard-map-summary-dot--warning" />
          <span>{data.summary.warningCount}</span>
          <span className="dashboard-map-summary-dot dashboard-map-summary-dot--stable" />
          <span>{data.summary.stableCount}</span>
        </div>
      </header>

      <div
        className="dashboard-map-stage"
        role="img"
        aria-label={t("aria")}
      >
        {VN_SILHOUETTE}
        {data.hotspots.map((spot) => (
          <div
            key={spot.id}
            className={`dashboard-hotspot dashboard-hotspot--${spot.status}`}
            style={{ top: spot.top, left: spot.left }}
            tabIndex={0}
          >
            <span className="dashboard-hotspot-pulse" aria-hidden />
            <div className="dashboard-hotspot-tooltip">
              <strong>{spot.city}</strong>
              <dl>
                <div>
                  <dt>{t("stockOut")}</dt>
                  <dd>{spot.stockOutPct}%</dd>
                </div>
                <div>
                  <dt>{t("vendorScore")}</dt>
                  <dd>{spot.vendorScore}</dd>
                </div>
                <div>
                  <dt>{t("demandTrend")}</dt>
                  <dd>{spot.demandTrend}</dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>

      <footer className="dashboard-map-legend">
        <span>
          <i className="dashboard-legend-dot dashboard-legend-dot--danger" />
          {t("legendDanger")}
        </span>
        <span>
          <i className="dashboard-legend-dot dashboard-legend-dot--warning" />
          {t("legendWarning")}
        </span>
        <span>
          <i className="dashboard-legend-dot dashboard-legend-dot--stable" />
          {t("legendStable")}
        </span>
      </footer>
    </section>
  );
}
