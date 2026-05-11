import { api } from "@/services/api/axios";
import type { DashboardOverview } from "@/types/dashboard";
import { DASHBOARD_API } from "./dashboard.api";
import { mockDashboardOverview } from "./dashboard.mock";
import { mockDashboardOverviewEn } from "./dashboard-mock-en";
import { mockDashboardOverviewZh } from "./dashboard-mock-zh";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Lấy tổng quan dashboard */
export async function fetchDashboardOverview(
  locale = "vi"
): Promise<DashboardOverview> {
  if (USE_MOCK) {
    await delay(400);
    if (locale === "en") return mockDashboardOverviewEn;
    if (locale === "zh") return mockDashboardOverviewZh;
    return mockDashboardOverview;
  }

  const { data } = await api.get<DashboardOverview>(DASHBOARD_API.overview);
  return data;
}
