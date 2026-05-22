"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { BusinessModelSlug } from "@/libs/business-models/config";
import { useOptionalBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { DEFAULT_RETAIL_MODEL } from "@/libs/business-models/config";
import { fetchCustomerList, fetchGlobalCustomerDetail } from "@/services/customer/customer.service";

export const customerKeys = {
  all: ["customers"] as const,
  list: (locale: string, model?: BusinessModelSlug) =>
    [...customerKeys.all, "list", locale, model ?? "all"] as const,
  detail: (globalId: string, locale: string) =>
    [...customerKeys.all, "detail", globalId, locale] as const,
};

export function useCustomerList(businessModel?: BusinessModelSlug) {
  const locale = useLocale();
  const model = businessModel ?? useOptionalBusinessModelSlug() ?? DEFAULT_RETAIL_MODEL;
  return useQuery({
    queryKey: customerKeys.list(locale, model),
    queryFn: () => fetchCustomerList(locale, model),
    staleTime: 60_000,
  });
}

export function useGlobalCustomerDetail(globalId: string, enabled: boolean) {
  const locale = useLocale();
  return useQuery({
    queryKey: customerKeys.detail(globalId, locale),
    queryFn: () => fetchGlobalCustomerDetail(globalId, locale),
    enabled: !!globalId && enabled,
    staleTime: 60_000,
  });
}
