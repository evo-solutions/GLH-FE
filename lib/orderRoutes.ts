import { withModulePrefix } from "@/libs/business-modules/paths";

export function orderListPath(moduleBasePath?: string) {
  return withModulePrefix(moduleBasePath, "/order");
}

export function orderDetailPath(orderId: string, moduleBasePath?: string) {
  return withModulePrefix(moduleBasePath, `/order/${orderId}`);
}
