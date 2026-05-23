/** Một dòng sản phẩm mock — tên, nhóm, thương hiệu (vi / en / zh). */
export interface ProductCatalogEntry {
  productCode: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  categoryVi: string;
  categoryEn: string;
  categoryZh: string;
  brand: string;
}

export const PRODUCT_CATALOG: ProductCatalogEntry[] = [
  {
    productCode: "BSV-COV19",
    nameVi: "Thuốc YHCT - OTC (Over The Counter)",
    nameEn: "TCM Medicine - OTC (Over The Counter)",
    nameZh: "中成药 OTC（非处方药）",
    categoryVi: "Thuốc YHCT - OTC",
    categoryEn: "TCM - OTC",
    categoryZh: "中成药 OTC",
    brand: "Bông Sen Vàng",
  },
  {
    productCode: "BSV-4412",
    nameVi: "Thuốc YHCT - ETC (Ethical Channels)",
    nameEn: "TCM Medicine - ETC (Ethical Channels)",
    nameZh: "中成药 ETC（专业渠道）",
    categoryVi: "Thuốc YHCT - ETC",
    categoryEn: "TCM - ETC",
    categoryZh: "中成药 ETC",
    brand: "Bông Sen Vàng",
  },
  {
    productCode: "BSV-2281",
    nameVi: "Vị thuốc YHCT",
    nameEn: "TCM Medicinal Ingredients",
    nameZh: "中药材",
    categoryVi: "Vị thuốc",
    categoryEn: "Medicinal ingredients",
    categoryZh: "中药材",
    brand: "Bông Sen Vàng",
  },
  {
    productCode: "BSV-9033",
    nameVi: "Dược liệu",
    nameEn: "Medicinal herbs",
    nameZh: "药材",
    categoryVi: "Dược liệu",
    categoryEn: "Medicinal herbs",
    categoryZh: "药材",
    brand: "Bông Sen Vàng",
  },
  {
    productCode: "BSV-7710",
    nameVi: "Trà dược",
    nameEn: "Medicinal tea",
    nameZh: "药茶",
    categoryVi: "Trà dược",
    categoryEn: "Medicinal tea",
    categoryZh: "药茶",
    brand: "Bông Sen Vàng",
  },
  {
    productCode: "BSV-5520",
    nameVi: "Y thực trị liệu",
    nameEn: "Medicinal food therapy",
    nameZh: "药食同源",
    categoryVi: "Y thực trị liệu",
    categoryEn: "Food therapy",
    categoryZh: "药食同源",
    brand: "Bông Sen Vàng",
  },
  {
    productCode: "BSV-6108",
    nameVi: "Yogi Food",
    nameEn: "Yogi Food",
    nameZh: "Yogi Food",
    categoryVi: "Yogi Food",
    categoryEn: "Yogi Food",
    categoryZh: "Yogi Food",
    brand: "Yogi Food",
  },
  {
    productCode: "BSV-3344",
    nameVi: "Thượng Sơn Trà",
    nameEn: "Thuong Son Tra",
    nameZh: "上山茶",
    categoryVi: "Thượng Sơn Trà",
    categoryEn: "Thuong Son Tra",
    categoryZh: "上山茶",
    brand: "Thượng Sơn Trà",
  },
  {
    productCode: "BSV-1199",
    nameVi: "Gia vị",
    nameEn: "Herbal spices",
    nameZh: "药膳香料",
    categoryVi: "Gia vị",
    categoryEn: "Spices",
    categoryZh: "香料",
    brand: "Thảo dược di sản",
  },
  {
    productCode: "BSV-8801",
    nameVi: "Snacks dinh dưỡng",
    nameEn: "Nutritional snacks",
    nameZh: "营养零食",
    categoryVi: "Snacks dinh dưỡng",
    categoryEn: "Nutritional snacks",
    categoryZh: "营养零食",
    brand: "Yogi Food",
  },
  {
    productCode: "BSV-7022",
    nameVi: "Hương dược",
    nameEn: "Medicinal aromatics",
    nameZh: "香药",
    categoryVi: "Hương dược",
    categoryEn: "Medicinal aromatics",
    categoryZh: "香药",
    brand: "Bông Sen Vàng",
  },
  {
    productCode: "BSV-9301",
    nameVi: "Trái cây",
    nameEn: "Fruit products",
    nameZh: "水果制品",
    categoryVi: "Trái cây",
    categoryEn: "Fruit",
    categoryZh: "水果",
    brand: "Yogi Food",
  },
  {
    productCode: "BSV-9302",
    nameVi: "Cafe",
    nameEn: "Coffee",
    nameZh: "咖啡",
    categoryVi: "Cafe",
    categoryEn: "Coffee",
    categoryZh: "咖啡",
    brand: "Thượng Sơn Trà",
  },
  {
    productCode: "BSV-9303",
    nameVi: "Trà dược · Gừng mật ong",
    nameEn: "Medicinal tea · Ginger honey",
    nameZh: "药茶 · 姜蜜",
    categoryVi: "Trà dược",
    categoryEn: "Medicinal tea",
    categoryZh: "药茶",
    brand: "Thượng Sơn Trà",
  },
];

const CATALOG_MAP = new Map(PRODUCT_CATALOG.map((e) => [e.productCode, e]));

/** Thứ tự hiển thị danh sách sản phẩm mock. */
export const PRODUCT_CODES = PRODUCT_CATALOG.map((e) => e.productCode);

export type ProductCatalogLocale = "vi" | "en" | "zh";

export function getProductCatalogEntry(productCode: string): ProductCatalogEntry | undefined {
  return CATALOG_MAP.get(productCode);
}

/** @deprecated Chỉ dùng nội bộ tương thích — luôn tra cứu theo mã SKU. */
export function productLineIndex(productCode: string): number {
  const idx = PRODUCT_CODES.indexOf(productCode);
  return idx >= 0 ? idx : 0;
}

export function productDisplayName(
  productCode: string,
  locale: ProductCatalogLocale,
): string {
  const entry = getProductCatalogEntry(productCode);
  if (!entry) return productCode;
  if (locale === "en") return entry.nameEn;
  if (locale === "zh") return entry.nameZh;
  return entry.nameVi;
}

export function productDisplayCategory(
  productCode: string,
  locale: ProductCatalogLocale,
): string {
  const entry = getProductCatalogEntry(productCode);
  if (!entry) return productCode;
  if (locale === "en") return entry.categoryEn;
  if (locale === "zh") return entry.categoryZh;
  return entry.categoryVi;
}

export function productDisplayBrand(productCode: string): string {
  return getProductCatalogEntry(productCode)?.brand ?? "Bông Sen Vàng";
}
