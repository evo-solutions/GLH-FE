import { buildB2BCustomerDetail } from "@/lib/b2bCustomerDetailData";
import { buildLocationCustomerDetail } from "@/lib/customerDetailBuilder";
import type { LocationCustomerDetail, LocationSalesCustomer } from "@/types/location";

const HOLDING_B2B_LOCATION_ID = "holding-bsv";

/** Khách mẫu + sinh thêm theo cơ sở. */
export function buildSalesCustomersForLocation(
  locationId: string,
  locale: "vi" | "en" | "zh"
): LocationSalesCustomer[] {
  const baseVi: LocationSalesCustomer[] = [
    { id: "c1", name: "Chị Lan Phương", phone: "0912 *** 889", tier: "gold", tierLabel: "Hạng Vàng", totalSpent: "₫48.2 tr", visits: 42, lastVisit: "17/05/2026", preferredHour: "13h–15h" },
    { id: "c2", name: "Anh Tuấn Kiệt", phone: "0934 *** 102", tier: "silver", tierLabel: "Hạng Bạc", totalSpent: "₫12.6 tr", visits: 18, lastVisit: "18/05/2026", preferredHour: "19h–21h" },
    { id: "c3", name: "Chị Hồng Nhung", phone: "0988 *** 556", tier: "bronze", tierLabel: "Hạng Đồng", totalSpent: "₫1.8 tr", visits: 2, lastVisit: "16/05/2026", preferredHour: "11h" },
    { id: "c4", name: "Anh Đức Thịnh", phone: "0909 *** 441", tier: "gold", tierLabel: "Hạng Vàng", totalSpent: "₫32.1 tr", visits: 28, lastVisit: "15/05/2026", preferredHour: "9h–11h" },
    { id: "c5", name: "Chị Mai Trang", phone: "0977 *** 203", tier: "silver", tierLabel: "Hạng Bạc", totalSpent: "₫6.4 tr", visits: 9, lastVisit: "14/05/2026", preferredHour: "17h" },
  ];

  const extraNamesVi = [
    "Anh Minh Quân",
    "Chị Thảo Vy",
    "Anh Bảo Long",
    "Chị Ngọc Hân",
    "Anh Phúc An",
    "Chị Kim Oanh",
    "Anh Hoàng Nam",
    "Chị Diệu Linh",
    "Anh Quốc Bảo",
    "Chị Thu Hà",
    "Anh Văn Đạt",
    "Chị Yến Nhi",
  ];

  const tiers: LocationSalesCustomer["tier"][] = ["gold", "silver", "bronze", "silver", "bronze", "gold", "silver", "bronze", "silver", "gold", "bronze", "silver"];
  const tierLabelsVi = { gold: "Hạng Vàng", silver: "Hạng Bạc", bronze: "Hạng Đồng" };
  const tierLabelsEn = { gold: "Gold", silver: "Silver", bronze: "Bronze" };
  const tierLabelsZh = { gold: "金牌", silver: "银牌", bronze: "铜牌" };
  const tierLabels = locale === "zh" ? tierLabelsZh : locale === "en" ? tierLabelsEn : tierLabelsVi;

  const generated: LocationSalesCustomer[] = extraNamesVi.map((name, i) => {
    const tier = tiers[i];
    const id = `c${6 + i}`;
    const visits = 3 + (i % 12);
    return {
      id,
      name: locale === "en" ? name.replace(/^(Anh|Chị)\s/, "") : name,
      phone: `09${(10 + i) % 90}** *** ${100 + i}`,
      tier,
      tierLabel: tierLabels[tier],
      totalSpent: locale === "en" ? `₫${(visits * 0.8).toFixed(1)}M` : locale === "zh" ? `${(visits * 0.9).toFixed(1)}亿₫` : `₫${(visits * 0.9).toFixed(1)} tr`,
      visits,
      lastVisit: `${(10 + i)}/05/2026`,
      preferredHour: locale === "en" ? `${(9 + i) % 12 + 1}am` : locale === "zh" ? `${9 + (i % 8)}时` : `${9 + (i % 8)}h`,
    };
  });

  const all = [...baseVi, ...generated];
  if (locale === "vi") return all;

  return all.map((row) => {
    if (locale === "en") {
      const enNames: Record<string, string> = {
        c1: "Lan Phuong",
        c2: "Tuan Kiet",
        c3: "Hong Nhung",
        c4: "Duc Thinh",
        c5: "Mai Trang",
      };
      return {
        ...row,
        name: enNames[row.id] ?? row.name.replace(/^(Anh|Chị)\s/, ""),
        tierLabel: tierLabels[row.tier],
        totalSpent: row.totalSpent.replace("tr", "M").replace("nghìn", "K"),
      };
    }
    const zhNames: Record<string, string> = {
      c1: "兰芳",
      c2: "俊杰",
      c3: "红绒",
      c4: "德盛",
      c5: "梅香",
    };
    return {
      ...row,
      name: zhNames[row.id] ?? row.name,
      tierLabel: tierLabels[row.tier],
    };
  });
}

export function getLocationCustomerDetail(
  locationId: string,
  customerId: string,
  locale: "vi" | "en" | "zh"
): LocationCustomerDetail {
  if (locationId === HOLDING_B2B_LOCATION_ID) {
    return buildB2BCustomerDetail(customerId, locale);
  }
  const customers = buildSalesCustomersForLocation(locationId, locale);
  const summary = customers.find((c) => c.id === customerId) ?? customers[0];
  return buildLocationCustomerDetail(locationId, summary, locale);
}
