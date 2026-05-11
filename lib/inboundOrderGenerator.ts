import { INSTANCE_PRODUCT_SPECS } from "@/lib/productInstanceCatalog";
import { LOCATION_SEEDS } from "@/lib/locationRegistry";
import { mockLineItem, mockReturnLine } from "@/lib/locationMockItems";
import type {
  InboundOrderStatus,
  InboundOrderTimelineEvent,
  LocationInboundOrderDetail,
} from "@/types/location";

const SUPPLIERS = [
  "Dược phẩm ABC",
  "TPCN Việt Nam",
  "Kho trung tâm BSV",
  "Beauty Supply Co",
  "PharmaLink Việt Nam",
  "MediCare Distribution",
  "VitaSource JSC",
  "Nam Dược Bắc",
] as const;

const STATUS_META: {
  status: InboundOrderStatus;
  statusLabel: string;
  weight: number;
}[] = [
  { status: "pending", statusLabel: "Chờ xác nhận", weight: 12 },
  { status: "confirmed", statusLabel: "Đã xác nhận", weight: 18 },
  { status: "shipping", statusLabel: "Đang vận chuyển", weight: 22 },
  { status: "received", statusLabel: "Đã nhận phân bổ", weight: 35 },
  { status: "return_supplier", statusLabel: "Hoàn trả", weight: 7 },
  { status: "return_location", statusLabel: "Hoàn trả", weight: 6 },
];

function pickStatus(seed: number): (typeof STATUS_META)[number] {
  const total = STATUS_META.reduce((s, m) => s + m.weight, 0);
  let r = seed % total;
  for (const meta of STATUS_META) {
    if (r < meta.weight) return meta;
    r -= meta.weight;
  }
  return STATUS_META[0];
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Ngày dd/mm/2026 — lùi `daysAgo` so với 18/05/2026. */
function orderDate(daysAgo: number): string {
  const base = new Date(2026, 4, 18);
  base.setDate(base.getDate() - daysAgo);
  return `${pad2(base.getDate())}/${pad2(base.getMonth() + 1)}/${base.getFullYear()}`;
}

function formatVnd(amount: number): string {
  if (amount >= 1_000_000_000) return `₫${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(1)} tr`;
  if (amount >= 1_000) return `₫${Math.round(amount / 1_000)} nghìn`;
  return `₫${amount.toLocaleString("vi-VN")}`;
}

function parseImportPrice(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return Number(digits) || 100_000;
}

function buildTimeline(
  status: InboundOrderStatus,
  daysAgo: number,
  items: number,
  totalValue: string,
  isCentral: boolean,
  tracking?: string
): InboundOrderTimelineEvent[] {
  const d0 = orderDate(daysAgo);
  const d1 = orderDate(Math.max(0, daysAgo - 1));
  const d2 = orderDate(Math.max(0, daysAgo - 2));
  const d3 = orderDate(Math.max(0, daysAgo - 3));
  const d4 = orderDate(Math.max(0, daysAgo - 4));

  const events: InboundOrderTimelineEvent[] = [
    {
      id: "e1",
      date: d0,
      time: "09:00",
      title: isCentral ? "Phiếu xuất kho" : "Đặt đơn",
      detail: `${items} SKU · ${totalValue}`,
    },
  ];

  if (status === "pending") return events;

  events.push({
    id: "e2",
    date: d1,
    time: "14:20",
    title: "Đã xác nhận",
    detail: "NCC xác nhận đủ hàng",
  });

  if (status === "confirmed") return events;

  events.push({
    id: "e3",
    date: d2,
    time: "08:15",
    title: "Đang vận chuyển",
    detail: tracking ? `Vận đơn ${tracking}` : undefined,
  });

  if (status === "shipping") return events;

  events.push({
    id: "e4",
    date: d3,
    time: "16:40",
    title: status === "received" ? "Đã nhận tại cửa hàng" : "Đã nhận kho",
    detail: "Quét nhập kho hoàn tất",
  });

  if (status === "received") return events;

  events.push({
    id: "e5",
    date: d4,
    time: "10:30",
    title: "Hoàn trả",
    detail: `${items} SKU hoàn · ghi nhận mã tracking`,
  });

  return events;
}

export function generateInboundOrder(index: number): LocationInboundOrderDetail {
  const id = `io${index}`;
  const loc = LOCATION_SEEDS[index % LOCATION_SEEDS.length];
  const statusMeta = pickStatus(index * 17 + index);
  const supplier = SUPPLIERS[(index * 5 + 2) % SUPPLIERS.length];
  const daysAgo = (index * 3) % 120;
  const orderedAt = orderDate(daysAgo);
  const isCentral = supplier === "Kho trung tâm BSV";
  const orderCode = isCentral
    ? `XK-2026-${String(3800 + index).padStart(4, "0")}`
    : `PO-2026-${String(3800 + index).padStart(4, "0")}`;

  const lineCount = index % 4 === 0 ? 1 : index % 3 === 0 ? 3 : 2;
  const lineItems = [];
  let totalAmount = 0;
  let totalQty = 0;

  for (let j = 0; j < lineCount; j++) {
    const spec = INSTANCE_PRODUCT_SPECS[(index + j * 2) % INSTANCE_PRODUCT_SPECS.length];
    const qty = 4 + ((index * 7 + j * 11) % 48);
    const unit = parseImportPrice(spec.importPrice);
    const lineAmount = unit * qty;
    totalAmount += lineAmount;
    totalQty += qty;
    lineItems.push(
      mockLineItem(
        loc.id,
        spec.productCode,
        spec.name,
        qty,
        spec.importPrice,
        formatVnd(lineAmount)
      )
    );
  }

  const tracking =
    statusMeta.status === "shipping" || statusMeta.status === "received"
      ? `VN-${88000 + index}`
      : undefined;
  const timeline = buildTimeline(
    statusMeta.status,
    daysAgo,
    totalQty,
    formatVnd(totalAmount),
    isCentral,
    tracking
  );

  const detail: LocationInboundOrderDetail = {
    id,
    locationId: loc.id,
    orderCode,
    supplier,
    status: statusMeta.status,
    statusLabel: statusMeta.statusLabel,
    items: totalQty,
    totalValue: formatVnd(totalAmount),
    orderedAt,
    lineItems,
    timeline,
  };

  if (
    statusMeta.status === "shipping" ||
    statusMeta.status === "received" ||
    statusMeta.status.startsWith("return")
  ) {
    detail.eta = orderDate(Math.max(0, daysAgo - 4));
  }

  if (statusMeta.status === "received" || statusMeta.status.startsWith("return")) {
    detail.receivedAt = orderDate(Math.max(0, daysAgo - 2));
  }

  if (statusMeta.status === "return_supplier" || statusMeta.status === "return_location") {
    detail.returnItems = lineItems.map((l) =>
      mockReturnLine(loc.id, l.productCode, l.name, l.qty)
    );
  }

  return detail;
}

export function buildInboundOrderCatalog(
  seedOrders: Record<string, LocationInboundOrderDetail>,
  extraFromIndex: number,
  extraCount: number
): Record<string, LocationInboundOrderDetail> {
  const catalog: Record<string, LocationInboundOrderDetail> = { ...seedOrders };
  for (let i = 0; i < extraCount; i++) {
    const index = extraFromIndex + i;
    catalog[`io${index}`] = generateInboundOrder(index);
  }
  return catalog;
}

export function inboundOrderIdsFromCatalog(
  catalog: Record<string, LocationInboundOrderDetail>
): string[] {
  return Object.keys(catalog).sort(
    (a, b) => parseInt(a.replace("io", ""), 10) - parseInt(b.replace("io", ""), 10)
  );
}
