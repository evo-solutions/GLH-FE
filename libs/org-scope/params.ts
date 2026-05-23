/** Ghép segment catch-all `[...businessModule]` thành basePath (vd. `ext/phong-chan-tri-yhct`). */
export function orgScopeBasePathFromParams(
  businessModule: string | string[] | undefined,
): string {
  if (!businessModule) return "";
  if (Array.isArray(businessModule)) return businessModule.join("/");
  return businessModule;
}
