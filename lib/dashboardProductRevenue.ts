import { productDisplayName } from "@/lib/productCatalog";
import { locationIndex } from "@/lib/locationRegistry";
import type { ProductRevenueChartData } from "@/types/dashboard";

type Locale = "vi" | "en" | "zh";

interface ProductRevenueSeed {
  productCode: string;
  endBillions: number;
  growthUp: boolean;
  growthPct: number;
}

const PRODUCT_REVENUE_SEEDS: ProductRevenueSeed[] = [
  { productCode: "BSV-4412", endBillions: 0.353, growthUp: true, growthPct: 12.4 },
  { productCode: "BSV-7710", endBillions: 0.151, growthUp: true, growthPct: 9.6 },
  { productCode: "BSV-8801", endBillions: 0.124, growthUp: true, growthPct: 15.1 },
  { productCode: "BSV-2281", endBillions: 0.115, growthUp: true, growthPct: 3.1 },
  { productCode: "BSV-9033", endBillions: 0.104, growthUp: false, growthPct: 8.2 },
  { productCode: "BSV-5520", endBillions: 0.097, growthUp: true, growthPct: 1.8 },
  { productCode: "BSV-COV19", endBillions: 0.034, growthUp: true, growthPct: 18.2 },
  { productCode: "BSV-1199", endBillions: 0.057, growthUp: true, growthPct: 4.2 },
  { productCode: "BSV-7022", endBillions: 0.024, growthUp: true, growthPct: 6.8 },
  { productCode: "BSV-9301", endBillions: 0.064, growthUp: true, growthPct: 21.3 },
  { productCode: "BSV-9302", endBillions: 0.085, growthUp: true, growthPct: 14.7 },
  { productCode: "BSV-9303", endBillions: 0.04, growthUp: true, growthPct: 32.5 },
  { productCode: "BSV-6108", endBillions: 0.048, growthUp: false, growthPct: 5.4 },
  { productCode: "BSV-3344", endBillions: 0.038, growthUp: true, growthPct: 24.0 },
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
  return productDisplayName(seed.productCode, locale);
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
