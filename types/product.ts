import type { InboundOrderStatus } from "@/types/location";

export type ProductSalesStatus = "hot" | "stable" | "slow" | "out" | "new";

export type ProductUnitStatus = "ok" | "near_expiry" | "expired";

export type ProductUnitPlacement = "central" | "location";

export type ProductUnitCondition = "sealed" | "opened";

/** Một đơn vị tồn vật lý (hộp, gói, …) thuộc loại sản phẩm (product). */
export interface ProductUnitInstance {
  id: string;
  barcode: string;
  batchNo: string;
  imageUrl: string;
  importedAt: string;
  expiresAt: string;
  importPrice: string;
  sellPrice: string;
  condition: ProductUnitCondition;
  conditionLabel: string;
  /** `central` = kho tổng; `location` = đã gán cơ sở. */
  placement: ProductUnitPlacement;
  /** `null` khi đang ở kho tổng. */
  locationId: string | null;
  locationName: string;
  locationCode: string;
  status: ProductUnitStatus;
  statusLabel: string;
}

export interface ProductListItem {
  productCode: string;
  name: string;
  category: string;
  brand: string;
  sellPrice: string;
  importPrice: string;
  status: ProductSalesStatus;
  statusLabel: string;
  monthlyUnits: number;
  monthlyRevenue: string;
  growth: string;
  growthUp: boolean;
  totalStock: number;
  locationCount: number;
  avgDailyUnits: number;
}

export interface ProductKpi {
  label: string;
  value: string;
  growth?: string;
  growthUp?: boolean;
}

export interface ChartSeries {
  labels: string[];
  values: number[];
}

export interface ProductMeta {
  productCode: string;
  name: string;
  category: string;
  brand: string;
  sellPrice: string;
  importPrice: string;
  marginPct: number;
  status: ProductSalesStatus;
  statusLabel: string;
  launchedAt: string;
  description: string;
  instanceCount: number;
}

export interface ProductOverview {
  kpis: ProductKpi[];
  salesTrend: ChartSeries;
  locationShare: ChartSeries;
  channelMix: ChartSeries;
}

export interface ProductInboundOrder {
  id: string;
  locationId: string;
  locationCode: string;
  locationName: string;
  orderCode: string;
  supplier: string;
  status: InboundOrderStatus;
  statusLabel: string;
  items: number;
  totalValue: string;
  orderedAt: string;
  eta?: string;
  receivedAt?: string;
  returnedAt?: string;
  shipmentTracking?: string;
  productCodes: string;
  trackingCodes: string;
  productSummary: string;
  lastEvent: string;
  /** Số lượng loại SP này trong đơn. */
  productQty: number;
}

export interface ProductDetail {
  meta: ProductMeta;
  overview: ProductOverview;
  instances: ProductUnitInstance[];
  instanceTotal: number;
  inboundOrders: ProductInboundOrder[];
}
