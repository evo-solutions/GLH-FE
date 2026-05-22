import { parseBusinessModelFromPathname } from "@/lib/businessModelRoutes";

/** Ant Design menu key for the current admin route (leaf menu item). */
export function navSelectedKey(pathname: string): string {
  if (pathname === "/" || pathname === "") return "/";

  const model = parseBusinessModelFromPathname(pathname);
  if (model) {
    if (pathname.includes("/location")) return `/m/${model}/location`;
    if (pathname.includes("/product")) return `/m/${model}/product`;
    if (pathname.includes("/order")) return `/m/${model}/order`;
    if (pathname.includes("/customer")) return `/m/${model}/customer`;
    if (pathname.includes("/marketing")) return `/m/${model}/marketing`;
  }

  return "";
}

/** Parent submenu key when inside a business model route. */
export function navOpenKeys(pathname: string): string[] {
  const model = parseBusinessModelFromPathname(pathname);
  if (model) return [`bm-${model}`];
  return [];
}
