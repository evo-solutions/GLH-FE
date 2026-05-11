"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchDashboardOverview } from "@/services/dashboard/dashboard.service";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: (locale: string) => [...dashboardKeys.all, "overview", locale] as const,
};

export function useDashboardOverview() {
  const locale = useLocale();

  return useQuery({
    queryKey: dashboardKeys.overview(locale),
    queryFn: () => fetchDashboardOverview(locale),
    staleTime: 60_000,
  });
}
