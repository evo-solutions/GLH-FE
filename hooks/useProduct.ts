"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { BusinessModelSlug } from "@/libs/business-models/config";
import { useOptionalBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { DEFAULT_SUBSIDIARY_SLUG } from "@/libs/business-models/config";
import { fetchProductDetail, fetchProductList } from "@/services/product/product.service";

export const productKeys = {
  all: ["products"] as const,
  list: (locale: string, model?: BusinessModelSlug) =>
    [...productKeys.all, "list", locale, model ?? "all"] as const,
  detail: (productCode: string, locale: string) =>
    [...productKeys.all, "detail", productCode, locale] as const,
};

export function useProductList(businessModel?: BusinessModelSlug) {
  const locale = useLocale();
  const model = businessModel ?? useOptionalBusinessModelSlug() ?? DEFAULT_SUBSIDIARY_SLUG;
  return useQuery({
    queryKey: productKeys.list(locale, model),
    queryFn: () => fetchProductList(locale, model),
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
