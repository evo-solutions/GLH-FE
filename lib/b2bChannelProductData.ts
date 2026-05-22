import {
  B2B_PRODUCT_LINES,
  getB2BProductLinesForSegment,
  productLineLabel,
  type B2BProductLineKey,
  type B2BCustomerSegmentKey,
} from "@/lib/b2bCustomerCatalog";
import type { ProductListItem, ProductSalesStatus } from "@/types/product";

const LINE_SKUS: Partial<
  Record<B2BProductLineKey, { nameVi: string; nameEn: string; nameZh: string }[]>
> = {
  "tcm-otc": [
    { nameVi: "An cung ngưu hoàng · OTC", nameEn: "Angong Niuhuang · OTC", nameZh: "安宫牛黄 OTC" },
    { nameVi: "Bổ huyết hoàn · OTC", nameEn: "Blood tonic pills · OTC", nameZh: "补血丸 OTC" },
    { nameVi: "Hoàn tam sao · OTC", nameEn: "Tam sao pills · OTC", nameZh: "三星丸 OTC" },
  ],
  "tcm-etc": [
    { nameVi: "Đại hoàn · ETC", nameEn: "Dai hoan · ETC", nameZh: "大丸 ETC" },
    { nameVi: "Thang bổ trung ích khí · ETC", nameEn: "Bu zhong yi qi · ETC", nameZh: "补中益气汤 ETC" },
  ],
  "herb-ingredient": [
    { nameVi: "Đương quy thang", nameEn: "Angelica slices", nameZh: "当归片" },
    { nameVi: "Bạch thược khô", nameEn: "White peony root", nameZh: "白芍" },
    { nameVi: "Hoàng kỳ thang", nameEn: "Astragalus slices", nameZh: "黄芪片" },
  ],
  "medicinal-material": [
    { nameVi: "Ngưu tất thang", nameEn: "Achyranthes root", nameZh: "牛膝" },
    { nameVi: "Đẳng sâm khô", nameEn: "Codonopsis", nameZh: "党参" },
    { nameVi: "Tam thất bột", nameEn: "Panax notoginseng powder", nameZh: "三七粉" },
  ],
  "medicinal-tea": [
    { nameVi: "Trà dược an thần", nameEn: "Calming medicinal tea", nameZh: "安神药茶" },
    { nameVi: "Trà dược bổ khí", nameEn: "Qi tonic tea", nameZh: "补气药茶" },
  ],
  "medicinal-diet": [
    { nameVi: "Y thực cao năng", nameEn: "Medicinal diet paste", nameZh: "药食膏" },
    { nameVi: "Súp dưỡng sinh", nameEn: "Wellness soup base", nameZh: "养生汤料" },
  ],
  "yogi-food": [
    { nameVi: "Yogi Food · Granola dược thảo", nameEn: "Yogi Food · Herbal granola", nameZh: "Yogi Food 草本麦片" },
    { nameVi: "Yogi Food · Sữa hạt", nameEn: "Yogi Food · Nut milk", nameZh: "Yogi Food 坚果奶" },
  ],
  "thuong-son-tra": [
    { nameVi: "Thượng Sơn Trà · Shan Tuyết", nameEn: "Thuong Son Tra · Snow tea", nameZh: "上山茶 · 雪茶" },
    { nameVi: "Thượng Sơn Trà · Oolong", nameEn: "Thuong Son Tra · Oolong", nameZh: "上山茶 · 乌龙" },
  ],
  spices: [
    { nameVi: "Gia vị dược thảo mix", nameEn: "Herbal spice mix", nameZh: "草本香料混合" },
    { nameVi: "Muối dược liệu", nameEn: "Medicinal salt blend", nameZh: "药盐" },
  ],
  "nutrition-snacks": [
    { nameVi: "Snacks dinh dưỡng · Cao năng", nameEn: "Nutrition snacks · Energy bar", nameZh: "营养零食 · 能量棒" },
    { nameVi: "Snacks dinh dưỡng · Granola", nameEn: "Nutrition snacks · Granola", nameZh: "营养零食 · 麦片" },
  ],
  "medicinal-aroma": [
    { nameVi: "Hương dược · Túi thơm", nameEn: "Medicinal aroma · Sachet", nameZh: "药香 · 香包" },
    { nameVi: "Tinh dầu thảo dược", nameEn: "Herbal essential oil", nameZh: "草本精油" },
  ],
  fruit: [
    { nameVi: "Sấy dẻo sơn tra", nameEn: "Dried hawthorn", nameZh: "山楂干" },
    { nameVi: "Mơ vàng sấy", nameEn: "Dried golden apricot", nameZh: "金黄杏干" },
  ],
  coffee: [
    { nameVi: "Cafe dược liệu Arabica", nameEn: "Herbal Arabica coffee", nameZh: "草本阿拉比卡咖啡" },
    { nameVi: "Cafe hòa tan dược thảo", nameEn: "Instant herbal coffee", nameZh: "草本速溶咖啡" },
  ],
};

const STATUS_ROTATION: ProductSalesStatus[] = ["hot", "stable", "new", "stable"];

function pickName(
  sku: { nameVi: string; nameEn: string; nameZh: string },
  locale: "vi" | "en" | "zh"
): string {
  if (locale === "en") return sku.nameEn;
  if (locale === "zh") return sku.nameZh;
  return sku.nameVi;
}

function buildSku(
  segmentKey: B2BCustomerSegmentKey,
  lineKey: B2BProductLineKey,
  productCode: string,
  skuIndex: number,
  locale: "vi" | "en" | "zh"
): ProductListItem {
  const skus = LINE_SKUS[lineKey] ?? [
    { nameVi: "SKU mẫu", nameEn: "Sample SKU", nameZh: "样品 SKU" },
  ];
  const sku = skus[skuIndex % skus.length];
  const status = STATUS_ROTATION[skuIndex % STATUS_ROTATION.length];
  const units = 120 + skuIndex * 37 + segmentKey.length * 11;
  const statusLabels = {
    vi: { hot: "Bán mạnh", stable: "Ổn định", new: "Mới", slow: "Chậm", out: "Hết" },
    en: { hot: "High demand", stable: "Stable", new: "New", slow: "Slow", out: "Out" },
    zh: { hot: "热销", stable: "稳定", new: "新品", slow: "滞销", out: "缺货" },
  };
  const growth = status === "hot" ? "+18%" : status === "new" ? "+32%" : "+6%";

  return {
    productCode,
    name: pickName(sku, locale),
    category: productLineLabel(B2B_PRODUCT_LINES[lineKey], locale),
    brand: "Bông Sen Vàng",
    sellPrice: `₫${(42 + skuIndex * 8) * 1000}/đv`,
    importPrice: `₫${(28 + skuIndex * 5) * 1000}/đv`,
    status,
    statusLabel: statusLabels[locale][status],
    monthlyUnits: units,
    monthlyRevenue: `₫${Math.round(units * 0.042)} tr`,
    growth,
    growthUp: true,
    totalStock: units * 4,
    locationCount: 1,
    avgDailyUnits: Math.round(units / 30),
    b2bProductLineKey: lineKey,
  };
}

export function getB2bChannelProductList(
  segmentKey: B2BCustomerSegmentKey,
  locale: "vi" | "en" | "zh"
): ProductListItem[] {
  const lines = getB2BProductLinesForSegment(segmentKey);
  const products: ProductListItem[] = [];

  lines.forEach((line, lineIdx) => {
    const skuCount = line.key === "medicinal-material" || line.key === "tcm-etc" ? 3 : 2;
    for (let i = 0; i < skuCount; i++) {
      const code = `${line.productCode}-${segmentKey.slice(0, 4).toUpperCase()}-${lineIdx + 1}${i + 1}`;
      products.push(buildSku(segmentKey, line.key, code, lineIdx + i, locale));
    }
  });

  return products;
}
