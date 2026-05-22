import {
  B2B_PRODUCT_LINES,
  getB2BCustomerRecord,
  getB2BProductLinesForSegment,
  productLineLabel,
  type B2BProductLineKey,
} from "@/lib/b2bCustomerCatalog";
import { getB2BCustomerDisplayName } from "@/lib/b2bCustomerListData";
import { mockLineItem } from "@/lib/locationMockItems";
import type { LocationInboundOrder, LocationInboundOrderDetail } from "@/types/location";

/** Kho trung tâm Holding — đơn xuất B2B cho khách hàng B */
export const HOLDING_CENTRAL_WAREHOUSE_ID = "wh-bsv-central";

export const HOLDING_WAREHOUSE_LABEL = {
  vi: "Tổng kho các cơ sở",
  en: "Consolidated warehouse (all units)",
  zh: "各门店总仓",
} as const;

type Locale = "vi" | "en" | "zh";

interface HoldingOrderSpec {
  id: string;
  orderCode: string;
  customerId: string;
  status: LocationInboundOrderDetail["status"];
  statusLabel: { vi: string; en: string; zh: string };
  items: number;
  totalValue: { vi: string; en: string; zh: string };
  orderedAt: string;
  eta?: string;
  receivedAt?: string;
  lines: { key: B2BProductLineKey; qty: number; totalVi: string }[];
  timeline: LocationInboundOrderDetail["timeline"];
}

const HOLDING_ORDER_SPECS: HoldingOrderSpec[] = [
  {
    id: "h-io1",
    orderCode: "SO-BSV-2026-0901",
    customerId: "b2b-hospital",
    status: "shipping",
    statusLabel: { vi: "Đang giao hàng", en: "Out for delivery", zh: "配送中" },
    items: 240,
    totalValue: { vi: "₫2.8 tỷ", en: "₫2.8B", zh: "28亿₫" },
    orderedAt: "18/05/2026",
    eta: "22/05/2026",
    lines: [
      { key: "tcm-etc", qty: 120, totalVi: "₫1.44 tỷ" },
      { key: "medicinal-material", qty: 80, totalVi: "₫960 tr" },
      { key: "medicinal-tea", qty: 40, totalVi: "₫400 tr" },
    ],
    timeline: [
      { id: "h1", date: "18/05/2026", time: "08:00", title: "Đặt đơn", detail: "BV YHCT · đơn quý II" },
      { id: "h2", date: "19/05/2026", time: "14:00", title: "Đang vận chuyển", detail: "Xe lạnh BSV-8840" },
    ],
  },
  {
    id: "h-io2",
    orderCode: "SO-BSV-2026-0412",
    customerId: "b2b-pharma-mfg",
    status: "confirmed",
    statusLabel: { vi: "Đã xác nhận", en: "Confirmed", zh: "已确认" },
    items: 320,
    totalValue: { vi: "₫4.2 tỷ", en: "₫4.2B", zh: "42亿₫" },
    orderedAt: "15/05/2026",
    eta: "17/05/2026",
    lines: [
      { key: "herb-ingredient", qty: 200, totalVi: "₫900 tr" },
      { key: "medicinal-material", qty: 120, totalVi: "₫2.16 tỷ" },
      { key: "tcm-otc", qty: 80, totalVi: "₫680 tr" },
      { key: "medicinal-tea", qty: 60, totalVi: "₫460 tr" },
    ],
    timeline: [
      { id: "h3", date: "15/05/2026", time: "10:00", title: "Đặt đơn", detail: "SX dược & TPCN" },
      { id: "h4", date: "16/05/2026", time: "09:00", title: "Đã xuất kho", detail: "Chờ vận chuyển" },
    ],
  },
  {
    id: "h-io3",
    orderCode: "SO-BSV-2026-0888",
    customerId: "b2b-dist-gt",
    status: "received",
    statusLabel: { vi: "Đã giao", en: "Delivered", zh: "已交付" },
    items: 1800,
    totalValue: { vi: "₫1.1 tỷ", en: "₫1.1B", zh: "11亿₫" },
    orderedAt: "10/05/2026",
    eta: "12/05/2026",
    receivedAt: "12/05/2026",
    lines: [
      { key: "yogi-food", qty: 600, totalVi: "₫288 tr" },
      { key: "thuong-son-tra", qty: 400, totalVi: "₫380 tr" },
      { key: "medicinal-tea", qty: 500, totalVi: "₫325 tr" },
      { key: "nutrition-snacks", qty: 300, totalVi: "₫107 tr" },
    ],
    timeline: [
      { id: "h5", date: "12/05/2026", time: "16:30", title: "Đã nhập kho", detail: "Bách Hóa Xanh · GT" },
    ],
  },
  {
    id: "h-io4",
    orderCode: "SO-BSV-2026-0755",
    customerId: "b2b-pharmacy",
    status: "confirmed",
    statusLabel: { vi: "Đã xác nhận", en: "Confirmed", zh: "已确认" },
    items: 96,
    totalValue: { vi: "₫620 tr", en: "₫620M", zh: "6.2亿₫" },
    orderedAt: "14/05/2026",
    eta: "16/05/2026",
    lines: [
      { key: "tcm-otc", qty: 48, totalVi: "₫408 tr" },
      { key: "medicinal-tea", qty: 32, totalVi: "₫208 tr" },
    ],
    timeline: [
      { id: "h6", date: "14/05/2026", time: "11:00", title: "Đặt đơn", detail: "Nhà thuốc · đợt 5/2026" },
    ],
  },
  {
    id: "h-io5",
    orderCode: "SO-BSV-2026-0701",
    customerId: "b2b-dist-mt",
    status: "shipping",
    statusLabel: { vi: "Đang giao hàng", en: "Out for delivery", zh: "配送中" },
    items: 2400,
    totalValue: { vi: "₫890 tr", en: "₫890M", zh: "8.9亿₫" },
    orderedAt: "16/05/2026",
    eta: "20/05/2026",
    lines: [
      { key: "yogi-food", qty: 800, totalVi: "₫384 tr" },
      { key: "thuong-son-tra", qty: 500, totalVi: "₫475 tr" },
      { key: "spices", qty: 600, totalVi: "₫192 tr" },
      { key: "medicinal-aroma", qty: 500, totalVi: "₫275 tr" },
    ],
    timeline: [
      { id: "h7", date: "16/05/2026", time: "08:30", title: "Đặt đơn", detail: "Siêu thị MT" },
      { id: "h8", date: "17/05/2026", time: "15:00", title: "Đang vận chuyển", detail: "Container BSV-MT-02" },
    ],
  },
  {
    id: "h-io6",
    orderCode: "SO-BSV-2026-0650",
    customerId: "b2b-ecom",
    status: "received",
    statusLabel: { vi: "Đã giao", en: "Delivered", zh: "已交付" },
    items: 420,
    totalValue: { vi: "₫340 tr", en: "₫340M", zh: "3.4亿₫" },
    orderedAt: "08/05/2026",
    eta: "10/05/2026",
    receivedAt: "10/05/2026",
    lines: [
      { key: "yogi-food", qty: 150, totalVi: "₫72 tr" },
      { key: "thuong-son-tra", qty: 120, totalVi: "₫114 tr" },
      { key: "medicinal-tea", qty: 100, totalVi: "₫65 tr" },
      { key: "nutrition-snacks", qty: 50, totalVi: "₫14 tr" },
    ],
    timeline: [
      { id: "h9", date: "10/05/2026", time: "09:00", title: "Đã nhập kho", detail: "E-commerce fulfillment" },
    ],
  },
  {
    id: "h-io7",
    orderCode: "SO-BSV-2026-0601",
    customerId: "b2b-clinic",
    status: "confirmed",
    statusLabel: { vi: "Đã xác nhận", en: "Confirmed", zh: "已确认" },
    items: 64,
    totalValue: { vi: "₫480 tr", en: "₫480M", zh: "4.8亿₫" },
    orderedAt: "12/05/2026",
    eta: "14/05/2026",
    lines: [
      { key: "tcm-etc", qty: 24, totalVi: "₫288 tr" },
      { key: "herb-ingredient", qty: 30, totalVi: "₫135 tr" },
      { key: "medicinal-diet", qty: 10, totalVi: "₫72 tr" },
    ],
    timeline: [
      { id: "h10", date: "12/05/2026", time: "14:00", title: "Đặt đơn", detail: "Phòng chẩn trị YHCT" },
    ],
  },
  {
    id: "h-io8",
    orderCode: "SO-BSV-2026-0550",
    customerId: "b2b-herbal",
    status: "shipping",
    statusLabel: { vi: "Đang giao hàng", en: "Out for delivery", zh: "配送中" },
    items: 500,
    totalValue: { vi: "₫1.5 tỷ", en: "₫1.5B", zh: "15亿₫" },
    orderedAt: "11/05/2026",
    eta: "15/05/2026",
    lines: [
      { key: "medicinal-material", qty: 300, totalVi: "₫540 tr" },
      { key: "herb-ingredient", qty: 150, totalVi: "₫675 tr" },
      { key: "medicinal-tea", qty: 50, totalVi: "₫325 tr" },
    ],
    timeline: [
      { id: "h11", date: "11/05/2026", time: "10:00", title: "Đặt đơn", detail: "KD dược liệu" },
      { id: "h12", date: "13/05/2026", time: "08:00", title: "Đang vận chuyển", detail: "Xe BSV-DL-11" },
    ],
  },
  {
    id: "h-io9",
    orderCode: "SO-BSV-2026-0501",
    customerId: "b2b-cosmetics",
    status: "confirmed",
    statusLabel: { vi: "Đã xác nhận", en: "Confirmed", zh: "已确认" },
    items: 180,
    totalValue: { vi: "₫720 tr", en: "₫720M", zh: "7.2亿₫" },
    orderedAt: "09/05/2026",
    eta: "11/05/2026",
    lines: [
      { key: "herb-ingredient", qty: 100, totalVi: "₫450 tr" },
      { key: "medicinal-material", qty: 80, totalVi: "₫270 tr" },
    ],
    timeline: [
      { id: "h13", date: "09/05/2026", time: "13:00", title: "Đặt đơn", detail: "Hóa mỹ phẩm & Hàng tiêu dùng" },
    ],
  },
  {
    id: "h-io10",
    orderCode: "SO-BSV-2026-0488",
    customerId: "b2b-dist-mbaby",
    status: "received",
    statusLabel: { vi: "Đã giao", en: "Delivered", zh: "已交付" },
    items: 960,
    totalValue: { vi: "₫540 tr", en: "₫540M", zh: "5.4亿₫" },
    orderedAt: "07/05/2026",
    eta: "09/05/2026",
    receivedAt: "09/05/2026",
    lines: [
      { key: "yogi-food", qty: 400, totalVi: "₫192 tr" },
      { key: "nutrition-snacks", qty: 350, totalVi: "₫98 tr" },
      { key: "medicinal-tea", qty: 210, totalVi: "₫137 tr" },
    ],
    timeline: [
      { id: "h14", date: "09/05/2026", time: "11:00", title: "Đã nhập kho", detail: "Kênh Siêu thị Mẹ Bé" },
    ],
  },
  {
    id: "h-io11",
    orderCode: "SO-BSV-2026-0470",
    customerId: "b2b-social",
    status: "confirmed",
    statusLabel: { vi: "Đã xác nhận", en: "Confirmed", zh: "已确认" },
    items: 120,
    totalValue: { vi: "₫185 tr", en: "₫185M", zh: "1.85亿₫" },
    orderedAt: "06/05/2026",
    eta: "08/05/2026",
    lines: [
      { key: "thuong-son-tra", qty: 40, totalVi: "₫38 tr" },
      { key: "yogi-food", qty: 50, totalVi: "₫24 tr" },
      { key: "medicinal-aroma", qty: 30, totalVi: "₫16.5 tr" },
    ],
    timeline: [
      { id: "h15", date: "06/05/2026", time: "20:00", title: "Đặt đơn", detail: "Kênh Social Media" },
    ],
  },
  {
    id: "h-io12",
    orderCode: "SO-BSV-2026-0920",
    customerId: "b2b-export",
    status: "shipping",
    statusLabel: { vi: "Đang giao hàng", en: "Out for delivery", zh: "配送中" },
    items: 680,
    totalValue: { vi: "₫3.2 tỷ", en: "₫3.2B", zh: "32亿₫" },
    orderedAt: "20/05/2026",
    eta: "28/05/2026",
    lines: [
      { key: "medicinal-material", qty: 200, totalVi: "₫360 tr" },
      { key: "herb-ingredient", qty: 120, totalVi: "₫540 tr" },
      { key: "medicinal-tea", qty: 150, totalVi: "₫975 tr" },
      { key: "nutrition-snacks", qty: 100, totalVi: "₫280 tr" },
      { key: "fruit", qty: 80, totalVi: "₫336 tr" },
      { key: "coffee", qty: 30, totalVi: "₫204 tr" },
      { key: "spices", qty: 60, totalVi: "₫192 tr" },
    ],
    timeline: [
      { id: "h16", date: "20/05/2026", time: "09:00", title: "Đặt đơn", detail: "Xuất khẩu · lô FCL Singapore" },
      { id: "h17", date: "21/05/2026", time: "14:00", title: "Đang vận chuyển", detail: "Container BSV-EXP-2405" },
    ],
  },
];

function localizeTimeline(
  timeline: LocationInboundOrderDetail["timeline"],
  locale: Locale
): LocationInboundOrderDetail["timeline"] {
  if (locale === "vi") return timeline;
  const mapViEnZh: Record<string, { en: string; zh: string }> = {
    "Đặt đơn": { en: "Order placed", zh: "下单" },
    "Đang vận chuyển": { en: "In transit", zh: "运输中" },
    "Đã xuất kho": { en: "Shipped", zh: "已出库" },
    "Đã nhập kho": { en: "Received", zh: "已入库" },
  };
  return timeline.map((ev) => {
    const tr = mapViEnZh[ev.title];
    if (!tr) return ev;
    return { ...ev, title: locale === "zh" ? tr.zh : tr.en };
  });
}

function buildOrderFromSpec(spec: HoldingOrderSpec, locale: Locale): LocationInboundOrderDetail {
  const record = getB2BCustomerRecord(spec.customerId);
  const segmentKey = record?.segmentKey ?? "hospital-tcm";
  const allowed = new Set(getB2BProductLinesForSegment(segmentKey).map((l) => l.key));

  const lineItems = spec.lines
    .filter((row) => allowed.has(row.key))
    .map((row) => {
      const line = B2B_PRODUCT_LINES[row.key];
      return mockLineItem(
        HOLDING_CENTRAL_WAREHOUSE_ID,
        line.productCode,
        productLineLabel(line, locale),
        row.qty,
        line.unitPriceVi,
        row.totalVi
      );
    });

  return {
    id: spec.id,
    locationId: HOLDING_CENTRAL_WAREHOUSE_ID,
    orderCode: spec.orderCode,
    supplier: getB2BCustomerDisplayName(spec.customerId, locale),
    status: spec.status,
    statusLabel: spec.statusLabel[locale],
    items: spec.items,
    totalValue: spec.totalValue[locale],
    orderedAt: spec.orderedAt,
    eta: spec.eta,
    receivedAt: spec.receivedAt,
    lineItems,
    timeline: localizeTimeline(spec.timeline, locale),
  };
}

function toListRow(detail: LocationInboundOrderDetail, locale: Locale): LocationInboundOrder {
  const locationName =
    locale === "zh"
      ? HOLDING_WAREHOUSE_LABEL.zh
      : locale === "en"
        ? HOLDING_WAREHOUSE_LABEL.en
        : HOLDING_WAREHOUSE_LABEL.vi;

  return {
    id: detail.id,
    locationId: detail.locationId,
    locationCode: "BSV-WH",
    locationName,
    orderCode: detail.orderCode,
    supplier: detail.supplier,
    status: detail.status,
    statusLabel: detail.statusLabel,
    items: detail.items,
    totalValue: detail.totalValue,
    orderedAt: detail.orderedAt,
    eta: detail.eta,
    receivedAt: detail.receivedAt,
    lastEvent: detail.timeline[detail.timeline.length - 1]?.title ?? "",
    productCodes: detail.lineItems.map((l) => l.productCode).join(", "),
    productSummary: detail.lineItems.map((l) => l.name).join("; "),
    shipmentTracking: "",
    trackingCodes: detail.lineItems.map((l) => l.trackingCode).join(", "),
    productLineItems: detail.lineItems.map((l) => ({
      productCode: l.productCode,
      name: l.name,
    })),
  };
}

export function getHoldingInboundOrders(locale: Locale = "vi"): LocationInboundOrder[] {
  return HOLDING_ORDER_SPECS.map((spec) => toListRow(buildOrderFromSpec(spec, locale), locale));
}

export function getHoldingInboundOrderDetail(
  orderId: string,
  locale: Locale = "vi"
): LocationInboundOrderDetail {
  const spec = HOLDING_ORDER_SPECS.find((s) => s.id === orderId) ?? HOLDING_ORDER_SPECS[0];
  return buildOrderFromSpec(spec, locale);
}
