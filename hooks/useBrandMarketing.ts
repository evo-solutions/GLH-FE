"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchBrandMarketingTabRows } from "@/services/brand-marketing/brand-marketing.service";
import type { BrandMarketingTab } from "@/types/brand-marketing";

export const brandMarketingKeys = {
  all: ["brand-marketing"] as const,
  tab: (locale: string, tab: BrandMarketingTab) =>
    [...brandMarketingKeys.all, tab, locale] as const,
};

export function useBrandMarketingTabRows(tab: BrandMarketingTab, enabled = true) {
  const locale = useLocale();

  return useQuery({
    queryKey: brandMarketingKeys.tab(locale, tab),
    queryFn: () => fetchBrandMarketingTabRows(locale, tab),
    enabled,
    staleTime: 60_000,
  });
}
