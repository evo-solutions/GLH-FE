"use client";

import { ClockCircleOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

export function PurchaseTimeChart() {
  const t = useTranslations("dashboard.purchaseTime");

  return (
    <section className="dashboard-insight-card dashboard-insight-card--purchase">
      <header className="dashboard-insight-header">
        <h4 className="dashboard-insight-title">
          <ClockCircleOutlined className="text-pharma" />
          {t("title")}
        </h4>
      </header>

      <div className="dashboard-chart-wrap dashboard-chart-wrap--purchase">
        <canvas id="chart-purchase-time" />
      </div>
    </section>
  );
}
