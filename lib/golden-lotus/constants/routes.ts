import type { ScreenId } from "../types";

/** URL path cho từng tab (App Router) */
export const GOLDEN_LOTUS_PATHS: Record<ScreenId, string> = {
  dashboard: "/dashboard",
  events: "/events",
  settings: "/settings",
  hrm: "/hrm",
  vendors: "/vendors",
  customer: "/customer",
  sku: "/sku",
  inventory: "/inventory",
  campaign: "/campaign",
  orders: "/orders",
  sellout: "/sellout",
  ar: "/ar",
  reconciliation: "/reconciliation",
  cases: "/cases",
  research: "/research",
  ai: "/ai",
};

export const GOLDEN_LOTUS_SCREEN_IDS = Object.keys(
  GOLDEN_LOTUS_PATHS
) as ScreenId[];

const pathToScreen = Object.fromEntries(
  Object.entries(GOLDEN_LOTUS_PATHS).map(([id, path]) => [path, id])
) as Record<string, ScreenId>;

export function screenIdFromPathname(pathname: string): ScreenId {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/") return "dashboard";
  return pathToScreen[normalized] ?? "dashboard";
}
