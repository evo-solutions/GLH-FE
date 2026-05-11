import type { ScreenId } from "../types";

/** Nhóm sidebar theo vai trò nghiệp vụ */
export type NavGroupId = "ops" | "trade" | "brand" | "research" | "hrm";

export const GOLDEN_LOTUS_MENU_GROUPS: {
  id: NavGroupId;
  screens: ScreenId[];
}[] = [
  {
    id: "ops",
    screens: ["dashboard", "settings"],
  },
  {
    id: "trade",
    screens: ["vendors", "sku"],
  },
  {
    id: "brand",
    screens: ["customer", "campaign", "cases"],
  },
  {
    id: "research",
    screens: ["research", "ai"],
  },
  {
    id: "hrm",
    screens: ["hrm"],
  },
];

/** Thứ tự màn hình phẳng (legacy / tham chiếu) */
export const GOLDEN_LOTUS_NAV_ORDER: ScreenId[] =
  GOLDEN_LOTUS_MENU_GROUPS.flatMap((g) => g.screens);
