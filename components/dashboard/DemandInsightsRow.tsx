"use client";

import type { DemandMapData } from "@/types/dashboard";
import { DemandHotspotMap } from "./DemandHotspotMap";
import { PurchaseTimeChart } from "./PurchaseTimeChart";

export function DemandInsightsRow({ demandMap }: { demandMap: DemandMapData }) {
  return (
    <div className="dashboard-insights-row">
      <DemandHotspotMap data={demandMap} />
      <PurchaseTimeChart />
    </div>
  );
}
