export function productDetailPath(productCode: string) {
  return `/product/${encodeURIComponent(productCode)}`;
}

export function productInboundOrderPath(
  productCode: string,
  locationId: string,
  orderId: string
) {
  return `${productDetailPath(productCode)}/inbound/${locationId}/${orderId}`;
}
