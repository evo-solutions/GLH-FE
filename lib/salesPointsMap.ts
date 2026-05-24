import type { SalesPoint, SalesPointsMapData, SalesTrend } from "@/types/dashboard";

type Locale = "vi" | "en" | "zh";

function trendFromPct(changePct: number): SalesTrend {
  if (changePct > 0) return "up";
  if (changePct < 0) return "down";
  return "flat";
}

function summarize(points: SalesPoint[]): SalesPointsMapData["summary"] {
  return {
    storeCount: points.length,
    upCount: points.filter((p) => p.trend === "up").length,
    downCount: points.filter((p) => p.trend === "down").length,
    flatCount: points.filter((p) => p.trend === "flat").length,
  };
}

const STORE_SEEDS: Array<{
  id: string;
  top: string;
  left: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  todayRevenueVi: string;
  todayRevenueEn: string;
  todayRevenueZh: string;
  changePct: number;
}> = [
  {
    id: "hn",
    top: "16.8%",
    left: "51.1%",
    nameVi: "Thảo dược di sản · Cầu Giấy",
    nameEn: "Heritage Herbals · Cau Giay",
    nameZh: "草药遗产 · 纸桥",
    todayRevenueVi: "186 tr",
    todayRevenueEn: "₫186M",
    todayRevenueZh: "1860万",
    changePct: -4.2,
  },
  {
    id: "hp",
    top: "18%",
    left: "62.5%",
    nameVi: "Thảo dược di sản · Lê Chân",
    nameEn: "Heritage Herbals · Le Chan",
    nameZh: "草药遗产 · 黎真",
    todayRevenueVi: "92 tr",
    todayRevenueEn: "₫92M",
    todayRevenueZh: "920万",
    changePct: 1.8,
  },
  {
    id: "dn",
    top: "49.5%",
    left: "82.8%",
    nameVi: "Thảo dược di sản · Hải Châu",
    nameEn: "Heritage Herbals · Hai Chau",
    nameZh: "草药遗产 · 海州",
    todayRevenueVi: "118 tr",
    todayRevenueEn: "₫118M",
    todayRevenueZh: "1180万",
    changePct: 0,
  },
  {
    id: "hcm",
    top: "83.8%",
    left: "61.8%",
    nameVi: "Thảo dược di sản · Quận 1",
    nameEn: "Heritage Herbals · District 1",
    nameZh: "草药遗产 · 第一郡",
    todayRevenueVi: "412 tr",
    todayRevenueEn: "₫412M",
    todayRevenueZh: "4120万",
    changePct: 6.5,
  },
  {
    id: "ct",
    top: "89%",
    left: "50.4%",
    nameVi: "Thảo dược di sản · Ninh Kiều",
    nameEn: "Heritage Herbals · Ninh Kieu",
    nameZh: "草药遗产 · 宁桥",
    todayRevenueVi: "74 tr",
    todayRevenueEn: "₫74M",
    todayRevenueZh: "740万",
    changePct: 2.1,
  },
  {
    id: "nt",
    top: "74.6%",
    left: "96.2%",
    nameVi: "Thảo dược di sản · Lộc Thọ",
    nameEn: "Heritage Herbals · Loc Tho",
    nameZh: "草药遗产 · 禄寿",
    todayRevenueVi: "63 tr",
    todayRevenueEn: "₫63M",
    todayRevenueZh: "630万",
    changePct: -1.4,
  },
];

/** Điểm bán trên bản đồ Việt Nam — doanh thu ngày & xu hướng so với hôm qua. */
export function buildSalesPointsMap(locale: Locale): SalesPointsMapData {
  const points: SalesPoint[] = STORE_SEEDS.map((s) => {
    const changePct = s.changePct;
    return {
      id: s.id,
      top: s.top,
      left: s.left,
      changePct,
      trend: trendFromPct(changePct),
      name:
        locale === "zh" ? s.nameZh : locale === "en" ? s.nameEn : s.nameVi,
      todayRevenue:
        locale === "zh"
          ? s.todayRevenueZh
          : locale === "en"
            ? s.todayRevenueEn
            : s.todayRevenueVi,
    };
  });

  return { points, summary: summarize(points) };
}
