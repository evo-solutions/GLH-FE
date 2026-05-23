import {
  BUSINESS_MODULE_BY_PATH,
  BUSINESS_MODULES,
  type BusinessModuleConfig,
} from "@/libs/business-modules/config";
import {
  EXTERNAL_ORGANIZATION_BY_PATH,
  EXTERNAL_ORGANIZATIONS,
} from "@/libs/external-organizations/config";
import type { OrgScopeConfig } from "./types";

function subsidiaryToScope(mod: BusinessModuleConfig): OrgScopeConfig {
  return {
    kind: "subsidiary",
    id: mod.id,
    basePath: mod.basePath,
    menuKey: mod.menuKey,
    navLabelKey: mod.navLabelKey,
    icon: mod.icon,
    hasLocation: true,
    hasTradeMarketing: true,
  };
}

const SUBSIDIARY_BY_PATH = Object.fromEntries(
  BUSINESS_MODULES.map((m) => [m.basePath, subsidiaryToScope(m)]),
) as Record<string, OrgScopeConfig>;

export function getOrgScopeByBasePath(
  basePath: string,
): OrgScopeConfig | undefined {
  return SUBSIDIARY_BY_PATH[basePath] ?? EXTERNAL_ORGANIZATION_BY_PATH[basePath];
}

export function getOrgScopeFromPathname(
  pathname: string,
): OrgScopeConfig | undefined {
  const all = [...BUSINESS_MODULES.map(subsidiaryToScope), ...EXTERNAL_ORGANIZATIONS];
  const sorted = [...all].sort((a, b) => b.basePath.length - a.basePath.length);
  for (const scope of sorted) {
    const prefix = `/${scope.basePath}`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return scope;
    }
  }
  return undefined;
}

export function isOrgScopeRoute(pathname: string): boolean {
  return getOrgScopeFromPathname(pathname) !== undefined;
}

/** Chỉ công ty con (subsidiary). */
export function getBusinessModuleByBasePath(
  basePath: string,
): BusinessModuleConfig | undefined {
  return BUSINESS_MODULE_BY_PATH[basePath];
}
