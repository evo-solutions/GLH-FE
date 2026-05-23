import {
  SUBSIDIARY_MENU_KEY,
  businessModuleInsightsPath,
  businessModuleOverviewPath,
  businessModuleTradePath,
} from "./config";
import { EXTERNAL_ORGANIZATION_MENU_KEY } from "@/libs/external-organizations/config";
import { getOrgScopeFromPathname } from "@/libs/org-scope/resolve";

function moduleChildPath(basePath: string, segment: string): string {
  return `/${basePath}/${segment}`;
}

export function navSelectedKeyForPath(pathname: string): string {
  if (pathname === "/" || pathname === "") return "/";

  const scope = getOrgScopeFromPathname(pathname);
  if (scope) {
    const base = scope.basePath;
    const trade = businessModuleTradePath(base);
    const insights = businessModuleInsightsPath(base);
    const overview = businessModuleOverviewPath(base);

    if (scope.hasTradeMarketing && pathname.startsWith(trade)) return trade;
    if (pathname.startsWith(insights)) return insights;
    if (pathname === overview || pathname === `${overview}/`) return overview;
    if (scope.hasLocation && pathname.startsWith(moduleChildPath(base, "location"))) {
      return moduleChildPath(base, "location");
    }
    if (pathname.startsWith(moduleChildPath(base, "product"))) {
      return moduleChildPath(base, "product");
    }
    if (pathname.startsWith(moduleChildPath(base, "order"))) {
      return moduleChildPath(base, "order");
    }
    if (pathname.startsWith(moduleChildPath(base, "customer"))) {
      return moduleChildPath(base, "customer");
    }
  }

  if (pathname.startsWith("/insights")) {
    const q = pathname.indexOf("?");
    const path = q >= 0 ? pathname.slice(0, q) : pathname;
    if (path === "/insights" || path === "/insights/") {
      return "/insights";
    }
    return path;
  }

  if (pathname.startsWith("/supply-source")) {
    const q = pathname.indexOf("?");
    const path = q >= 0 ? pathname.slice(0, q) : pathname;
    if (path === "/supply-source" || path === "/supply-source/") {
      return "/supply-source";
    }
    return path;
  }

  if (pathname.startsWith("/brand-marketing")) {
    const q = pathname.indexOf("?");
    const path = q >= 0 ? pathname.slice(0, q) : pathname;
    if (path === "/brand-marketing" || path === "/brand-marketing/") {
      return "/brand-marketing";
    }
    return path;
  }

  if (pathname.startsWith("/location")) return "/location";
  if (pathname.startsWith("/product")) return "/product";
  if (pathname.startsWith("/order")) return "/order";
  if (pathname.startsWith("/customer")) return "/customer";
  return "";
}

export function navOpenKeysForPath(pathname: string): string[] {
  const scope = getOrgScopeFromPathname(pathname);
  if (!scope) return [];

  if (scope.kind === "subsidiary") {
    return [SUBSIDIARY_MENU_KEY, scope.menuKey];
  }

  const keys = [EXTERNAL_ORGANIZATION_MENU_KEY];
  if (scope.parentMenuKey) keys.push(scope.parentMenuKey);
  keys.push(scope.menuKey);
  return keys;
}
