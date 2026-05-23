import { withModulePrefix } from "@/libs/business-modules/paths";

export function productListPath(moduleBasePath?: string) {
  return withModulePrefix(moduleBasePath, "/product");
}

export function productDetailPath(productCode: string, moduleBasePath?: string) {
  return withModulePrefix(
    moduleBasePath,
    `/product/${encodeURIComponent(productCode)}`,
  );
}

export function productInboundOrderPath(
  productCode: string,
  locationId: string,
  orderId: string,
  moduleBasePath?: string,
) {
  return `${productDetailPath(productCode, moduleBasePath)}/inbound/${locationId}/${orderId}`;
}
