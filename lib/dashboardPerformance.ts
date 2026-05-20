import type {
  ProductPerformanceData,
  ProductPerformanceRow,
  StorePerformanceData,
  StorePerformanceRow,
} from "@/types/dashboard";

type Locale = "vi" | "en" | "zh";

function formatGrowth(pct: number): string {
  if (pct > 0) return `+${pct}%`;
  if (pct < 0) return `${pct}%`;
  return "0%";
}

function formatCustomers(locale: Locale, count: number): string {
  if (locale === "zh") return `${count.toLocaleString("zh-CN")} 人`;
  if (locale === "en") return count.toLocaleString("en-US");
  return count.toLocaleString("vi-VN");
}

const TOP_STORES: Array<{
  storeCode: string;
  revenueVi: string;
  revenueEn: string;
  revenueZh: string;
  costVi: string;
  costEn: string;
  costZh: string;
  growthPct: number;
}> = [
  {
    storeCode: "HN-01",
    revenueVi: "420tr",
    revenueEn: "₫420M",
    revenueZh: "4200万",
    costVi: "298tr",
    costEn: "₫298M",
    costZh: "2980万",
    growthPct: 18,
  },
  {
    storeCode: "HCM-01",
    revenueVi: "412tr",
    revenueEn: "₫412M",
    revenueZh: "4120万",
    costVi: "291tr",
    costEn: "₫291M",
    costZh: "2910万",
    growthPct: 12,
  },
  {
    storeCode: "HCM-03",
    revenueVi: "385tr",
    revenueEn: "₫385M",
    revenueZh: "3850万",
    costVi: "272tr",
    costEn: "₫272M",
    costZh: "2720万",
    growthPct: 9,
  },
  {
    storeCode: "DN-01",
    revenueVi: "118tr",
    revenueEn: "₫118M",
    revenueZh: "1180万",
    costVi: "84tr",
    costEn: "₫84M",
    costZh: "840万",
    growthPct: 7,
  },
  {
    storeCode: "HP-02",
    revenueVi: "96tr",
    revenueEn: "₫96M",
    revenueZh: "960万",
    costVi: "68tr",
    costEn: "₫68M",
    costZh: "680万",
    growthPct: 5,
  },
];

const WORST_STORES: Array<{
  storeCode: string;
  revenueVi: string;
  revenueEn: string;
  revenueZh: string;
  costVi: string;
  costEn: string;
  costZh: string;
  growthPct: number;
}> = [
  {
    storeCode: "DN-02",
    revenueVi: "90tr",
    revenueEn: "₫90M",
    revenueZh: "900万",
    costVi: "78tr",
    costEn: "₫78M",
    costZh: "780万",
    growthPct: -22,
  },
  {
    storeCode: "NT-01",
    revenueVi: "63tr",
    revenueEn: "₫63M",
    revenueZh: "630万",
    costVi: "55tr",
    costEn: "₫55M",
    costZh: "550万",
    growthPct: -14,
  },
  {
    storeCode: "CT-02",
    revenueVi: "58tr",
    revenueEn: "₫58M",
    revenueZh: "580万",
    costVi: "51tr",
    costEn: "₫51M",
    costZh: "510万",
    growthPct: -11,
  },
  {
    storeCode: "HN-04",
    revenueVi: "72tr",
    revenueEn: "₫72M",
    revenueZh: "720万",
    costVi: "64tr",
    costEn: "₫64M",
    costZh: "640万",
    growthPct: -8,
  },
  {
    storeCode: "HP-01",
    revenueVi: "68tr",
    revenueEn: "₫68M",
    revenueZh: "680万",
    costVi: "61tr",
    costEn: "₫61M",
    costZh: "610万",
    growthPct: -6,
  },
];

const TOP_PRODUCTS: Array<{
  id: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  revenueVi: string;
  revenueEn: string;
  revenueZh: string;
  customers: number;
}> = [
  {
    id: "top-1",
    nameVi: "Cao dược Tết · GLH-HERB-A",
    nameEn: "Tet herb blend · GLH-HERB-A",
    nameZh: "春节草本 · GLH-HERB-A",
    revenueVi: "320tr",
    revenueEn: "₫320M",
    revenueZh: "3200万",
    customers: 8420,
  },
  {
    id: "top-2",
    nameVi: "Omega-3 GLH · GLH-OMEGA3",
    nameEn: "Omega-3 GLH · GLH-OMEGA3",
    nameZh: "深海鱼油 · GLH-OMEGA3",
    revenueVi: "248tr",
    revenueEn: "₫248M",
    revenueZh: "2480万",
    customers: 6150,
  },
  {
    id: "top-3",
    nameVi: "Vitamin C 1000mg · GLH-VITC",
    nameEn: "Vitamin C 1000mg · GLH-VITC",
    nameZh: "维生素C 1000mg · GLH-VITC",
    revenueVi: "186tr",
    revenueEn: "₫186M",
    revenueZh: "1860万",
    customers: 5280,
  },
  {
    id: "top-4",
    nameVi: "Collagen peptide · GLH-COLLAG",
    nameEn: "Collagen peptide · GLH-COLLAG",
    nameZh: "胶原蛋白肽 · GLH-COLLAG",
    revenueVi: "142tr",
    revenueEn: "₫142M",
    revenueZh: "1420万",
    customers: 3910,
  },
  {
    id: "top-5",
    nameVi: "Probiotic 10 tỷ CFU · GLH-PROBIO",
    nameEn: "Probiotic 10B CFU · GLH-PROBIO",
    nameZh: "益生菌 100亿 · GLH-PROBIO",
    revenueVi: "118tr",
    revenueEn: "₫118M",
    revenueZh: "1180万",
    customers: 2740,
  },
];

const DEAD_PRODUCTS: Array<{
  id: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  revenueVi: string;
  revenueEn: string;
  revenueZh: string;
  customers: number;
}> = [
  {
    id: "dead-1",
    nameVi: "Detox thảo dược · GLH-DETOX-B",
    nameEn: "Herbal detox · GLH-DETOX-B",
    nameZh: "草本排毒 · GLH-DETOX-B",
    revenueVi: "8tr",
    revenueEn: "₫8M",
    revenueZh: "80万",
    customers: 42,
  },
  {
    id: "dead-2",
    nameVi: "Sleep support · GLH-SLEEP-X",
    nameEn: "Sleep support · GLH-SLEEP-X",
    nameZh: "助眠配方 · GLH-SLEEP-X",
    revenueVi: "11tr",
    revenueEn: "₫11M",
    revenueZh: "110万",
    customers: 58,
  },
  {
    id: "dead-3",
    nameVi: "Mặt nạ collagen · GLH-MASK-02",
    nameEn: "Collagen mask · GLH-MASK-02",
    nameZh: "胶原面膜 · GLH-MASK-02",
    revenueVi: "6tr",
    revenueEn: "₫6M",
    revenueZh: "60万",
    customers: 31,
  },
  {
    id: "dead-4",
    nameVi: "Trà thảo mộc legacy · GLH-TEA-OLD",
    nameEn: "Legacy herbal tea · GLH-TEA-OLD",
    nameZh: "经典草本茶 · GLH-TEA-OLD",
    revenueVi: "5tr",
    revenueEn: "₫5M",
    revenueZh: "50万",
    customers: 24,
  },
  {
    id: "dead-5",
    nameVi: "Combo kit cũ · GLH-KIT-09",
    nameEn: "Legacy combo kit · GLH-KIT-09",
    nameZh: "旧款组合装 · GLH-KIT-09",
    revenueVi: "9tr",
    revenueEn: "₫9M",
    revenueZh: "90万",
    customers: 37,
  },
];

function mapStores(
  locale: Locale,
  seeds: typeof TOP_STORES
): StorePerformanceRow[] {
  return seeds.map((s) => ({
    storeCode: s.storeCode,
    revenue:
      locale === "zh" ? s.revenueZh : locale === "en" ? s.revenueEn : s.revenueVi,
    cost: locale === "zh" ? s.costZh : locale === "en" ? s.costEn : s.costVi,
    growthPct: s.growthPct,
    growth: formatGrowth(s.growthPct),
  }));
}

function mapProducts(
  locale: Locale,
  seeds: typeof TOP_PRODUCTS
): ProductPerformanceRow[] {
  return seeds.map((p) => ({
    id: p.id,
    productName:
      locale === "zh" ? p.nameZh : locale === "en" ? p.nameEn : p.nameVi,
    revenue:
      locale === "zh" ? p.revenueZh : locale === "en" ? p.revenueEn : p.revenueVi,
    customerCount: formatCustomers(locale, p.customers),
  }));
}

export function buildStorePerformance(locale: Locale): StorePerformanceData {
  return {
    topStores: mapStores(locale, TOP_STORES),
    worstStores: mapStores(locale, WORST_STORES),
  };
}

export function buildProductPerformance(locale: Locale): ProductPerformanceData {
  return {
    topProducts: mapProducts(locale, TOP_PRODUCTS),
    deadProducts: mapProducts(locale, DEAD_PRODUCTS),
  };
}
