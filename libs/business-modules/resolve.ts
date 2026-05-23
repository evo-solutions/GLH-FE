import { getOrgScopeFromPathname } from "@/libs/org-scope/resolve";

export {
  getBusinessModuleByBasePath,
  getOrgScopeByBasePath,
  getOrgScopeFromPathname,
  isOrgScopeRoute,
} from "@/libs/org-scope/resolve";

/** @deprecated Dùng getOrgScopeFromPathname */
export { getOrgScopeFromPathname as getBusinessModuleFromPathname };

export function isBusinessModuleRoute(pathname: string): boolean {
  const scope = getOrgScopeFromPathname(pathname);
  return scope?.kind === "subsidiary";
}
