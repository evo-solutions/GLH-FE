"use client";

import { WarningOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { QUICK_ALERTS_VISIBLE } from "@/lib/dashboardQuickAlerts";
import type { DashboardQuickAlert } from "@/types/dashboard";
import { useRotatingQuickAlerts } from "./useRotatingQuickAlerts";

export function DashboardQuickAlertsPanel({
  alerts,
}: {
  alerts: DashboardQuickAlert[];
}) {
  const t = useTranslations("dashboard.quickAlerts");
  const { visible, leavingId, enteringId } = useRotatingQuickAlerts(alerts);

  return (
    <section className="dashboard-insight-card dashboard-insight-card--alerts">
      <header className="dashboard-insight-header">
        <h4 className="dashboard-insight-title">
          <WarningOutlined className="text-pharma" />
          {t("title")}
        </h4>
        <span className="dashboard-quick-alerts-count">
          {QUICK_ALERTS_VISIBLE} {t("count")}
        </span>
      </header>

      <ul className="dashboard-quick-alerts-list" aria-label={t("aria")} aria-live="polite">
        {visible.map((alert) => {
          const isLeaving = alert.id === leavingId;
          const isEntering = alert.id === enteringId;
          return (
            <li
              key={alert.id}
              className={[
                "dashboard-quick-alert",
                `dashboard-quick-alert--${alert.severity}`,
                isLeaving && "dashboard-quick-alert--leaving",
                isEntering && "dashboard-quick-alert--entering",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <WarningOutlined className="dashboard-quick-alert-icon" aria-hidden />
              <span className="dashboard-quick-alert-text">{alert.message}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
