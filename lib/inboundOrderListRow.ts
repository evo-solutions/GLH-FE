import { getLocationSeed } from "@/lib/locationRegistry";
import type { LocationInboundOrder, LocationInboundOrderDetail } from "@/types/location";

const RETURN_STATUS_TITLES = /hoàn trả|returned|退货/i;

export function inboundOrderListRow(detail: LocationInboundOrderDetail): LocationInboundOrder {
  const last = detail.timeline[detail.timeline.length - 1];
  const returnEvent = [...detail.timeline].reverse().find((e) => RETURN_STATUS_TITLES.test(e.title));
  const trackingMatch = detail.timeline
    .map((e) => e.detail ?? "")
    .join(" ")
    .match(/VN-\d+/);

  const lastDate = last?.date ?? detail.orderedAt;
  const lastTime = last?.time ? ` · ${last.time}` : "";

  const loc = getLocationSeed(detail.locationId);

  return {
    id: detail.id,
    locationId: detail.locationId,
    locationCode: loc.code,
    locationName: loc.nameVi,
    orderCode: detail.orderCode,
    supplier: detail.supplier,
    status: detail.status,
    statusLabel: detail.statusLabel,
    items: detail.items,
    totalValue: detail.totalValue,
    orderedAt: detail.orderedAt,
    eta: detail.eta,
    receivedAt: detail.receivedAt,
    returnedAt: returnEvent?.date,
    shipmentTracking: trackingMatch?.[0],
    productCodes: detail.lineItems.map((l) => l.productCode).join(", "),
    productLineItems: detail.lineItems.map((l) => ({
      productCode: l.productCode,
      name: l.name,
    })),
    trackingCodes: detail.lineItems.map((l) => l.trackingCode).join(", "),
    productSummary: detail.lineItems
      .map((l) => `${l.trackingCode} · ${l.name} ×${l.qty}`)
      .join(" · "),
    lastEvent: last ? `${last.title} · ${lastDate}${lastTime}` : detail.statusLabel,
  };
}
