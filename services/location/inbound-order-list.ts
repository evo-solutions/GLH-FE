import type { LocationInboundOrder, LocationInboundOrderDetail } from "@/types/location";
import { inboundOrderListRow } from "@/lib/inboundOrderListRow";

export { INBOUND_ORDER_IDS, type InboundOrderId } from "@/lib/inboundOrderData";
export { inboundOrderListRow };

export function inboundOrdersList(
  details: Record<string, LocationInboundOrderDetail>,
  resolveDetail: (id: string) => LocationInboundOrderDetail,
  orderIds: string[]
): LocationInboundOrder[] {
  return orderIds.map((id) => inboundOrderListRow(details[id] ?? resolveDetail(id)));
}
