import { buildCustomerCountChart } from "@/lib/customerCountChart";
import { buildRevenueChart } from "@/lib/dashboardRevenueChart";
import {
  buildHoldingImportPerformance,
  buildProductPerformance,
  buildSubsidiaryStorePerformance,
} from "@/lib/dashboardPerformance";
import { buildDashboardQuickAlerts } from "@/lib/dashboardQuickAlerts";
import { buildSalesPointsMap } from "@/lib/salesPointsMap";
import type { OrgScopeConfig } from "@/libs/org-scope/types";
import type { DashboardOverview } from "@/types/dashboard";

export type DashboardScopeKind = "holding" | "subsidiary" | "external";

export function dashboardScopeKind(scope?: OrgScopeConfig): DashboardScopeKind {
  if (!scope) return "holding";
  if (scope.kind === "subsidiary") return "subsidiary";
  return "external";
}

function buildHighlight(locale: "vi" | "en" | "zh") {
  if (locale === "en") {
    return {
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
        title: "Operating status",
        healthyCount: 32,
        totalStores: 36,
        healthyLabel: "stores operating normally",
        issueCount: 4,
        issueLabel: "stores with issues",
        statusSummary: "Most stores are running smoothly",
      },
    };
  }
  if (locale === "zh") {
    return {
      dailyRevenue: {
        title: "日营收",
        todayValue: "1.24",
        unit: "十亿",
        changePct: 8.3,
        changeLabel: "较昨日",
        sparkline7d: [0.98, 1.02, 1.05, 1.08, 1.12, 1.18, 1.24],
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
        healthyLabel: "家门店正常运营",
        issueCount: 4,
        issueLabel: "家门店异常",
        statusSummary: "大部分门店运行平稳",
      },
    };
  }
  return {
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
  };
}

export function buildDashboardOverview(
  locale: string,
  scopeKind: DashboardScopeKind,
): DashboardOverview {
  const loc = locale === "en" || locale === "zh" ? locale : "vi";

  const storePerformance =
    scopeKind === "holding"
      ? buildHoldingImportPerformance(loc)
      : buildSubsidiaryStorePerformance(loc);

  return {
    highlight: buildHighlight(loc),
    charts: { revenue: buildRevenueChart(loc) },
    customerCount: buildCustomerCountChart(loc),
    storePerformance,
    productPerformance: buildProductPerformance(loc),
    salesPointsMap: buildSalesPointsMap(loc),
    quickAlerts: buildDashboardQuickAlerts(loc),
  };
}
