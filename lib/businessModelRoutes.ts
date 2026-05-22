import type { BusinessModelSlug } from "@/libs/business-models/config";

const PREFIX = "/m";

export function businessModelBasePath(slug: BusinessModelSlug): string {
  return `${PREFIX}/${slug}`;
}

export function modelLocationListPath(slug: BusinessModelSlug): string {
  return `${businessModelBasePath(slug)}/location`;
}

export function modelProductListPath(slug: BusinessModelSlug): string {
  return `${businessModelBasePath(slug)}/product`;
}

export function modelOrderListPath(slug: BusinessModelSlug): string {
  return `${businessModelBasePath(slug)}/order`;
}

export function modelCustomerListPath(slug: BusinessModelSlug): string {
  return `${businessModelBasePath(slug)}/customer`;
}

export function modelMarketingPath(slug: BusinessModelSlug): string {
  return `${businessModelBasePath(slug)}/marketing`;
}

export function modelSupplyPath(slug: BusinessModelSlug): string {
  return `${businessModelBasePath(slug)}/supply`;
}

/** Trang mặc định khi mở một đơn vị */
export function modelDefaultModulePath(slug: BusinessModelSlug): string {
  return modelProductListPath(slug);
}

export function modelLocationDetailPath(
  slug: BusinessModelSlug,
  locationId: string,
  tab?: string
): string {
  const base = `${businessModelBasePath(slug)}/location/${locationId}`;
  return tab ? `${base}?tab=${tab}` : base;
}

export function modelLocationCustomerPath(
  slug: BusinessModelSlug,
  locationId: string,
  customerId: string
): string {
  return `${businessModelBasePath(slug)}/location/${locationId}/customer/${customerId}`;
}

export function modelProductDetailPath(slug: BusinessModelSlug, productCode: string): string {
  return `${businessModelBasePath(slug)}/product/${encodeURIComponent(productCode)}`;
}

export function modelProductInboundOrderPath(
  slug: BusinessModelSlug,
  productCode: string,
  locationId: string,
  orderId: string
): string {
  return `${modelProductDetailPath(slug, productCode)}/inbound/${locationId}/${orderId}`;
}

export function modelOrderDetailPath(slug: BusinessModelSlug, orderId: string): string {
  return `${businessModelBasePath(slug)}/order/${orderId}`;
}

export function modelCustomerDetailPath(slug: BusinessModelSlug, globalId: string): string {
  return `${businessModelBasePath(slug)}/customer/${globalId}`;
}

export function parseBusinessModelFromPathname(pathname: string): BusinessModelSlug | null {
  const m = pathname.match(/^\/m\/([^/]+)/);
  return m ? (m[1] as BusinessModelSlug) : null;
}
