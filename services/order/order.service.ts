import { api } from "@/services/api/axios";
import { getInboundOrderDetail } from "@/lib/inboundOrderData";
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

export async function fetchOrderList(locale = "vi"): Promise<LocationInboundOrder[]> {
  if (USE_MOCK) {
    await delay(350);
    const loc = locale === "zh" ? "zh" : locale === "en" ? "en" : "vi";
    return localizeInboundOrders(getAllInboundOrdersSorted(), loc);
  }
  const { data } = await api.get<LocationInboundOrder[]>(ORDER_API.list);
  return data;
}

export async function fetchOrderDetailMeta(orderId: string): Promise<OrderDetailMeta> {
  if (USE_MOCK) {
    await delay(150);
    const detail = getInboundOrderDetail(orderId);
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
    return getInboundOrderDetail(orderId);
  }
  const { data } = await api.get<LocationInboundOrderDetail>(
    `/api/v1/locations/${locationId}/inbound-orders/${orderId}?locale=${locale}`
  );
  return data;
}
