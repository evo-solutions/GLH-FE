import { buildCustomerCountChart } from "@/lib/customerCountChart";
import { buildRevenueChart } from "@/lib/dashboardRevenueChart";
import {
  buildProductPerformance,
  buildStorePerformance,
} from "@/lib/dashboardPerformance";
import { buildDashboardQuickAlerts } from "@/lib/dashboardQuickAlerts";
import { buildSalesPointsMap } from "@/lib/salesPointsMap";
import type { DashboardOverview } from "@/types/dashboard";

export const mockDashboardOverview: DashboardOverview = {
  highlight: {
    dailyRevenue: {
      title: "Doanh thu ngày",
      todayValue: "1.24",
      unit: " tỷ",
      changePct: 8.3,
      changeLabel: "so với hôm qua",
      sparkline7d: [0.98, 1.02, 1.05, 1.08, 1.12, 1.18, 1.24],
    },
    inventory: {
      title: "Tổng tồn kho",
      totalDisplay: "128,450",
      deadStockPct: 4.2,
      deadStockLabel: "Dead stock",
      lowStockCount: 37,
      lowStockLabel: "Low stock",
    },
    storeHealth: {
      title: "Trạng thái hoạt động",
      healthyCount: 32,
      totalStores: 36,
      healthyLabel: "cửa hàng hoạt động bình thường",
      issueCount: 4,
      issueLabel: "cửa hàng bất thường",
      statusSummary: "Hầu hết cửa hàng đang vận hành ổn định",
    },
  },
  charts: {
    revenue: buildRevenueChart("vi"),
  },
  customerCount: buildCustomerCountChart("vi"),
  storePerformance: buildStorePerformance("vi"),
  productPerformance: buildProductPerformance("vi"),
  salesPointsMap: buildSalesPointsMap("vi"),
  quickAlerts: buildDashboardQuickAlerts("vi"),
};
