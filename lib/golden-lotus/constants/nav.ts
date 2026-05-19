import type { ScreenId } from "@/lib/golden-lotus/types";

/** Nhóm sidebar theo luồng hãng dược → điểm bán → sell-out */
export type NavGroupId =
  | "command"
  | "identity"
  | "outlets"
  | "catalog"
  | "commercial"
  | "finance"
  | "cx_intel";

export const GOLDEN_LOTUS_MENU_GROUPS: {
  id: NavGroupId;
  screens: ScreenId[];
}[] = [
  {
    id: "command",
    screens: ["dashboard", "events"],
  },
  {
    id: "identity",
    screens: ["settings", "hrm"],
  },
  {
    id: "outlets",
    screens: ["vendors", "customer"],
  },
  {
    id: "catalog",
    screens: ["sku", "inventory"],
  },
  {
    id: "commercial",
    screens: ["campaign", "orders", "sellout"],
  },
  {
    id: "finance",
    screens: ["ar", "reconciliation"],
  },
  {
    id: "cx_intel",
    screens: ["cases", "research", "ai"],
  },
];

/** Thứ tự màn hình phẳng (legacy / tham chiếu) */
export const GOLDEN_LOTUS_NAV_ORDER: ScreenId[] =
  GOLDEN_LOTUS_MENU_GROUPS.flatMap((g) => g.screens);
