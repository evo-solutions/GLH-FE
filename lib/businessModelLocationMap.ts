import type { BusinessModelSlug } from "@/libs/business-models/config";

/** Gán từng điểm bán vào một mô hình kinh doanh. */
export const LOCATION_BUSINESS_MODEL: Record<string, BusinessModelSlug> = {
  "loc-hcm-1": "thao-duoc-di-san",
  "loc-hcm-2": "thao-duoc-di-san",
  "loc-hcm-3": "thao-duoc-di-san",
  "loc-hn-1": "thao-duoc-di-san",
  "loc-dn-1": "thao-duoc-di-san",
  "loc-hcm-4": "than-tra",
  "loc-hcm-5": "than-tra",
  "loc-hn-2": "than-tra",
  "loc-hn-3": "thuong-son-tra",
  "loc-hp-1": "thuong-son-tra",
  "loc-hn-4": "khang-duong-di-san",
  "loc-dn-2": "khang-duong-di-san",
  "loc-ct-1": "khang-duong-di-san",
  "loc-ct-2": "khang-duong-di-san",
  "loc-bd-1": "khang-duong-di-san",
  "loc-nt-1": "yogi-food",
  "loc-hue-1": "yogi-food",
  "loc-vt-1": "yogi-food",
};

export function getLocationBusinessModel(locationId: string): BusinessModelSlug {
  return LOCATION_BUSINESS_MODEL[locationId] ?? "thao-duoc-di-san";
}
