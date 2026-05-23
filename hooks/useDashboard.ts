"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useBusinessModuleScope } from "@/hooks/useBusinessModuleScope";
import {
  dashboardScopeKind,
  type DashboardScopeKind,
} from "@/services/dashboard/build-dashboard-overview";
import { fetchDashboardOverview } from "@/services/dashboard/dashboard.service";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: (locale: string, scopeKind: DashboardScopeKind) =>
    [...dashboardKeys.all, "overview", locale, scopeKind] as const,
};

export function useDashboardOverview() {
  const locale = useLocale();
  const { module } = useBusinessModuleScope();
  const scopeKind = dashboardScopeKind(module);

  return useQuery({
    queryKey: dashboardKeys.overview(locale, scopeKind),
    queryFn: () => fetchDashboardOverview(locale, scopeKind),
    staleTime: 60_000,
  });
}
