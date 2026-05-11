"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchOrderDetail, fetchOrderDetailMeta, fetchOrderList } from "@/services/order/order.service";

export const orderKeys = {
  all: ["orders"] as const,
  list: (locale: string) => [...orderKeys.all, "list", locale] as const,
  meta: (orderId: string) => [...orderKeys.all, "meta", orderId] as const,
  detail: (locationId: string, orderId: string, locale: string) =>
    [...orderKeys.all, "detail", locationId, orderId, locale] as const,
};

export function useOrderList() {
  const locale = useLocale();
  return useQuery({
    queryKey: orderKeys.list(locale),
    queryFn: () => fetchOrderList(locale),
    staleTime: 60_000,
  });
}

export function useOrderDetailMeta(orderId: string) {
  return useQuery({
    queryKey: orderKeys.meta(orderId),
    queryFn: () => fetchOrderDetailMeta(orderId),
    enabled: !!orderId,
    staleTime: 60_000,
  });
}

export function useOrderDetail(locationId: string | undefined, orderId: string, enabled: boolean) {
  const locale = useLocale();
  return useQuery({
    queryKey: orderKeys.detail(locationId ?? "", orderId, locale),
    queryFn: () => fetchOrderDetail(locationId!, orderId, locale),
    enabled: !!locationId && !!orderId && enabled,
    staleTime: 60_000,
  });
}
