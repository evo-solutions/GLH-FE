"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { BusinessModelSlug } from "@/libs/business-models/config";
import { useOptionalBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { DEFAULT_RETAIL_MODEL } from "@/libs/business-models/config";
import { fetchOrderDetail, fetchOrderDetailMeta, fetchOrderList } from "@/services/order/order.service";

export const orderKeys = {
  all: ["orders"] as const,
  list: (locale: string, model?: BusinessModelSlug) =>
    [...orderKeys.all, "list", locale, model ?? "all"] as const,
  meta: (orderId: string) => [...orderKeys.all, "meta", orderId] as const,
  detail: (locationId: string, orderId: string, locale: string) =>
    [...orderKeys.all, "detail", locationId, orderId, locale] as const,
};

export function useOrderList(businessModel?: BusinessModelSlug) {
  const locale = useLocale();
  const model = businessModel ?? useOptionalBusinessModelSlug() ?? DEFAULT_RETAIL_MODEL;
  return useQuery({
    queryKey: orderKeys.list(locale, model),
    queryFn: () => fetchOrderList(locale, model),
    staleTime: 60_000,
  });
}

export function useOrderDetailMeta(orderId: string) {
  const locale = useLocale();
  return useQuery({
    queryKey: [...orderKeys.meta(orderId), locale] as const,
    queryFn: () => fetchOrderDetailMeta(orderId, locale),
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
