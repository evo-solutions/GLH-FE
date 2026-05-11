"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import {
  fetchLocationCustomerDetail,
  fetchLocationList,
  fetchLocationMeta,
  fetchLocationOverview,
  fetchLocationSales,
  fetchLocationStaffCosts,
  fetchLocationInboundOrderDetail,
  fetchLocationWarehouse,
} from "@/services/location/location.service";

export const locationKeys = {
  all: ["locations"] as const,
  list: (locale: string) => [...locationKeys.all, "list", locale] as const,
  meta: (id: string, locale: string) =>
    [...locationKeys.all, "meta", id, locale] as const,
  overview: (id: string, locale: string) =>
    [...locationKeys.all, "overview", id, locale] as const,
  staffCosts: (id: string, locale: string) =>
    [...locationKeys.all, "staffCosts", id, locale] as const,
  sales: (id: string, locale: string) =>
    [...locationKeys.all, "sales", id, locale] as const,
  customer: (id: string, customerId: string, locale: string) =>
    [...locationKeys.all, "customer", id, customerId, locale] as const,
  warehouse: (id: string, locale: string) =>
    [...locationKeys.all, "warehouse", id, locale] as const,
  inboundOrder: (locationId: string, orderId: string, locale: string) =>
    [...locationKeys.all, "inboundOrder", locationId, orderId, locale] as const,
};

export function useLocationList() {
  const locale = useLocale();
  return useQuery({
    queryKey: locationKeys.list(locale),
    queryFn: () => fetchLocationList(locale),
    staleTime: 60_000,
  });
}

export function useLocationMeta(id: string) {
  const locale = useLocale();
  return useQuery({
    queryKey: locationKeys.meta(id, locale),
    queryFn: () => fetchLocationMeta(id, locale),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useLocationOverview(id: string, enabled: boolean) {
  const locale = useLocale();
  return useQuery({
    queryKey: locationKeys.overview(id, locale),
    queryFn: () => fetchLocationOverview(id, locale),
    enabled: !!id && enabled,
    staleTime: 60_000,
  });
}

export function useLocationStaffCosts(id: string, enabled: boolean) {
  const locale = useLocale();
  return useQuery({
    queryKey: locationKeys.staffCosts(id, locale),
    queryFn: () => fetchLocationStaffCosts(id, locale),
    enabled: !!id && enabled,
    staleTime: 60_000,
  });
}

export function useLocationSales(id: string, enabled: boolean) {
  const locale = useLocale();
  return useQuery({
    queryKey: locationKeys.sales(id, locale),
    queryFn: () => fetchLocationSales(id, locale),
    enabled: !!id && enabled,
    staleTime: 60_000,
  });
}

export function useLocationCustomerDetail(
  locationId: string,
  customerId: string | null,
  enabled: boolean
) {
  const locale = useLocale();
  return useQuery({
    queryKey: locationKeys.customer(locationId, customerId ?? "", locale),
    queryFn: () => fetchLocationCustomerDetail(locationId, customerId!, locale),
    enabled: !!locationId && !!customerId && enabled,
    staleTime: 60_000,
  });
}

export function useLocationWarehouse(id: string, enabled: boolean) {
  const locale = useLocale();
  return useQuery({
    queryKey: locationKeys.warehouse(id, locale),
    queryFn: () => fetchLocationWarehouse(id, locale),
    enabled: !!id && enabled,
    staleTime: 60_000,
  });
}

export function useLocationInboundOrderDetail(
  locationId: string,
  orderId: string | null,
  enabled: boolean
) {
  const locale = useLocale();
  return useQuery({
    queryKey: locationKeys.inboundOrder(locationId, orderId ?? "", locale),
    queryFn: () => fetchLocationInboundOrderDetail(locationId, orderId!, locale),
    enabled: !!locationId && !!orderId && enabled,
    staleTime: 60_000,
  });
}
