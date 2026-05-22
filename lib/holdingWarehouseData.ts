import { mockLineItem } from "@/lib/locationMockItems";
import type { LocationInboundOrder, LocationInboundOrderDetail } from "@/types/location";

/** Kho trung tâm Holding — không gắn điểm bán lẻ */
export const HOLDING_CENTRAL_WAREHOUSE_ID = "wh-bsv-central";

export const HOLDING_WAREHOUSE_LABEL = {
  vi: "Tổng kho các cơ sở",
  en: "Consolidated warehouse (all units)",
  zh: "各门店总仓",
} as const;

const holdingSeedOrders: LocationInboundOrderDetail[] = [
  {
    id: "h-io1",
    locationId: HOLDING_CENTRAL_WAREHOUSE_ID,
    orderCode: "PO-BSV-2026-0901",
    supplier: "Vùng nguyên liệu Tây Bắc",
    status: "shipping",
    statusLabel: "Đang vận chuyển",
    items: 120,
    totalValue: "₫2.4 tỷ",
    orderedAt: "18/05/2026",
    eta: "22/05/2026",
    lineItems: [
      mockLineItem(
        HOLDING_CENTRAL_WAREHOUSE_ID,
        "BSV-RM-001",
        "Ngưu tất thang (nguyên liệu)",
        80,
        "₫18,000/kg",
        "₫1.44 tỷ"
      ),
      mockLineItem(
        HOLDING_CENTRAL_WAREHOUSE_ID,
        "BSV-RM-002",
        "Đương quy khô",
        40,
        "₫24,000/kg",
        "₫960 tr"
      ),
    ],
    timeline: [
      { id: "h1", date: "18/05/2026", time: "08:00", title: "Đặt đơn", detail: "Thu mua mùa vụ" },
      { id: "h2", date: "19/05/2026", time: "14:00", title: "Đang vận chuyển", detail: "Xe lạnh BSV-8840" },
    ],
  },
  {
    id: "h-io2",
    locationId: HOLDING_CENTRAL_WAREHOUSE_ID,
    orderCode: "SO-BSV-2026-0412",
    supplier: "—",
    status: "confirmed",
    statusLabel: "Xuất cho công ty con",
    items: 200,
    totalValue: "₫890 tr",
    orderedAt: "15/05/2026",
    eta: "17/05/2026",
    lineItems: [
      mockLineItem(
        HOLDING_CENTRAL_WAREHOUSE_ID,
        "BSV-RM-003",
        "Bạch thược khô",
        120,
        "₫42,000/kg",
        "₫504 tr"
      ),
      mockLineItem(
        HOLDING_CENTRAL_WAREHOUSE_ID,
        "BSV-RM-004",
        "Hoàng kỳ thang",
        80,
        "₫48,000/kg",
        "₫384 tr"
      ),
    ],
    timeline: [
      { id: "h3", date: "15/05/2026", time: "10:00", title: "Xuất kho", detail: "→ Thảo dược di sản HCM" },
    ],
  },
  {
    id: "h-io3",
    locationId: HOLDING_CENTRAL_WAREHOUSE_ID,
    orderCode: "PO-BSV-2026-0888",
    supplier: "Hợp tác xã dược liệu Quảng Nam",
    status: "received",
    statusLabel: "Đã nhập kho",
    items: 60,
    totalValue: "₫620 tr",
    orderedAt: "10/05/2026",
    eta: "12/05/2026",
    receivedAt: "12/05/2026",
    lineItems: [
      mockLineItem(
        HOLDING_CENTRAL_WAREHOUSE_ID,
        "BSV-RM-005",
        "Đẳng sâm khô",
        60,
        "₫103,000/kg",
        "₫620 tr"
      ),
    ],
    timeline: [
      { id: "h4", date: "12/05/2026", time: "16:30", title: "Đã nhập kho", detail: "QC đạt" },
    ],
  },
];

function toListRow(detail: LocationInboundOrderDetail): LocationInboundOrder {
  return {
    id: detail.id,
    locationId: detail.locationId,
    locationCode: "BSV-WH",
    locationName: HOLDING_WAREHOUSE_LABEL.vi,
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

export function getHoldingInboundOrders(locale: "vi" | "en" | "zh" = "vi"): LocationInboundOrder[] {
  const name =
    locale === "zh"
      ? HOLDING_WAREHOUSE_LABEL.zh
      : locale === "en"
        ? HOLDING_WAREHOUSE_LABEL.en
        : HOLDING_WAREHOUSE_LABEL.vi;
  return holdingSeedOrders.map((d) => ({ ...toListRow(d), locationName: name }));
}

export function getHoldingInboundOrderDetail(orderId: string): LocationInboundOrderDetail {
  return holdingSeedOrders.find((o) => o.id === orderId) ?? holdingSeedOrders[0];
}
