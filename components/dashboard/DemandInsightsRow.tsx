"use client";

import type { DashboardQuickAlert, SalesPointsMapData } from "@/types/dashboard";
import { DashboardQuickAlertsPanel } from "./DashboardQuickAlertsPanel";
import { SalesPointsMap } from "./SalesPointsMap";

export function DemandInsightsRow({
  salesPointsMap,
  quickAlerts,
}: {
  salesPointsMap: SalesPointsMapData;
  quickAlerts: DashboardQuickAlert[];
}) {
  return (
    <div className="dashboard-insights-row">
      <SalesPointsMap data={salesPointsMap} />
      <DashboardQuickAlertsPanel alerts={quickAlerts} />
    </div>
  );
}
