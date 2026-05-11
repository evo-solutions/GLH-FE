import { locationIndex } from "@/lib/locationRegistry";
import type { ProductRevenueChartData } from "@/types/dashboard";

type Locale = "vi" | "en" | "zh";

interface ProductRevenueSeed {
  productCode: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  endBillions: number;
  growthUp: boolean;
  growthPct: number;
}

const PRODUCT_REVENUE_SEEDS: ProductRevenueSeed[] = [
  {
    productCode: "BSV-4412",
    nameVi: "Omega-3 Premium 60v",
    nameEn: "Omega-3 Premium 60ct",
    nameZh: "Omega-3 优质 60粒",
    endBillions: 0.353,
    growthUp: true,
    growthPct: 12.4,
  },
  {
    productCode: "BSV-7710",
    nameVi: "Men vi sinh 30g",
    nameEn: "Probiotic 30g",
    nameZh: "益生菌 30g",
    endBillions: 0.151,
    growthUp: true,
    growthPct: 9.6,
  },
  {
    productCode: "BSV-8801",
    nameVi: "Magnesium Glycinate",
    nameEn: "Magnesium Glycinate",
    nameZh: "甘氨酸镁",
    endBillions: 0.124,
    growthUp: true,
    growthPct: 15.1,
  },
  {
    productCode: "BSV-2281",
    nameVi: "Vitamin C 1000mg",
    nameEn: "Vitamin C 1000mg",
    nameZh: "维生素 C 1000mg",
    endBillions: 0.115,
    growthUp: true,
    growthPct: 3.1,
  },
  {
    productCode: "BSV-9033",
    nameVi: "Collagen Peptide",
    nameEn: "Collagen Peptide",
    nameZh: "胶原蛋白肽",
    endBillions: 0.104,
    growthUp: false,
    growthPct: 8.2,
  },
  {
    productCode: "BSV-5520",
    nameVi: "Kẽm + Vitamin D3",
    nameEn: "Zinc + Vitamin D3",
    nameZh: "锌 + 维生素 D3",
    endBillions: 0.097,
    growthUp: true,
    growthPct: 1.8,
  },
  {
    productCode: "BSV-COV19",
    nameVi: "Vaccine Covid Vietnam",
    nameEn: "Covid Vaccine Vietnam",
    nameZh: "越南新冠疫苗",
    endBillions: 0.034,
    growthUp: true,
    growthPct: 18.2,
  },
  {
    productCode: "BSV-1199",
    nameVi: "Dầu gội thảo dược",
    nameEn: "Herbal shampoo",
    nameZh: "草本洗发水",
    endBillions: 0.057,
    growthUp: true,
    growthPct: 4.2,
  },
  {
    productCode: "BSV-6108",
    nameVi: "Glucosamine 120v",
    nameEn: "Glucosamine 120ct",
    nameZh: "氨基葡萄糖 120粒",
    endBillions: 0.054,
    growthUp: false,
    growthPct: 5.4,
  },
  {
    productCode: "BSV-3344",
    nameVi: "Sữa rửa Collagen",
    nameEn: "Collagen face wash",
    nameZh: "胶原洁面乳",
    endBillions: 0.044,
    growthUp: true,
    growthPct: 24.0,
  },
  {
    productCode: "BSV-7022",
    nameVi: "Vitamin B Complex",
    nameEn: "Vitamin B Complex",
    nameZh: "复合维生素 B",
    endBillions: 0.012,
    growthUp: false,
    growthPct: 22.0,
  },
];

function monthLabels(locale: Locale): string[] {
  if (locale === "en") {
    return ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
  }
  return ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
}

function locationScale(locationId?: string): number {
  if (!locationId) return 1;
  const idx = locationIndex(locationId);
  return 0.42 + (idx % 9) * 0.065;
}

function trendSeries(end: number, months: number, growthUp: boolean): number[] {
  if (end <= 0) {
    return Array.from({ length: months }, (_, i) =>
      i < months - 2 ? 0.028 : i === months - 2 ? 0.018 : 0.004
    );
  }
  const start = growthUp ? end * 0.68 : end * 1.22;
  return Array.from({ length: months }, (_, i) => {
    const t = months <= 1 ? 1 : i / (months - 1);
    const v = growthUp ? start + (end - start) * t : start - (start - end) * t;
    return Math.round(v * 1000) / 1000;
  });
}

function productName(seed: ProductRevenueSeed, locale: Locale): string {
  if (locale === "zh") return seed.nameZh;
  if (locale === "en") return seed.nameEn;
  return seed.nameVi;
}

/** Doanh thu theo SP — toàn hệ thống hoặc theo một cơ sở (scale theo locationId). */
export function buildProductRevenueChart(
  locale: Locale,
  locationId?: string
): ProductRevenueChartData {
  const labels = monthLabels(locale);
  const scale = locationScale(locationId);

  const products = PRODUCT_REVENUE_SEEDS.map((seed) => ({
    productCode: seed.productCode,
    name: productName(seed, locale),
    growthUp: seed.growthUp,
    growthPct: seed.growthPct,
    values: trendSeries(seed.endBillions * scale, labels.length, seed.growthUp),
  })).sort((a, b) => (b.values.at(-1) ?? 0) - (a.values.at(-1) ?? 0));

  return { labels, products };
}
