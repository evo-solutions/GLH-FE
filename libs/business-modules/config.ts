import type { ComponentType } from "react";
import {
  CoffeeOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  ShopOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

/** Ant Design submenu key — nhóm tất cả công ty con. */
export const SUBSIDIARY_MENU_KEY = "subsidiary";

export type BusinessModuleId =
  | "thaoDuocDiSan"
  | "khangDuongDiSan"
  | "yogiFood"
  | "thuongSonTra"
  | "thanTra";

export type BusinessModuleConfig = {
  id: BusinessModuleId;
  /** URL segment, e.g. `heritage` → `/heritage` */
  basePath: string;
  /** Ant Design submenu key (non-route) */
  menuKey: string;
  /** `nav.{navLabelKey}` in i18n */
  navLabelKey: string;
  icon: ComponentType<{ className?: string }>;
};

export const BUSINESS_MODULES: BusinessModuleConfig[] = [
  {
    id: "thaoDuocDiSan",
    basePath: "heritage",
    menuKey: "bm-thao-duoc-di-san",
    navLabelKey: "thaoDuocDiSan",
    icon: MedicineBoxOutlined,
  },
  {
    id: "khangDuongDiSan",
    basePath: "khang-duong-di-san",
    menuKey: "bm-khang-duong-di-san",
    navLabelKey: "khangDuongDiSan",
    icon: ThunderboltOutlined,
  },
  {
    id: "yogiFood",
    basePath: "yogi-food",
    menuKey: "bm-yogi-food",
    navLabelKey: "yogiFood",
    icon: CoffeeOutlined,
  },
  {
    id: "thuongSonTra",
    basePath: "thuong-son-tra",
    menuKey: "bm-thuong-son-tra",
    navLabelKey: "thuongSonTra",
    icon: ShopOutlined,
  },
  {
    id: "thanTra",
    basePath: "than-tra",
    menuKey: "bm-than-tra",
    navLabelKey: "thanTra",
    icon: FireOutlined,
  },
];

export const BUSINESS_MODULE_BY_PATH = Object.fromEntries(
  BUSINESS_MODULES.map((m) => [m.basePath, m]),
) as Record<string, BusinessModuleConfig>;

export const BUSINESS_MODULE_BY_ID = Object.fromEntries(
  BUSINESS_MODULES.map((m) => [m.id, m]),
) as Record<BusinessModuleId, BusinessModuleConfig>;

export function businessModuleOverviewPath(basePath: string): string {
  return `/${basePath}`;
}

export function businessModuleTradePath(basePath: string): string {
  return `/${basePath}/trade-marketing`;
}

export function businessModuleInsightsPath(basePath: string): string {
  return `/${basePath}/insights`;
}
