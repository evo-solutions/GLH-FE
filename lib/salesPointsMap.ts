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
    nameVi: "GLH Hà Nội · Cầu Giấy",
    nameEn: "GLH Hanoi · Cau Giay",
    nameZh: "GLH 河内 · 纸桥",
    todayRevenueVi: "186 tr",
    todayRevenueEn: "₫186M",
    todayRevenueZh: "1860万",
    changePct: -4.2,
  },
  {
    id: "hp",
    top: "18%",
    left: "62.5%",
    nameVi: "GLH Hải Phòng · Lê Chân",
    nameEn: "GLH Hai Phong · Le Chan",
    nameZh: "GLH 海防 · 黎真",
    todayRevenueVi: "92 tr",
    todayRevenueEn: "₫92M",
    todayRevenueZh: "920万",
    changePct: 1.8,
  },
  {
    id: "dn",
    top: "49.5%",
    left: "82.8%",
    nameVi: "GLH Đà Nẵng · Hải Châu",
    nameEn: "GLH Da Nang · Hai Chau",
    nameZh: "GLH 岘港 · 海州",
    todayRevenueVi: "118 tr",
    todayRevenueEn: "₫118M",
    todayRevenueZh: "1180万",
    changePct: 0,
  },
  {
    id: "hcm",
    top: "83.8%",
    left: "61.8%",
    nameVi: "Bông Sen Vàng · Quận 1",
    nameEn: "Golden Lotus · District 1",
    nameZh: "金莲花 · 第一郡",
    todayRevenueVi: "412 tr",
    todayRevenueEn: "₫412M",
    todayRevenueZh: "4120万",
    changePct: 6.5,
  },
  {
    id: "ct",
    top: "89%",
    left: "50.4%",
    nameVi: "GLH Cần Thơ · Ninh Kiều",
    nameEn: "GLH Can Tho · Ninh Kieu",
    nameZh: "GLH 芹苴 · 宁桥",
    todayRevenueVi: "74 tr",
    todayRevenueEn: "₫74M",
    todayRevenueZh: "740万",
    changePct: 2.1,
  },
  {
    id: "nt",
    top: "74.6%",
    left: "96.2%",
    nameVi: "GLH Nha Trang · Lộc Thọ",
    nameEn: "GLH Nha Trang · Loc Tho",
    nameZh: "GLH 芽庄 · 禄寿",
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
