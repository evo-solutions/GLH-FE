export const PRODUCT_API = {
  list: "/api/v1/products",
  detail: (productCode: string) =>
    `/api/v1/products/${encodeURIComponent(productCode)}`,
} as const;
