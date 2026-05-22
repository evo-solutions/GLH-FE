import type { BusinessModelSlug } from "@/libs/business-models/config";
import { api } from "@/services/api/axios";
import { getInboundOrderDetail } from "@/lib/inboundOrderData";
import { getHoldingInboundOrderDetail } from "@/lib/holdingWarehouseData";
import { getAllInboundOrdersSorted, localizeInboundOrders } from "@/lib/orderListData";
import type { LocationInboundOrder, LocationInboundOrderDetail } from "@/types/location";
import { ORDER_API } from "./order.api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface OrderDetailMeta {
  orderId: string;
  locationId: string;
  orderCode: string;
}

export async function fetchOrderList(
  locale = "vi",
  businessModel?: BusinessModelSlug
): Promise<LocationInboundOrder[]> {
  if (USE_MOCK) {
    await delay(350);
    const loc = locale === "zh" ? "zh" : locale === "en" ? "en" : "vi";
    return localizeInboundOrders(getAllInboundOrdersSorted(businessModel, loc), loc);
  }
  const { data } = await api.get<LocationInboundOrder[]>(ORDER_API.list);
  return data;
}

function resolveInboundDetail(orderId: string): LocationInboundOrderDetail {
  if (orderId.startsWith("h-io")) return getHoldingInboundOrderDetail(orderId);
  return getInboundOrderDetail(orderId);
}

export async function fetchOrderDetailMeta(orderId: string): Promise<OrderDetailMeta> {
  if (USE_MOCK) {
    await delay(150);
    const detail = resolveInboundDetail(orderId);
    return { orderId: detail.id, locationId: detail.locationId, orderCode: detail.orderCode };
  }
  const { data } = await api.get<OrderDetailMeta>(ORDER_API.detail(orderId));
  return data;
}

export async function fetchOrderDetail(
  locationId: string,
  orderId: string,
  locale = "vi"
): Promise<LocationInboundOrderDetail> {
  if (USE_MOCK) {
    await delay(250);
    return resolveInboundDetail(orderId);
  }
  const { data } = await api.get<LocationInboundOrderDetail>(
    `/api/v1/locations/${locationId}/inbound-orders/${orderId}?locale=${locale}`
  );
  return data;
}
