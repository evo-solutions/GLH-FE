/** Prefix global admin path with business module base path when scoped. */
export function withModulePrefix(
  moduleBasePath: string | undefined,
  path: string,
): string {
  if (!moduleBasePath) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${moduleBasePath}${normalized}`;
}

export function moduleLocationListPath(moduleBasePath?: string): string {
  return withModulePrefix(moduleBasePath, "/location");
}

export function moduleProductListPath(moduleBasePath?: string): string {
  return withModulePrefix(moduleBasePath, "/product");
}

export function moduleOrderListPath(moduleBasePath?: string): string {
  return withModulePrefix(moduleBasePath, "/order");
}

export function moduleCustomerListPath(moduleBasePath?: string): string {
  return withModulePrefix(moduleBasePath, "/customer");
}
