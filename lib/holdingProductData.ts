import { B2B_HOLDING_PRODUCT_CODES } from "@/lib/businessModelProductMap";
import type { ProductListItem } from "@/types/product";

const holdingProductsVi: ProductListItem[] = [
  {
    productCode: "BSV-RM-001",
    name: "Ngưu tất thang (nguyên liệu)",
    category: "Dược liệu",
    brand: "Bông Sen Vàng",
    sellPrice: "₫18,000/kg",
    importPrice: "₫12,000/kg",
    status: "hot",
    statusLabel: "Xuất nhiều",
    monthlyUnits: 2400,
    monthlyRevenue: "₫43.2 tr",
    growth: "+14%",
    growthUp: true,
    totalStock: 8200,
    locationCount: 1,
    avgDailyUnits: 80,
  },
  {
    productCode: "BSV-RM-002",
    name: "Đương quy khô",
    category: "Dược liệu",
    brand: "Bông Sen Vàng",
    sellPrice: "₫24,000/kg",
    importPrice: "₫16,000/kg",
    status: "hot",
    statusLabel: "Nhu cầu cao",
    monthlyUnits: 1800,
    monthlyRevenue: "₫43.2 tr",
    growth: "+9%",
    growthUp: true,
    totalStock: 5600,
    locationCount: 1,
    avgDailyUnits: 60,
  },
  {
    productCode: "BSV-RM-003",
    name: "Bạch thược khô",
    category: "Dược liệu",
    brand: "Bông Sen Vàng",
    sellPrice: "₫42,000/kg",
    importPrice: "₫28,000/kg",
    status: "stable",
    statusLabel: "Ổn định",
    monthlyUnits: 920,
    monthlyRevenue: "₫38.6 tr",
    growth: "+2%",
    growthUp: true,
    totalStock: 3100,
    locationCount: 1,
    avgDailyUnits: 31,
  },
  {
    productCode: "BSV-RM-004",
    name: "Hoàng kỳ thang",
    category: "Dược liệu",
    brand: "Bông Sen Vàng",
    sellPrice: "₫48,000/kg",
    importPrice: "₫32,000/kg",
    status: "stable",
    statusLabel: "Ổn định",
    monthlyUnits: 760,
    monthlyRevenue: "₫36.5 tr",
    growth: "+5%",
    growthUp: true,
    totalStock: 2800,
    locationCount: 1,
    avgDailyUnits: 25,
  },
  {
    productCode: "BSV-RM-005",
    name: "Đẳng sâm khô",
    category: "Dược liệu",
    brand: "Bông Sen Vàng",
    sellPrice: "₫103,000/kg",
    importPrice: "₫72,000/kg",
    status: "hot",
    statusLabel: "Bán B2B mạnh",
    monthlyUnits: 420,
    monthlyRevenue: "₫43.3 tr",
    growth: "+22%",
    growthUp: true,
    totalStock: 1200,
    locationCount: 1,
    avgDailyUnits: 14,
  },
  {
    productCode: "BSV-RM-006",
    name: "Tam thất bột",
    category: "Dược liệu",
    brand: "Bông Sen Vàng",
    sellPrice: "₫86,000/kg",
    importPrice: "₫58,000/kg",
    status: "new",
    statusLabel: "Mới",
    monthlyUnits: 180,
    monthlyRevenue: "₫15.5 tr",
    growth: "+40%",
    growthUp: true,
    totalStock: 900,
    locationCount: 1,
    avgDailyUnits: 6,
  },
];

export function getHoldingProductList(locale: "vi" | "en" | "zh"): ProductListItem[] {
  if (locale === "vi") return holdingProductsVi;
  return holdingProductsVi.map((p) => ({
    ...p,
    name:
      locale === "en"
        ? p.name
            .replace("Ngưu tất", "Achyranthes")
            .replace("Đương quy", "Angelica")
            .replace("Bạch thược", "White peony")
            .replace("Hoàng kỳ", "Astragalus")
            .replace("Đẳng sâm", "Codonopsis")
            .replace("Tam thất", "Panax notoginseng")
        : p.name,
    category: locale === "zh" ? "药材" : locale === "en" ? "Herbal material" : p.category,
    statusLabel: p.statusLabel,
  }));
}

export function holdingProductCodes(): string[] {
  return [...B2B_HOLDING_PRODUCT_CODES];
}
