export function productDetailPath(productCode: string): string {
  return `/product/${encodeURIComponent(productCode)}`;
}
