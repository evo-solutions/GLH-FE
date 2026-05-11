export type AlertStatus = "danger" | "warning" | "success" | "processing";

export interface DashboardHighlight {
  c1t: string;
  c1v: string;
  c1s?: string;
  c2t: string;
  c2v: string;
  c3t: string;
  c3v: string;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: number;
  display: string;
  growth: string;
  growthUp: boolean;
  spark: number[];
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
  campaign: ChartSeries;
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

export type CustomerCountGranularity = "month" | "week" | "day";

export interface CustomerCountSeries {
  labels: string[];
  values: number[];
}

export interface CustomerCountChartData {
  month: CustomerCountSeries;
  week: CustomerCountSeries;
  day: CustomerCountSeries;
}

export interface DashboardAlert {
  id: string;
  priority: string;
  signal: string;
  source: string;
  decision: string;
  owner: string;
  sla: string;
  status: AlertStatus;
  statusLabel: string;
}

export type HotspotStatus = "danger" | "warning" | "stable";

export interface DemandHotspot {
  id: string;
  city: string;
  status: HotspotStatus;
  stockOutPct: number;
  vendorScore: number;
  demandTrend: string;
  top: string;
  left: string;
}

export interface DemandMapData {
  hotspots: DemandHotspot[];
  summary: {
    regionsMonitored: number;
    dangerCount: number;
    warningCount: number;
    stableCount: number;
  };
}

/** Tỷ lệ đơn mua theo khung giờ trong ngày (%). */
export interface PurchaseTimeData {
  labels: string[];
  values: number[];
  peakIndices: number[];
}

export interface DashboardOverview {
  highlight: DashboardHighlight;
  kpis: DashboardKpi[];
  charts: DashboardCharts;
  customerCount: CustomerCountChartData;
  demandMap: DemandMapData;
  purchaseTime: PurchaseTimeData;
  alerts: DashboardAlert[];
}
