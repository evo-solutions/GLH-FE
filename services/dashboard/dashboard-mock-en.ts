import { buildCustomerCountChart } from "@/lib/customerCountChart";
import { buildRevenueChart } from "@/lib/dashboardRevenueChart";
import {
  buildProductPerformance,
  buildStorePerformance,
} from "@/lib/dashboardPerformance";
import { buildDashboardQuickAlerts } from "@/lib/dashboardQuickAlerts";
import { buildSalesPointsMap } from "@/lib/salesPointsMap";
import type { DashboardOverview } from "@/types/dashboard";

export const mockDashboardOverviewEn: DashboardOverview = {
  highlight: {
    dailyRevenue: {
      title: "Daily revenue",
      todayValue: "1.24",
      unit: "B",
      changePct: 8.3,
      changeLabel: "vs yesterday",
      sparkline7d: [0.98, 1.02, 1.05, 1.08, 1.12, 1.18, 1.24],
    },
    inventory: {
      title: "Total inventory",
      totalDisplay: "128,450",
      deadStockPct: 4.2,
      deadStockLabel: "Dead stock",
      lowStockCount: 37,
      lowStockLabel: "Low stock",
    },
    storeHealth: {
      title: "Operational status",
      healthyCount: 32,
      totalStores: 36,
      healthyLabel: "stores operating normally",
      issueCount: 4,
      issueLabel: "store issues",
      statusSummary: "Most stores are running smoothly",
    },
  },
  charts: {
    revenue: buildRevenueChart("en"),
  },
  customerCount: buildCustomerCountChart("en"),
  storePerformance: buildStorePerformance("en"),
  productPerformance: buildProductPerformance("en"),
  salesPointsMap: buildSalesPointsMap("en"),
  quickAlerts: buildDashboardQuickAlerts("en"),
};
