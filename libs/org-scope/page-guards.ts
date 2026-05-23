import { notFound } from "next/navigation";
import { orgScopeBasePathFromParams } from "./params";
import { getOrgScopeByBasePath } from "./resolve";
import type { OrgScopeConfig } from "./types";

type RequireOrgScopeOptions = {
  requireLocation?: boolean;
  requireTradeMarketing?: boolean;
};

/** Resolve org scope từ segment URL hoặc gọi notFound(). */
export function requireOrgScope(
  businessModule: string | string[] | undefined,
  options?: RequireOrgScopeOptions,
): OrgScopeConfig {
  const basePath = orgScopeBasePathFromParams(businessModule);
  const scope = getOrgScopeByBasePath(basePath);
  if (!scope) notFound();
  if (options?.requireLocation && !scope.hasLocation) notFound();
  if (options?.requireTradeMarketing && !scope.hasTradeMarketing) notFound();
  return scope;
}
