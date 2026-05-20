import { buildCustomerCountChart } from "@/lib/customerCountChart";
import { buildRevenueChart } from "@/lib/dashboardRevenueChart";
import {
  buildProductPerformance,
  buildStorePerformance,
} from "@/lib/dashboardPerformance";
import { buildDashboardQuickAlerts } from "@/lib/dashboardQuickAlerts";
import { buildSalesPointsMap } from "@/lib/salesPointsMap";
import type { DashboardOverview } from "@/types/dashboard";

export const mockDashboardOverviewZh: DashboardOverview = {
  highlight: {
    dailyRevenue: {
      title: "日营收",
      todayValue: "12.4",
      unit: " 亿",
      changePct: 8.3,
      changeLabel: "较昨日",
      sparkline7d: [9.8, 10.2, 10.5, 10.8, 11.2, 11.8, 12.4],
    },
    inventory: {
      title: "总库存",
      totalDisplay: "128,450",
      deadStockPct: 4.2,
      deadStockLabel: "呆滞库存",
      lowStockCount: 37,
      lowStockLabel: "低库存",
    },
    storeHealth: {
      title: "运营状态",
      healthyCount: 32,
      totalStores: 36,
      healthyLabel: "门店运营正常",
      issueCount: 4,
      issueLabel: "门店异常",
      statusSummary: "大部分门店运行平稳",
    },
  },
  charts: {
    revenue: buildRevenueChart("zh"),
  },
  customerCount: buildCustomerCountChart("zh"),
  storePerformance: buildStorePerformance("zh"),
  productPerformance: buildProductPerformance("zh"),
  salesPointsMap: buildSalesPointsMap("zh"),
  quickAlerts: buildDashboardQuickAlerts("zh"),
};
