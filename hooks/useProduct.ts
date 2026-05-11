"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchProductDetail, fetchProductList } from "@/services/product/product.service";

export const productKeys = {
  all: ["products"] as const,
  list: (locale: string) => [...productKeys.all, "list", locale] as const,
  detail: (productCode: string, locale: string) =>
    [...productKeys.all, "detail", productCode, locale] as const,
};

export function useProductList() {
  const locale = useLocale();
  return useQuery({
    queryKey: productKeys.list(locale),
    queryFn: () => fetchProductList(locale),
    staleTime: 60_000,
  });
}

export function useProductDetail(productCode: string) {
  const locale = useLocale();
  return useQuery({
    queryKey: productKeys.detail(productCode, locale),
    queryFn: () => fetchProductDetail(productCode, locale),
    enabled: !!productCode,
    staleTime: 60_000,
  });
}
