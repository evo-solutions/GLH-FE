import { parseBusinessModelFromPathname } from "@/lib/businessModelRoutes";
import {
  B2B_DISTRIBUTOR_GROUP_KEY,
  isB2BDistributorChannelSlug,
} from "@/libs/business-models/b2bChannels";

/** Ant Design menu key for the current admin route (leaf menu item). */
export function navSelectedKey(pathname: string): string {
  if (pathname === "/" || pathname === "") return "/";

  const model = parseBusinessModelFromPathname(pathname);
  if (model) {
    if (pathname.includes("/brand/campaigns")) return `/m/${model}/brand/campaigns`;
    if (pathname.includes("/brand/awareness")) return `/m/${model}/brand/awareness`;
    if (pathname.includes("/brand")) return `/m/${model}/brand`;
    if (pathname.includes("/location")) return `/m/${model}/location`;
    if (pathname.includes("/product")) return `/m/${model}/product`;
    if (pathname.includes("/order")) return `/m/${model}/order`;
    if (pathname.includes("/customer")) return `/m/${model}/customer`;
    if (pathname.includes("/marketing")) return `/m/${model}/marketing`;
  }

  return "";
}

/** Parent submenu keys when inside a business model route. */
export function navOpenKeys(pathname: string): string[] {
  const model = parseBusinessModelFromPathname(pathname);
  if (!model) return [];
  const keys = [`bm-${model}`];
  if (isB2BDistributorChannelSlug(model)) {
    keys.unshift(B2B_DISTRIBUTOR_GROUP_KEY);
  }
  return keys;
}
