import type { CustomerCountChartData, RevenueChartData } from "@/types/dashboard";

export type LocationType = "owned" | "franchise";
export type LocationStatus = "active" | "paused" | "setup";

export type CustomerTier = "gold" | "silver" | "bronze";

export type InboundOrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "received"
  | "return_supplier"
  | "return_location";

export interface InboundOrderLineItem {
  productCode: string;
  trackingCode: string;
  name: string;
  qty: number;
  unitPrice: string;
  lineTotal: string;
}

export interface InboundReturnLineItem {
  productCode: string;
  trackingCode: string;
  name: string;
  qty: number;
}

export interface InboundOrderTimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  detail?: string;
}

export interface LocationInboundOrderDetail {
  id: string;
  locationId: string;
  orderCode: string;
  supplier: string;
  status: InboundOrderStatus;
  statusLabel: string;
  items: number;
  totalValue: string;
  orderedAt: string;
  eta?: string;
  receivedAt?: string;
  lineItems: InboundOrderLineItem[];
  returnItems?: InboundReturnLineItem[];
  timeline: InboundOrderTimelineEvent[];
}

export interface LocationListItem {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  typeLabel: string;
  address: string;
  city: string;
  managerName: string;
  staffCount: number;
  status: LocationStatus;
  statusLabel: string;
  monthlyRevenueDisplay: string;
  fillRatePct: number;
  openSince: string;
}

export interface LocationMeta {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  typeLabel: string;
  address: string;
  city: string;
  phone: string;
  status: LocationStatus;
  statusLabel: string;
  openSince: string;
}

export interface ChartSeries {
  labels: string[];
  values: number[];
}

export interface LocationOverview {
  kpis: {
    label: string;
    value: string;
    growth: string;
    growthUp: boolean;
  }[];
  charts: {
    staffCosts: ChartSeries;
    sales: ChartSeries;
    warehouse: ChartSeries;
  };
  revenue: RevenueChartData;
  customerCount: CustomerCountChartData;
}

export interface LocationCostLine {
  id: string;
  name: string;
  amount: string;
  note?: string;
}

export interface LocationTeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  shift: string;
  salary: string;
  status: "active" | "leave";
}

export interface LocationStaffCosts {
  manager: {
    name: string;
    title: string;
    phone: string;
    email: string;
    since: string;
  };
  summary: { total: number; onShift: number; onLeave: number };
  staff: LocationTeamMember[];
  costs: {
    summary: {
      fixedTotal: string;
      variableTotal: string;
      payrollTotal: string;
      monthlyTotal: string;
    };
    fixed: LocationCostLine[];
    variable: LocationCostLine[];
    chart: ChartSeries;
  };
}

export interface LocationPeakHours {
  labels: string[];
  values: number[];
  peakIndices: number[];
}

export interface LocationSalesCustomer {
  id: string;
  name: string;
  phone: string;
  tier: CustomerTier;
  tierLabel: string;
  totalSpent: string;
  visits: number;
  lastVisit: string;
  preferredHour: string;
}

export interface LocationCustomerPurchase {
  id: string;
  date: string;
  time: string;
  amount: string;
  items: string;
  channel: string;
}

export interface CustomerOrderInvoiceLine {
  id: string;
  productCode: string;
  productName: string;
  barcode: string;
  batchNo: string;
  qty: number;
  unitPrice: string;
  lineTotal: string;
}

export interface CustomerOrderInvoice {
  orderCode: string;
  orderedAt: string;
  channel: string;
  touchpoint: string;
  totalAmount: string;
  lines: CustomerOrderInvoiceLine[];
}

export interface CustomerActivityTouchpoint {
  id: string;
  at: string;
  locationId: string;
  locationName: string;
  channel: string;
  touchpoint: string;
  /** Mã hóa đơn POS — chỉ có khi là giao dịch mua hàng. */
  orderCode?: string;
  outcome: string;
}

export interface CustomerVisitedLocation {
  locationId: string;
  locationName: string;
}

export interface CustomerPurchaseSegmentRow {
  segment: string;
  weightPct: number;
  labeledRevenueYear: string;
  orders90d: number;
}

export interface CustomerCohortRow {
  period: string;
  retentionPct: number;
  note: string;
}

export interface CustomerLoyaltyBenchmarkRow {
  segment: string;
  members: number;
  avgFrequency90d: number;
  ltvIndex: number;
  status: string;
}

export interface LocationCustomerDetail {
  id: string;
  locationId: string;
  name: string;
  phone: string;
  email?: string;
  tier: CustomerTier;
  tierLabel: string;
  rating: number;
  ratingLabel: string;
  totalSpent: string;
  visits: number;
  avgBasket: string;
  preferredHours: string[];
  memberSince: string;
  loyaltySegment: string;
  visitedLocations: CustomerVisitedLocation[];
  activityTouchpoints: CustomerActivityTouchpoint[];
  orderInvoices: Record<string, CustomerOrderInvoice>;
  purchaseSegments: CustomerPurchaseSegmentRow[];
  cohortRetention: CustomerCohortRow[];
  loyaltyBenchmarks: CustomerLoyaltyBenchmarkRow[];
  timeline: LocationCustomerPurchase[];
  notes?: string;
}

export interface LocationSales {
  summary: {
    totalCustomers: number;
    goldCount: number;
    silverCount: number;
    bronzeCount: number;
    todayRevenue: string;
  };
  peakHours: LocationPeakHours;
  tierChart: ChartSeries;
  customers: LocationSalesCustomer[];
}

export interface LocationInventoryItem {
  id: string;
  productCode: string;
  name: string;
  category: string;
  sellPrice: string;
  importPrice: string;
  stock: number;
  minStock: number;
  status: "ok" | "low" | "out";
  statusLabel: string;
}

export interface LocationInboundOrder {
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
  productLineItems: { productCode: string; name: string }[];
  trackingCodes: string;
  productSummary: string;
  lastEvent: string;
}

export interface LocationWarehouse {
  summary: {
    skuCount: number;
    lowStock: number;
    stockValue: string;
    pendingOrders: number;
    inTransit: number;
  };
  items: LocationInventoryItem[];
}
