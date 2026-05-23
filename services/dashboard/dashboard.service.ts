import { api } from "@/services/api/axios";
import type { DashboardOverview } from "@/types/dashboard";
import { DASHBOARD_API } from "./dashboard.api";
import {
  buildDashboardOverview,
  type DashboardScopeKind,
} from "./build-dashboard-overview";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Lấy tổng quan dashboard theo phạm vi (holding / công ty con / tổ chức ngoài). */
export async function fetchDashboardOverview(
  locale = "vi",
  scopeKind: DashboardScopeKind = "holding",
): Promise<DashboardOverview> {
  if (USE_MOCK) {
    await delay(400);
    return buildDashboardOverview(locale, scopeKind);
  }

  const { data } = await api.get<DashboardOverview>(DASHBOARD_API.overview, {
    params: { scope: scopeKind },
  });
  return data;
}
