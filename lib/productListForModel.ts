import type { BusinessModelSlug } from "@/libs/business-models/config";
import { isHoldingB2B } from "@/libs/business-models/config";
import { getProductCodesForModel } from "@/lib/businessModelProductMap";
import { getHoldingProductList } from "@/lib/holdingProductData";
import type { ProductListItem } from "@/types/product";

export function filterProductsForModel(
  all: ProductListItem[],
  model: BusinessModelSlug
): ProductListItem[] {
  const codes = new Set(getProductCodesForModel(model));
  return all.filter((p) => codes.has(p.productCode));
}

export function getProductListForModel(
  allRetail: ProductListItem[],
  model: BusinessModelSlug,
  locale: "vi" | "en" | "zh"
): ProductListItem[] {
  if (isHoldingB2B(model)) return getHoldingProductList(locale);
  return filterProductsForModel(allRetail, model);
}
