/**
 * Tổ chức GLH (giai đoạn hiện tại: cty con trực thuộc BSV → sau cổ phần hóa: BSV = holding).
 *
 * Giao diện hiển thị 6 đơn vị ở sidebar (5 cty con B2C + BSV holding); bên trong mỗi đơn vị:
 * Điểm bán · Sản phẩm · Kho · Khách hàng · Marketing
 *
 * - Cty con B2C: SP/KH/DT riêng; kho = tổng hợp các điểm bán thuộc cty đó
 * - BSV B2B: tổng kho toàn hệ thống; SP dược liệu; khách B
 */

export type BusinessModelSlug =
  | "thao-duoc-di-san"
  | "khang-duong-di-san"
  | "yogi-food"
  | "thuong-son-tra"
  | "than-tra"
  | "bong-sen-vang";

export type EntityRole = "subsidiary" | "holding";

export type CommerceModel = "b2c" | "b2b";

/** Phân hệ hiển thị trong từng đơn vị (sidebar chỉ mở tên đơn vị) */
export type BusinessModule =
  | "products"
  | "warehouse"
  | "customers-c"
  | "customers-b"
  | "marketing"
  | "stores"
  | "supply";

export type CustomerSegment = "C" | "B";

export interface BusinessModelConfig {
  slug: BusinessModelSlug;
  navKey: string;
  entityRole: EntityRole;
  commerceModel: CommerceModel;
  customerSegment: CustomerSegment;
  modules: BusinessModule[];
  /** @deprecated */
  kind: "retail" | "holding";
}

const SUBSIDIARY_MODULES: BusinessModule[] = [
  "stores",
  "products",
  "warehouse",
  "customers-c",
  "marketing",
];

const HOLDING_MODULES: BusinessModule[] = [
  "products",
  "warehouse",
  "customers-b",
  "supply",
  "marketing",
];

function subsidiary(slug: BusinessModelSlug, navKey: string): BusinessModelConfig {
  return {
    slug,
    navKey,
    entityRole: "subsidiary",
    commerceModel: "b2c",
    customerSegment: "C",
    modules: SUBSIDIARY_MODULES,
    kind: "retail",
  };
}

export const SUBSIDIARY_B2C_MODELS: BusinessModelConfig[] = [
  subsidiary("thao-duoc-di-san", "thaoDuocDiSan"),
  subsidiary("khang-duong-di-san", "khangDuongDiSan"),
  subsidiary("yogi-food", "yogiFood"),
  subsidiary("thuong-son-tra", "thuongSonTra"),
  subsidiary("than-tra", "thanTra"),
];

export const HOLDING_B2B_MODEL: BusinessModelConfig = {
  slug: "bong-sen-vang",
  navKey: "bongSenVang",
  entityRole: "holding",
  commerceModel: "b2b",
  customerSegment: "B",
  modules: HOLDING_MODULES,
  kind: "holding",
};

/** @deprecated */ export const RETAIL_BUSINESS_MODELS = SUBSIDIARY_B2C_MODELS;
/** @deprecated */ export const HOLDING_BUSINESS_MODEL = HOLDING_B2B_MODEL;

export const ALL_BUSINESS_MODELS: BusinessModelConfig[] = [
  ...SUBSIDIARY_B2C_MODELS,
  HOLDING_B2B_MODEL,
];

const SLUG_SET = new Set(ALL_BUSINESS_MODELS.map((m) => m.slug));

export function isBusinessModelSlug(value: string): value is BusinessModelSlug {
  return SLUG_SET.has(value as BusinessModelSlug);
}

export function getBusinessModelConfig(slug: BusinessModelSlug): BusinessModelConfig {
  return ALL_BUSINESS_MODELS.find((m) => m.slug === slug) ?? SUBSIDIARY_B2C_MODELS[0];
}

export function isSubsidiaryB2C(slug: BusinessModelSlug): boolean {
  return getBusinessModelConfig(slug).entityRole === "subsidiary";
}

export function isHoldingB2B(slug: BusinessModelSlug): boolean {
  return getBusinessModelConfig(slug).entityRole === "holding";
}

export const DEFAULT_SUBSIDIARY_SLUG: BusinessModelSlug = "thao-duoc-di-san";
/** @deprecated */ export const DEFAULT_RETAIL_MODEL = DEFAULT_SUBSIDIARY_SLUG;
