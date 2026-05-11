import { api } from "@/services/api/axios";
import type { ProductDetail, ProductListItem } from "@/types/product";
import { PRODUCT_API } from "./product.api";
import { productMockEn } from "./product-mock-en";
import { productMockZh } from "./product-mock-zh";
import { productMockVi } from "./product.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mockFor(locale: string) {
  if (locale === "en") return productMockEn;
  if (locale === "zh") return productMockZh;
  return productMockVi;
}

export async function fetchProductList(locale = "vi"): Promise<ProductListItem[]> {
  if (USE_MOCK) {
    await delay(350);
    return mockFor(locale).list();
  }
  const { data } = await api.get<ProductListItem[]>(PRODUCT_API.list);
  return data;
}

export async function fetchProductDetail(productCode: string, locale = "vi"): Promise<ProductDetail> {
  if (USE_MOCK) {
    await delay(300);
    return mockFor(locale).detail(productCode);
  }
  const { data } = await api.get<ProductDetail>(PRODUCT_API.detail(productCode));
  return data;
}
