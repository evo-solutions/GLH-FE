import type { BusinessModelSlug } from "@/libs/business-models/config";
import { getB2BSegmentKeyForModel, isHoldingB2B } from "@/libs/business-models/config";
import { getB2bChannelProductList } from "@/lib/b2bChannelProductData";
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
  const segmentKey = getB2BSegmentKeyForModel(model);
  if (segmentKey) return getB2bChannelProductList(segmentKey, locale);
  if (isHoldingB2B(model)) return getHoldingProductList(locale);
  return filterProductsForModel(allRetail, model);
}
