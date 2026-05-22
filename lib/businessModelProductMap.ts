import type { BusinessModelSlug } from "@/libs/business-models/config";

/** SP có thể bán chung giữa nhiều cty con (không phải Đông y / dược liệu thô) */
export const SHARED_B2C_PRODUCT_CODES = ["BSV-2281"] as const;

/** Thuốc Đông y / dược liệu — không bán tại thương hiệu trà & YOGI FOOD */
export const TCM_HERBAL_PRODUCT_CODES = ["BSV-COV19", "BSV-1199"] as const;

export const MODELS_EXCLUDE_TCM_HERBAL: BusinessModelSlug[] = [
  "than-tra",
  "thuong-son-tra",
  "yogi-food",
];

/**
 * Danh mục SP theo cty con — giải quyết nhu cầu C khác nhau.
 * SP chung được gộp thêm qua SHARED_B2C_PRODUCT_CODES.
 */
export const B2C_PRODUCT_BY_MODEL: Record<
  Exclude<BusinessModelSlug, "bong-sen-vang">,
  string[]
> = {
  "thao-duoc-di-san": ["BSV-4412", "BSV-2281", "BSV-7710", "BSV-9033", "BSV-COV19", "BSV-1199"],
  "khang-duong-di-san": ["BSV-9033", "BSV-8801", "BSV-7022", "BSV-7710"],
  "yogi-food": ["BSV-7022", "BSV-5520", "BSV-8801"],
  "thuong-son-tra": ["BSV-6108", "BSV-3344"],
  "than-tra": ["BSV-5520", "BSV-6108"],
};

export const B2B_HOLDING_PRODUCT_CODES = [
  "BSV-RM-001",
  "BSV-RM-002",
  "BSV-RM-003",
  "BSV-RM-004",
  "BSV-RM-005",
  "BSV-RM-006",
] as const;

function mergeUnique(codes: string[]): string[] {
  return [...new Set(codes)];
}

export function getProductCodesForModel(model: BusinessModelSlug): string[] {
  if (model === "bong-sen-vang") return [...B2B_HOLDING_PRODUCT_CODES];

  const base = B2C_PRODUCT_BY_MODEL[model] ?? [];
  const withShared = mergeUnique([...base, ...SHARED_B2C_PRODUCT_CODES]);

  if (MODELS_EXCLUDE_TCM_HERBAL.includes(model)) {
    const excluded = new Set<string>(TCM_HERBAL_PRODUCT_CODES);
    return withShared.filter((code) => !excluded.has(code));
  }
  return withShared;
}

export function productBelongsToModel(productCode: string, model: BusinessModelSlug): boolean {
  return getProductCodesForModel(model).includes(productCode);
}
