import type { BusinessModelSlug } from "@/libs/business-models/config";
import { getProductListForModel } from "@/lib/productListForModel";
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

export async function fetchProductList(
  locale = "vi",
  businessModel?: BusinessModelSlug
): Promise<ProductListItem[]> {
  if (USE_MOCK) {
    await delay(350);
    const loc = locale === "zh" ? "zh" : locale === "en" ? "en" : "vi";
    const all = mockFor(locale).list();
    return businessModel ? getProductListForModel(all, businessModel, loc) : all;
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
