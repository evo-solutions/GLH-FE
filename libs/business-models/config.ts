/**
 * Tổ chức GLH (giai đoạn hiện tại: cty con trực thuộc BSV → sau cổ phần hóa: BSV = holding).
 *
 * Sidebar:
 * - 5 cty con B2C (Điểm bán · SP · Kho · KH C · Trade MKT)
 * - 13 kênh B2B (SP theo tab dòng hàng · Kho · KH B · Trade MKT)
 * - Bông Sen Vàng Holding (Nguồn cung · tổng kho · KH B tổng hợp)
 */

import type { B2BCustomerSegmentKey, B2BProductLineKey } from "@/lib/b2bCustomerCatalog";
import { getB2BSegment } from "@/lib/b2bCustomerCatalog";
import {
  B2B_CHANNEL_DEFINITIONS,
  type B2BChannelSlug,
  isB2BChannelSlug,
  getSegmentKeyForChannelSlug,
} from "@/libs/business-models/b2bChannels";

export type { B2BChannelSlug };

export type BusinessModelSlug =
  | "thao-duoc-di-san"
  | "khang-duong-di-san"
  | "yogi-food"
  | "thuong-son-tra"
  | "than-tra"
  | B2BChannelSlug
  | "bong-sen-vang";

export type EntityRole = "subsidiary" | "holding" | "b2b-channel";

export type CommerceModel = "b2c" | "b2b";

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
  /** Phân khúc B2B — kênh B2B & mapping tab sản phẩm */
  b2bSegmentKey?: B2BCustomerSegmentKey;
  productLineKeys?: B2BProductLineKey[];
  /** @deprecated */
  kind: "retail" | "holding" | "b2b-channel";
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

const B2B_CHANNEL_MODULES: BusinessModule[] = [
  "products",
  "warehouse",
  "customers-b",
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

function b2bChannel(def: (typeof B2B_CHANNEL_DEFINITIONS)[number]): BusinessModelConfig {
  const segment = getB2BSegment(def.segmentKey);
  return {
    slug: def.slug,
    navKey: def.navKey,
    entityRole: "b2b-channel",
    commerceModel: "b2b",
    customerSegment: "B",
    modules: B2B_CHANNEL_MODULES,
    b2bSegmentKey: def.segmentKey,
    productLineKeys: segment.productLineKeys,
    kind: "b2b-channel",
  };
}

export const SUBSIDIARY_B2C_MODELS: BusinessModelConfig[] = [
  subsidiary("thao-duoc-di-san", "thaoDuocDiSan"),
  subsidiary("khang-duong-di-san", "khangDuongDiSan"),
  subsidiary("yogi-food", "yogiFood"),
  subsidiary("thuong-son-tra", "thuongSonTra"),
  subsidiary("than-tra", "thanTra"),
];

export const B2B_CHANNEL_MODELS: BusinessModelConfig[] =
  B2B_CHANNEL_DEFINITIONS.map(b2bChannel);

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
  ...B2B_CHANNEL_MODELS,
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
  return slug === "bong-sen-vang";
}

export function isB2BChannelModel(slug: BusinessModelSlug): slug is B2BChannelSlug {
  return isB2BChannelSlug(slug);
}

export function isB2BCommerce(slug: BusinessModelSlug): boolean {
  return isHoldingB2B(slug) || isB2BChannelModel(slug);
}

export function getB2BSegmentKeyForModel(
  slug: BusinessModelSlug
): B2BCustomerSegmentKey | undefined {
  if (isB2BChannelModel(slug)) return getSegmentKeyForChannelSlug(slug);
  return getBusinessModelConfig(slug).b2bSegmentKey;
}

export const DEFAULT_SUBSIDIARY_SLUG: BusinessModelSlug = "thao-duoc-di-san";
/** @deprecated */ export const DEFAULT_RETAIL_MODEL = DEFAULT_SUBSIDIARY_SLUG;
