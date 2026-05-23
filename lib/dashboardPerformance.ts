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

type StoreSeed = {
  storeCode: string;
  revenueVi: string;
  revenueEn: string;
  revenueZh: string;
  costVi: string;
  costEn: string;
  costZh: string;
  growthPct: number;
};

const TOP_STORES: StoreSeed[] = [
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

const WORST_STORES: StoreSeed[] = [
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

type CompanyImportSeed = {
  id: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  importValueVi: string;
  importValueEn: string;
  importValueZh: string;
  importOrdersVi: string;
  importOrdersEn: string;
  importOrdersZh: string;
  growthPct: number;
};

const TOP_IMPORT_COMPANIES: CompanyImportSeed[] = [
  {
    id: "heritage",
    nameVi: "Thảo dược di sản",
    nameEn: "Heritage botanicals",
    nameZh: "传承草本",
    importValueVi: "2,4 tỷ",
    importValueEn: "₫2.4B",
    importValueZh: "24亿",
    importOrdersVi: "128 đơn",
    importOrdersEn: "128 orders",
    importOrdersZh: "128 单",
    growthPct: 18,
  },
  {
    id: "khang-duong",
    nameVi: "Khang dưỡng di sản",
    nameEn: "Khang Duong heritage",
    nameZh: "康养传承",
    importValueVi: "1,8 tỷ",
    importValueEn: "₫1.8B",
    importValueZh: "18亿",
    importOrdersVi: "96 đơn",
    importOrdersEn: "96 orders",
    importOrdersZh: "96 单",
    growthPct: 12,
  },
  {
    id: "yogi-food",
    nameVi: "Yogi Food",
    nameEn: "Yogi Food",
    nameZh: "Yogi Food",
    importValueVi: "1,2 tỷ",
    importValueEn: "₫1.2B",
    importValueZh: "12亿",
    importOrdersVi: "84 đơn",
    importOrdersEn: "84 orders",
    importOrdersZh: "84 单",
    growthPct: 9,
  },
  {
    id: "thuong-son-tra",
    nameVi: "Thượng Sơn Trà",
    nameEn: "Thuong Son Tra",
    nameZh: "上山茶",
    importValueVi: "980 tr",
    importValueEn: "₫980M",
    importValueZh: "9.8亿",
    importOrdersVi: "72 đơn",
    importOrdersEn: "72 orders",
    importOrdersZh: "72 单",
    growthPct: 7,
  },
  {
    id: "than-tra",
    nameVi: "Thần Trà",
    nameEn: "Than Tra",
    nameZh: "神茶",
    importValueVi: "820 tr",
    importValueEn: "₫820M",
    importValueZh: "8.2亿",
    importOrdersVi: "65 đơn",
    importOrdersEn: "65 orders",
    importOrdersZh: "65 单",
    growthPct: 5,
  },
];

const LOW_IMPORT_COMPANIES: CompanyImportSeed[] = [
  {
    id: "ext-xuat-khau",
    nameVi: "Xuất khẩu",
    nameEn: "Export",
    nameZh: "出口",
    importValueVi: "210 tr",
    importValueEn: "₫210M",
    importValueZh: "2.1亿",
    importOrdersVi: "18 đơn",
    importOrdersEn: "18 orders",
    importOrdersZh: "18 单",
    growthPct: -22,
  },
  {
    id: "ext-phong-chan",
    nameVi: "Phòng chẩn trị YHCT",
    nameEn: "TCM clinic",
    nameZh: "中医诊室",
    importValueVi: "185 tr",
    importValueEn: "₫185M",
    importValueZh: "1.85亿",
    importOrdersVi: "22 đơn",
    importOrdersEn: "22 orders",
    importOrdersZh: "22 单",
    growthPct: -14,
  },
  {
    id: "ext-nha-thuoc",
    nameVi: "Nhà thuốc",
    nameEn: "Pharmacy",
    nameZh: "药店",
    importValueVi: "168 tr",
    importValueEn: "₫168M",
    importValueZh: "1.68亿",
    importOrdersVi: "26 đơn",
    importOrdersEn: "26 orders",
    importOrdersZh: "26 单",
    growthPct: -11,
  },
  {
    id: "ext-kenh-ecommerce",
    nameVi: "Kênh E-commerce",
    nameEn: "E-commerce",
    nameZh: "电商",
    importValueVi: "142 tr",
    importValueEn: "₫142M",
    importValueZh: "1.42亿",
    importOrdersVi: "31 đơn",
    importOrdersEn: "31 orders",
    importOrdersZh: "31 单",
    growthPct: -8,
  },
  {
    id: "ext-social",
    nameVi: "Kênh Social media",
    nameEn: "Social media",
    nameZh: "社交媒体",
    importValueVi: "128 tr",
    importValueEn: "₫128M",
    importValueZh: "1.28亿",
    importOrdersVi: "34 đơn",
    importOrdersEn: "34 orders",
    importOrdersZh: "34 单",
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
    nameVi: "Thuốc YHCT - ETC (Ethical Channels) · BSV-4412",
    nameEn: "TCM Medicine - ETC (Ethical Channels) · BSV-4412",
    nameZh: "中成药 ETC（专业渠道） · BSV-4412",
    revenueVi: "320tr",
    revenueEn: "₫320M",
    revenueZh: "3200万",
    customers: 8420,
  },
  {
    id: "top-2",
    nameVi: "Cafe · BSV-9302",
    nameEn: "Coffee · BSV-9302",
    nameZh: "咖啡 · BSV-9302",
    revenueVi: "248tr",
    revenueEn: "₫248M",
    revenueZh: "2480万",
    customers: 6150,
  },
  {
    id: "top-3",
    nameVi: "Vị thuốc YHCT · BSV-2281",
    nameEn: "TCM Medicinal Ingredients · BSV-2281",
    nameZh: "中药材 · BSV-2281",
    revenueVi: "186tr",
    revenueEn: "₫186M",
    revenueZh: "1860万",
    customers: 5280,
  },
  {
    id: "top-4",
    nameVi: "Dược liệu · BSV-9033",
    nameEn: "Medicinal herbs · BSV-9033",
    nameZh: "药材 · BSV-9033",
    revenueVi: "142tr",
    revenueEn: "₫142M",
    revenueZh: "1420万",
    customers: 3910,
  },
  {
    id: "top-5",
    nameVi: "Trái cây · BSV-9301",
    nameEn: "Fruit products · BSV-9301",
    nameZh: "水果制品 · BSV-9301",
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
    nameVi: "Yogi Food · BSV-6108",
    nameEn: "Yogi Food · BSV-6108",
    nameZh: "Yogi Food · BSV-6108",
    revenueVi: "8tr",
    revenueEn: "₫8M",
    revenueZh: "80万",
    customers: 42,
  },
  {
    id: "dead-2",
    nameVi: "Thượng Sơn Trà · BSV-3344",
    nameEn: "Thuong Son Tra · BSV-3344",
    nameZh: "上山茶 · BSV-3344",
    revenueVi: "11tr",
    revenueEn: "₫11M",
    revenueZh: "110万",
    customers: 58,
  },
  {
    id: "dead-3",
    nameVi: "Hương dược · BSV-7022",
    nameEn: "Medicinal aromatics · BSV-7022",
    nameZh: "香药 · BSV-7022",
    revenueVi: "6tr",
    revenueEn: "₫6M",
    revenueZh: "60万",
    customers: 31,
  },
  {
    id: "dead-4",
    nameVi: "Gia vị · BSV-1199",
    nameEn: "Herbal spices · BSV-1199",
    nameZh: "药膳香料 · BSV-1199",
    revenueVi: "5tr",
    revenueEn: "₫5M",
    revenueZh: "50万",
    customers: 24,
  },
  {
    id: "dead-5",
    nameVi: "Snacks dinh dưỡng · BSV-8801",
    nameEn: "Nutritional snacks · BSV-8801",
    nameZh: "营养零食 · BSV-8801",
    revenueVi: "9tr",
    revenueEn: "₫9M",
    revenueZh: "90万",
    customers: 37,
  },
];

function mapStores(locale: Locale, seeds: StoreSeed[]): StorePerformanceRow[] {
  return seeds.map((s) => ({
    id: s.storeCode,
    storeCode: s.storeCode,
    revenue:
      locale === "zh" ? s.revenueZh : locale === "en" ? s.revenueEn : s.revenueVi,
    cost: locale === "zh" ? s.costZh : locale === "en" ? s.costEn : s.costVi,
    growthPct: s.growthPct,
    growth: formatGrowth(s.growthPct),
  }));
}

function mapCompanyImports(
  locale: Locale,
  seeds: CompanyImportSeed[],
): StorePerformanceRow[] {
  return seeds.map((s) => ({
    id: s.id,
    storeCode:
      locale === "zh" ? s.nameZh : locale === "en" ? s.nameEn : s.nameVi,
    revenue:
      locale === "zh"
        ? s.importValueZh
        : locale === "en"
          ? s.importValueEn
          : s.importValueVi,
    cost:
      locale === "zh"
        ? s.importOrdersZh
        : locale === "en"
          ? s.importOrdersEn
          : s.importOrdersVi,
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

export function buildSubsidiaryStorePerformance(locale: Locale): StorePerformanceData {
  return {
    variant: "stores",
    topStores: mapStores(locale, TOP_STORES),
    worstStores: mapStores(locale, WORST_STORES),
  };
}

export function buildHoldingImportPerformance(locale: Locale): StorePerformanceData {
  return {
    variant: "imports",
    topImportCompanies: mapCompanyImports(locale, TOP_IMPORT_COMPANIES),
    lowImportCompanies: mapCompanyImports(locale, LOW_IMPORT_COMPANIES),
  };
}

export function buildProductPerformance(locale: Locale): ProductPerformanceData {
  return {
    topProducts: mapProducts(locale, TOP_PRODUCTS),
    deadProducts: mapProducts(locale, DEAD_PRODUCTS),
  };
}
