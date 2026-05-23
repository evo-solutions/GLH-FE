"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { OrgScopeBrandId } from "@/services/business-module/mock-brands";
import {
  fetchBusinessModuleTabRows,
  type BusinessModuleSectionKey,
} from "@/services/business-module/business-module.service";
import type { HeritageInsightsTab, HeritageTradeTab } from "@/types/heritage";

export const businessModuleKeys = {
  all: ["business-module"] as const,
  tab: (
    moduleId: OrgScopeBrandId,
    locale: string,
    section: BusinessModuleSectionKey,
    tab: HeritageTradeTab | HeritageInsightsTab,
  ) =>
    [...businessModuleKeys.all, moduleId, section, tab, locale] as const,
};

export function useBusinessModuleTabRows(
  moduleId: OrgScopeBrandId,
  section: BusinessModuleSectionKey,
  tab: HeritageTradeTab | HeritageInsightsTab,
  enabled = true,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: businessModuleKeys.tab(moduleId, locale, section, tab),
    queryFn: () => fetchBusinessModuleTabRows(moduleId, locale, section, tab),
    enabled,
    staleTime: 60_000,
  });
}
