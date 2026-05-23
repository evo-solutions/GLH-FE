import { productDisplayName } from "@/lib/productCatalog";
import { getLocationSeed } from "@/lib/locationRegistry";
import { mockLineItem, mockReturnLine } from "@/lib/locationMockItems";
import {
  buildInboundOrderCatalog,
  inboundOrderIdsFromCatalog,
} from "@/lib/inboundOrderGenerator";
import { inboundOrderListRow } from "@/lib/inboundOrderListRow";
import type { LocationInboundOrder, LocationInboundOrderDetail } from "@/types/location";
import type { ProductInboundOrder } from "@/types/product";

function line(
  locationId: string,
  productCode: string,
  qty: number,
  unitPrice: string,
  lineTotal: string
) {
  return mockLineItem(
    locationId,
    productCode,
    productDisplayName(productCode, "vi"),
    qty,
    unitPrice,
    lineTotal
  );
}

function ret(locationId: string, productCode: string, qty: number) {
  return mockReturnLine(locationId, productCode, productDisplayName(productCode, "vi"), qty);
}

/** 6 đơn mẫu tay — io7+ sinh tự động. */
const seedInboundOrders: Record<string, LocationInboundOrderDetail> = {
  io1: {
    id: "io1",
    locationId: "loc-hcm-1",
    orderCode: "PO-2026-0418",
    supplier: "Dược phẩm ABC",
    status: "shipping",
    statusLabel: "Đang vận chuyển",
    items: 24,
    totalValue: "₫86 tr",
    orderedAt: "15/05/2026",
    eta: "20/05/2026",
    lineItems: [
      line("loc-hcm-1", "BSV-4412", 12, "₫268,000", "₫3.2 tr"),
      line("loc-hcm-1", "BSV-2281", 12, "₫92,000", "₫1.1 tr"),
      line("loc-hcm-1", "BSV-9302", 6, "₫88,000", "₫528 nghìn"),
    ],
    timeline: [
      { id: "e1", date: "15/05/2026", time: "09:10", title: "Đặt đơn", detail: "24 SKU · ₫86 tr" },
      { id: "e2", date: "15/05/2026", time: "14:30", title: "Đã xác nhận", detail: "NCC xác nhận đủ hàng" },
      { id: "e3", date: "17/05/2026", time: "08:00", title: "Đang vận chuyển", detail: "Vận đơn VN-88421" },
    ],
  },
  io2: {
    id: "io2",
    locationId: "loc-hn-2",
    orderCode: "PO-2026-0412",
    supplier: "TPCN Việt Nam",
    status: "confirmed",
    statusLabel: "Đã xác nhận",
    items: 18,
    totalValue: "₫52 tr",
    orderedAt: "14/05/2026",
    eta: "22/05/2026",
    lineItems: [
      line("loc-hn-2", "BSV-7710", 10, "₫168,000", "₫1.68 tr"),
      line("loc-hn-2", "BSV-2281", 8, "₫92,000", "₫736 nghìn"),
    ],
    timeline: [
      { id: "e1", date: "14/05/2026", time: "11:00", title: "Đặt đơn", detail: "18 SKU · ₫52 tr" },
      { id: "e2", date: "14/05/2026", time: "16:45", title: "Đã xác nhận", detail: "Chờ lấy hàng" },
    ],
  },
  io3: {
    id: "io3",
    locationId: "loc-hcm-1",
    orderCode: "XK-2026-0398",
    supplier: "Kho trung tâm BSV",
    status: "received",
    statusLabel: "Đã nhận phân bổ",
    items: 100,
    totalValue: "₫14.2 tr",
    orderedAt: "08/05/2026",
    receivedAt: "12/05/2026",
    lineItems: [line("loc-hcm-1", "BSV-COV19", 100, "₫142,000", "₫14.2 tr")],
    timeline: [
      {
        id: "e1",
        date: "08/05/2026",
        time: "10:20",
        title: "Phiếu xuất kho",
        detail: "100 đơn vị BSV-COV19 → cửa hàng HCM-01",
      },
      { id: "e2", date: "09/05/2026", time: "09:00", title: "Đã xác nhận" },
      { id: "e3", date: "10/05/2026", time: "07:30", title: "Đang vận chuyển" },
      {
        id: "e4",
        date: "12/05/2026",
        time: "15:10",
        title: "Đã nhận tại cửa hàng",
        detail: "Gán mã TK-HCM01-COV19 cho từng đơn vị",
      },
    ],
  },
  io4: {
    id: "io4",
    locationId: "loc-dn-1",
    orderCode: "PO-2026-0385",
    supplier: "Beauty Supply Co",
    status: "return_supplier",
    statusLabel: "Hoàn trả",
    items: 6,
    totalValue: "₫18 tr",
    orderedAt: "01/05/2026",
    receivedAt: "05/05/2026",
    lineItems: [
      line("loc-dn-1", "BSV-9033", 4, "₫340,000", "₫13.6 tr"),
      line("loc-dn-1", "BSV-2281", 2, "₫92,000", "₫184 nghìn"),
    ],
    returnItems: [
      ret("loc-dn-1", "BSV-9033", 4),
      ret("loc-dn-1", "BSV-2281", 2),
    ],
    timeline: [
      { id: "e1", date: "01/05/2026", time: "08:00", title: "Đặt đơn", detail: "6 SKU · ₫18 tr" },
      { id: "e2", date: "02/05/2026", title: "Đã xác nhận" },
      { id: "e3", date: "04/05/2026", title: "Đang vận chuyển" },
      { id: "e4", date: "05/05/2026", title: "Đã nhận kho" },
      { id: "e5", date: "06/05/2026", time: "11:20", title: "Hoàn trả", detail: "6 SKU hoàn · ghi nhận mã BSV-9033, BSV-2281" },
    ],
  },
  io5: {
    id: "io5",
    locationId: "loc-hcm-2",
    orderCode: "PO-2026-0371",
    supplier: "TPCN Việt Nam",
    status: "return_location",
    statusLabel: "Hoàn trả",
    items: 4,
    totalValue: "₫9.2 tr",
    orderedAt: "25/04/2026",
    receivedAt: "28/04/2026",
    lineItems: [line("loc-hcm-2", "BSV-7710", 4, "₫168,000", "₫672 nghìn")],
    returnItems: [ret("loc-hcm-2", "BSV-7710", 4)],
    timeline: [
      { id: "e1", date: "25/04/2026", title: "Đặt đơn", detail: "4 SKU · ₫9.2 tr" },
      { id: "e2", date: "26/04/2026", title: "Đã xác nhận" },
      { id: "e3", date: "27/04/2026", title: "Đang vận chuyển" },
      { id: "e4", date: "28/04/2026", title: "Đã nhận kho" },
      { id: "e5", date: "30/04/2026", time: "09:40", title: "Hoàn trả", detail: "4 SKU · BSV-7710" },
    ],
  },
  io6: {
    id: "io6",
    locationId: "loc-ct-1",
    orderCode: "PO-2026-0420",
    supplier: "Dược phẩm ABC",
    status: "pending",
    statusLabel: "Chờ xác nhận",
    items: 12,
    totalValue: "₫38 tr",
    orderedAt: "18/05/2026",
    lineItems: [
      line("loc-ct-1", "BSV-4412", 8, "₫268,000", "₫2.14 tr"),
      line("loc-ct-1", "BSV-2281", 4, "₫92,000", "₫368 nghìn"),
    ],
    timeline: [{ id: "e1", date: "18/05/2026", time: "13:50", title: "Đặt đơn", detail: "12 SKU · ₫38 tr" }],
  },
};

/** Tổng ~80 đơn (6 mẫu + 74 sinh tự động). */
const EXTRA_GENERATED_COUNT = 74;

const inboundOrderCatalog = buildInboundOrderCatalog(seedInboundOrders, 7, EXTRA_GENERATED_COUNT);

export const INBOUND_ORDER_IDS = inboundOrderIdsFromCatalog(inboundOrderCatalog);

export type InboundOrderId = (typeof INBOUND_ORDER_IDS)[number];

export function getInboundOrderDetail(orderId: string): LocationInboundOrderDetail {
  return inboundOrderCatalog[orderId] ?? inboundOrderCatalog.io1;
}

export function getAllInboundOrderListRows(): LocationInboundOrder[] {
  return INBOUND_ORDER_IDS.map((id) => inboundOrderListRow(inboundOrderCatalog[id]));
}

export function getInboundOrdersForLocation(locationId: string): LocationInboundOrder[] {
  return getAllInboundOrderListRows().filter((o) => o.locationId === locationId);
}

export function getProductInboundOrders(productCode: string): ProductInboundOrder[] {
  return INBOUND_ORDER_IDS.flatMap((id) => {
    const detail = inboundOrderCatalog[id];
    const lines = detail.lineItems.filter((l) => l.productCode === productCode);
    if (lines.length === 0) return [];
    const productQty = lines.reduce((sum, l) => sum + l.qty, 0);
    return [{ ...inboundOrderListRow(detail), productQty }];
  }).sort((a, b) => {
    const da = parseDateKey(a.orderedAt);
    const db = parseDateKey(b.orderedAt);
    return db - da;
  });
}

function parseDateKey(d: string): number {
  const [day, month, year] = d.split("/").map(Number);
  return year * 10000 + month * 100 + day;
}

export function localizeInboundOrderRows(
  rows: ProductInboundOrder[],
  locale: "vi" | "en" | "zh"
): ProductInboundOrder[] {
  if (locale === "vi") return rows;
  return rows.map((row) => {
    const seed = getLocationSeed(row.locationId);
    const locationName = locale === "zh" ? seed.nameZh : seed.nameEn;
    return { ...row, locationName };
  });
}
