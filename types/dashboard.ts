export interface DashboardDailyRevenueHighlight {
  title: string;
  todayValue: string;
  unit?: string;
  /** % change vs yesterday (positive = up) */
  changePct: number;
  changeLabel: string;
  sparkline7d: number[];
}

export interface DashboardInventoryHighlight {
  title: string;
  totalDisplay: string;
  deadStockPct: number;
  deadStockLabel: string;
  lowStockCount: number;
  lowStockLabel: string;
}

export interface DashboardStoreHealthHighlight {
  title: string;
  healthyCount: number;
  totalStores: number;
  healthyLabel: string;
  issueCount: number;
  issueLabel: string;
  statusSummary: string;
}

export interface DashboardHighlight {
  dailyRevenue: DashboardDailyRevenueHighlight;
  inventory: DashboardInventoryHighlight;
  storeHealth: DashboardStoreHealthHighlight;
}

export interface ChartSeries {
  labels: string[];
  values: number[];
}

export type RevenueGranularity = "week" | "month" | "year";

export interface RevenueChartData {
  week: ChartSeries;
  month: ChartSeries;
  year: ChartSeries;
}

export interface DashboardCharts {
  revenue: RevenueChartData;
}

export interface ProductRevenueSeries {
  productCode: string;
  name: string;
  values: number[];
  growthUp: boolean;
  growthPct: number;
}

export interface ProductRevenueChartData {
  labels: string[];
  products: ProductRevenueSeries[];
}

export type CustomerCountGranularity = "week" | "month" | "year";

export interface CustomerCountSeries {
  labels: string[];
  values: number[];
}

export interface CustomerCountChartData {
  week: CustomerCountSeries;
  month: CustomerCountSeries;
  year: CustomerCountSeries;
}

export type SalesTrend = "up" | "down" | "flat";

export interface SalesPoint {
  id: string;
  name: string;
  todayRevenue: string;
  /** % thay đổi doanh thu so với hôm qua */
  changePct: number;
  trend: SalesTrend;
  top: string;
  left: string;
}

export interface SalesPointsMapData {
  points: SalesPoint[];
  summary: {
    storeCount: number;
    upCount: number;
    downCount: number;
    flatCount: number;
  };
}

export type QuickAlertSeverity = "danger" | "warning" | "info";

export interface DashboardQuickAlert {
  id: string;
  message: string;
  severity: QuickAlertSeverity;
}

export interface StorePerformanceRow {
  id: string;
  storeCode: string;
  revenue: string;
  cost: string;
  growthPct: number;
  growth: string;
}

export type StorePerformanceData =
  | {
      variant: "stores";
      topStores: StorePerformanceRow[];
      worstStores: StorePerformanceRow[];
    }
  | {
      variant: "imports";
      topImportCompanies: StorePerformanceRow[];
      lowImportCompanies: StorePerformanceRow[];
    };

export interface ProductPerformanceRow {
  id: string;
  productName: string;
  revenue: string;
  customerCount: string;
}

export interface ProductPerformanceData {
  topProducts: ProductPerformanceRow[];
  deadProducts: ProductPerformanceRow[];
}

export interface DashboardOverview {
  highlight: DashboardHighlight;
  charts: DashboardCharts;
  customerCount: CustomerCountChartData;
  storePerformance: StorePerformanceData | null;
  productPerformance: ProductPerformanceData;
  salesPointsMap: SalesPointsMapData;
  quickAlerts: DashboardQuickAlert[];
}
