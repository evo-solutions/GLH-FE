"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchCustomerList, fetchGlobalCustomerDetail } from "@/services/customer/customer.service";

export const customerKeys = {
  all: ["customers"] as const,
  list: (locale: string) => [...customerKeys.all, "list", locale] as const,
  detail: (globalId: string, locale: string) =>
    [...customerKeys.all, "detail", globalId, locale] as const,
};

export function useCustomerList() {
  const locale = useLocale();
  return useQuery({
    queryKey: customerKeys.list(locale),
    queryFn: () => fetchCustomerList(locale),
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
