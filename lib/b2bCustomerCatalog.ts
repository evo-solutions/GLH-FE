/**
 * Phân khúc khách hàng B (Bông Sen Vàng Holding) và danh mục hàng được phép mua.
 */

export type B2BProductLineKey =
  | "tcm-otc"
  | "tcm-etc"
  | "herb-ingredient"
  | "medicinal-material"
  | "medicinal-tea"
  | "medicinal-diet"
  | "yogi-food"
  | "thuong-son-tra"
  | "spices"
  | "nutrition-snacks"
  | "medicinal-aroma"
  | "fruit"
  | "coffee";

export type B2BCustomerSegmentKey =
  | "hospital-tcm"
  | "clinic-tcm"
  | "pharmacy"
  | "herbal-trading"
  | "pharma-manufacturer"
  | "cosmetics-manufacturer"
  | "distributor-mt"
  | "distributor-mbaby"
  | "distributor-gt"
  | "ecommerce"
  | "social-media"
  | "import"
  | "export"
  | "brand-marketing";

export interface B2BProductLine {
  key: B2BProductLineKey;
  productCode: string;
  labelVi: string;
  labelEn: string;
  labelZh: string;
  unitPriceVi: string;
}

export interface B2BCustomerSegment {
  key: B2BCustomerSegmentKey;
  labelVi: string;
  labelEn: string;
  labelZh: string;
  productLineKeys: B2BProductLineKey[];
  /** Ghi chú kênh (phân phối MT / Mẹ Bé / GT, …) */
  channelNoteVi?: string;
  channelNoteEn?: string;
  channelNoteZh?: string;
}

export const B2B_PRODUCT_LINES: Record<B2BProductLineKey, B2BProductLine> = {
  "tcm-otc": {
    key: "tcm-otc",
    productCode: "B2B-TCM-OTC",
    labelVi: "Thuốc YHCT - OTC (Over The Counter)",
    labelEn: "TCM medicine - OTC",
    labelZh: "中成药 - OTC",
    unitPriceVi: "₫85,000/hộp",
  },
  "tcm-etc": {
    key: "tcm-etc",
    productCode: "B2B-TCM-ETC",
    labelVi: "Thuốc YHCT - ETC (Ethical Channels)",
    labelEn: "TCM medicine - ETC",
    labelZh: "中成药 - ETC",
    unitPriceVi: "₫120,000/hộp",
  },
  "herb-ingredient": {
    key: "herb-ingredient",
    productCode: "B2B-HERB-ING",
    labelVi: "Vị thuốc YHCT",
    labelEn: "TCM herb ingredients",
    labelZh: "中药饮片",
    unitPriceVi: "₫45,000/kg",
  },
  "medicinal-material": {
    key: "medicinal-material",
    productCode: "B2B-RM-001",
    labelVi: "Dược liệu",
    labelEn: "Medicinal materials",
    labelZh: "药材原料",
    unitPriceVi: "₫18,000/kg",
  },
  "medicinal-tea": {
    key: "medicinal-tea",
    productCode: "B2B-TEA-001",
    labelVi: "Trà dược",
    labelEn: "Medicinal tea",
    labelZh: "药茶",
    unitPriceVi: "₫65,000/hộp",
  },
  "medicinal-diet": {
    key: "medicinal-diet",
    productCode: "B2B-DIET-001",
    labelVi: "Y thực trị liệu",
    labelEn: "Medicinal diet therapy",
    labelZh: "药食理疗",
    unitPriceVi: "₫72,000/hộp",
  },
  "yogi-food": {
    key: "yogi-food",
    productCode: "B2B-YOGI-001",
    labelVi: "Yogi Food",
    labelEn: "Yogi Food",
    labelZh: "Yogi Food",
    unitPriceVi: "₫48,000/hộp",
  },
  "thuong-son-tra": {
    key: "thuong-son-tra",
    productCode: "B2B-TST-001",
    labelVi: "Thượng Sơn Trà",
    labelEn: "Thuong Son Tra",
    labelZh: "上山茶",
    unitPriceVi: "₫95,000/hộp",
  },
  spices: {
    key: "spices",
    productCode: "B2B-SPICE-001",
    labelVi: "Gia vị",
    labelEn: "Spices",
    labelZh: "香料",
    unitPriceVi: "₫32,000/hộp",
  },
  "nutrition-snacks": {
    key: "nutrition-snacks",
    productCode: "B2B-SNACK-001",
    labelVi: "Snacks dinh dưỡng",
    labelEn: "Nutrition snacks",
    labelZh: "营养零食",
    unitPriceVi: "₫28,000/hộp",
  },
  "medicinal-aroma": {
    key: "medicinal-aroma",
    productCode: "B2B-AROMA-001",
    labelVi: "Hương dược",
    labelEn: "Medicinal aroma",
    labelZh: "药香",
    unitPriceVi: "₫55,000/hộp",
  },
  fruit: {
    key: "fruit",
    productCode: "B2B-FRUIT-001",
    labelVi: "Trái cây",
    labelEn: "Fruit",
    labelZh: "水果",
    unitPriceVi: "₫42,000/kg",
  },
  coffee: {
    key: "coffee",
    productCode: "B2B-CAFE-001",
    labelVi: "Cafe",
    labelEn: "Coffee",
    labelZh: "咖啡",
    unitPriceVi: "₫68,000/kg",
  },
};

export const B2B_CUSTOMER_SEGMENTS: B2BCustomerSegment[] = [
  {
    key: "hospital-tcm",
    labelVi: "BỆNH VIỆN YHCT",
    labelEn: "TCM hospital",
    labelZh: "中医医院",
    productLineKeys: [
      "tcm-otc",
      "tcm-etc",
      "herb-ingredient",
      "medicinal-material",
      "medicinal-tea",
      "medicinal-diet",
    ],
  },
  {
    key: "clinic-tcm",
    labelVi: "PHÒNG CHẨN TRỊ YHCT",
    labelEn: "TCM diagnosis clinic",
    labelZh: "中医诊疗室",
    productLineKeys: [
      "tcm-etc",
      "tcm-otc",
      "herb-ingredient",
      "medicinal-material",
      "medicinal-tea",
      "medicinal-diet",
    ],
  },
  {
    key: "pharmacy",
    labelVi: "NHÀ THUỐC",
    labelEn: "Pharmacy",
    labelZh: "药店",
    productLineKeys: ["tcm-etc", "tcm-otc", "medicinal-tea", "medicinal-diet"],
  },
  {
    key: "herbal-trading",
    labelVi: "DOANH NGHIỆP KINH DOANH DƯỢC LIỆU",
    labelEn: "Herbal trading enterprise",
    labelZh: "药材经营企业",
    productLineKeys: ["tcm-otc", "herb-ingredient", "medicinal-material", "medicinal-tea"],
  },
  {
    key: "pharma-manufacturer",
    labelVi: "DOANH NGHIỆP SẢN XUẤT DƯỢC, THỰC PHẨM CHỨC NĂNG, THỰC PHẨM BỔ SUNG...",
    labelEn: "Pharma & supplement manufacturer",
    labelZh: "药品与保健食品生产企业",
    productLineKeys: [
      "tcm-etc",
      "tcm-otc",
      "herb-ingredient",
      "medicinal-material",
      "medicinal-tea",
    ],
  },
  {
    key: "cosmetics-manufacturer",
    labelVi: "DOANH NGHIỆP SẢN XUẤT HOÁ MỸ PHẨM & HÀNG TIÊU DÙNG",
    labelEn: "Cosmetics & consumer goods manufacturer",
    labelZh: "化妆品与消费品生产企业",
    productLineKeys: ["herb-ingredient", "medicinal-material"],
  },
  {
    key: "distributor-mt",
    labelVi: "NHÀ PHÂN PHỐI HÀNG TIÊU DÙNG",
    labelEn: "Consumer goods distributor",
    labelZh: "消费品分销商",
    channelNoteVi: "Kênh Siêu thị MT (Modern Trade)",
    channelNoteEn: "Modern Trade (MT)",
    channelNoteZh: "现代渠道 MT",
    productLineKeys: [
      "medicinal-tea",
      "yogi-food",
      "thuong-son-tra",
      "spices",
      "nutrition-snacks",
      "medicinal-aroma",
    ],
  },
  {
    key: "distributor-mbaby",
    labelVi: "NHÀ PHÂN PHỐI HÀNG TIÊU DÙNG",
    labelEn: "Consumer goods distributor",
    labelZh: "消费品分销商",
    channelNoteVi: "Kênh Siêu thị Mẹ Bé",
    channelNoteEn: "Mom & baby retail",
    channelNoteZh: "母婴渠道",
    productLineKeys: [
      "medicinal-tea",
      "yogi-food",
      "thuong-son-tra",
      "spices",
      "nutrition-snacks",
      "medicinal-aroma",
    ],
  },
  {
    key: "distributor-gt",
    labelVi: "NHÀ PHÂN PHỐI HÀNG TIÊU DÙNG",
    labelEn: "Consumer goods distributor",
    labelZh: "消费品分销商",
    channelNoteVi: "Kênh Tạp hoá GT (General Trade)",
    channelNoteEn: "General Trade (GT)",
    channelNoteZh: "传统渠道 GT",
    productLineKeys: [
      "medicinal-tea",
      "yogi-food",
      "thuong-son-tra",
      "spices",
      "nutrition-snacks",
      "medicinal-aroma",
    ],
  },
  {
    key: "ecommerce",
    labelVi: "KÊNH E-COMMERCE",
    labelEn: "E-commerce channel",
    labelZh: "电商渠道",
    productLineKeys: [
      "medicinal-tea",
      "yogi-food",
      "thuong-son-tra",
      "spices",
      "nutrition-snacks",
      "medicinal-aroma",
    ],
  },
  {
    key: "social-media",
    labelVi: "KÊNH SOCIAL MEDIA",
    labelEn: "Social media channel",
    labelZh: "社交媒体渠道",
    productLineKeys: [
      "medicinal-tea",
      "yogi-food",
      "thuong-son-tra",
      "spices",
      "nutrition-snacks",
      "medicinal-aroma",
    ],
  },
  {
    key: "import",
    labelVi: "NHẬP KHẨU",
    labelEn: "Import",
    labelZh: "进口",
    productLineKeys: [
      "medicinal-material",
      "herb-ingredient",
      "tcm-etc",
      "tcm-otc",
      "nutrition-snacks",
    ],
  },
  {
    key: "export",
    labelVi: "XUẤT KHẨU",
    labelEn: "Export",
    labelZh: "出口",
    productLineKeys: [
      "medicinal-material",
      "herb-ingredient",
      "medicinal-tea",
      "nutrition-snacks",
      "fruit",
      "coffee",
      "spices",
    ],
  },
  {
    key: "brand-marketing",
    labelVi: "Marketing Thương Hiệu",
    labelEn: "Brand marketing",
    labelZh: "品牌营销",
    productLineKeys: [
      "medicinal-tea",
      "yogi-food",
      "thuong-son-tra",
      "spices",
      "nutrition-snacks",
      "medicinal-aroma",
      "medicinal-diet",
    ],
  },
];

export interface B2BCustomerRecord {
  id: string;
  segmentKey: B2BCustomerSegmentKey;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  phone: string;
  tier: "gold" | "silver" | "bronze";
  lastVisit: string;
  totalSpendVi: string;
  totalSpendEn: string;
  totalSpendZh: string;
  visits: number;
}

export const B2B_CUSTOMER_RECORDS: B2BCustomerRecord[] = [
  {
    id: "b2b-hospital",
    segmentKey: "hospital-tcm",
    nameVi: "BV Y học Cổ truyền Trung ương",
    nameEn: "National Hospital of Traditional Medicine",
    nameZh: "国家中医医院",
    phone: "024 3825 3531",
    tier: "gold",
    lastVisit: "19/05/2026",
    totalSpendVi: "₫8.1 tỷ",
    totalSpendEn: "₫8.1B",
    totalSpendZh: "81亿₫",
    visits: 48,
  },
  {
    id: "b2b-clinic",
    segmentKey: "clinic-tcm",
    nameVi: "PK Chẩn trị YHCT Thầy Tuấn",
    nameEn: "Master Tuan TCM Diagnosis Clinic",
    nameZh: "俊医师中医诊疗室",
    phone: "0908 556 778",
    tier: "silver",
    lastVisit: "17/05/2026",
    totalSpendVi: "₫1.2 tỷ",
    totalSpendEn: "₫1.2B",
    totalSpendZh: "12亿₫",
    visits: 22,
  },
  {
    id: "b2b-pharmacy",
    segmentKey: "pharmacy",
    nameVi: "Nhà thuốc Pharmacity · Hà Nội",
    nameEn: "Pharmacity Pharmacy · Hanoi",
    nameZh: "Pharmacity 药店 · 河内",
    phone: "1900 6821",
    tier: "gold",
    lastVisit: "18/05/2026",
    totalSpendVi: "₫4.8 tỷ",
    totalSpendEn: "₫4.8B",
    totalSpendZh: "48亿₫",
    visits: 156,
  },
  {
    id: "b2b-herbal",
    segmentKey: "herbal-trading",
    nameVi: "Cty CP Xuất nhập khẩu Dược liệu Sapa",
    nameEn: "Sapa Herbal Import-Export JSC",
    nameZh: "沙巴药材进出口公司",
    phone: "0214 3876 550",
    tier: "silver",
    lastVisit: "14/05/2026",
    totalSpendVi: "₫2.1 tỷ",
    totalSpendEn: "₫2.1B",
    totalSpendZh: "21亿₫",
    visits: 31,
  },
  {
    id: "b2b-pharma-mfg",
    segmentKey: "pharma-manufacturer",
    nameVi: "Cty CP Dược phẩm Đông Nam",
    nameEn: "Dong Nam Herbal Pharma JSC",
    nameZh: "东南草药制药公司",
    phone: "028 3822 1100",
    tier: "gold",
    lastVisit: "18/05/2026",
    totalSpendVi: "₫12.4 tỷ",
    totalSpendEn: "₫12.4B",
    totalSpendZh: "124亿₫",
    visits: 64,
  },
  {
    id: "b2b-cosmetics",
    segmentKey: "cosmetics-manufacturer",
    nameVi: "Cty TNHH Mỹ phẩm thảo dược LotusCare",
    nameEn: "LotusCare Herbal Cosmetics Co.",
    nameZh: "莲花草本化妆品公司",
    phone: "024 3772 8800",
    tier: "silver",
    lastVisit: "12/05/2026",
    totalSpendVi: "₫3.6 tỷ",
    totalSpendEn: "₫3.6B",
    totalSpendZh: "36亿₫",
    visits: 18,
  },
  {
    id: "b2b-dist-mt",
    segmentKey: "distributor-mt",
    nameVi: "Metro Cash & Carry Việt Nam",
    nameEn: "Metro Cash & Carry Vietnam",
    nameZh: "麦德龙越南",
    phone: "028 5412 8800",
    tier: "gold",
    lastVisit: "16/05/2026",
    totalSpendVi: "₫6.2 tỷ",
    totalSpendEn: "₫6.2B",
    totalSpendZh: "62亿₫",
    visits: 89,
  },
  {
    id: "b2b-dist-mbaby",
    segmentKey: "distributor-mbaby",
    nameVi: "Chuỗi Con Cưng",
    nameEn: "Con Cung retail chain",
    nameZh: "Con Cung 母婴连锁",
    phone: "1900 6609",
    tier: "gold",
    lastVisit: "15/05/2026",
    totalSpendVi: "₫5.4 tỷ",
    totalSpendEn: "₫5.4B",
    totalSpendZh: "54亿₫",
    visits: 72,
  },
  {
    id: "b2b-dist-gt",
    segmentKey: "distributor-gt",
    nameVi: "Hệ thống Bách Hóa Xanh",
    nameEn: "Bach Hoa Xanh retail network",
    nameZh: "百佳超市网络",
    phone: "1900 5555 20",
    tier: "gold",
    lastVisit: "17/05/2026",
    totalSpendVi: "₫7.8 tỷ",
    totalSpendEn: "₫7.8B",
    totalSpendZh: "78亿₫",
    visits: 210,
  },
  {
    id: "b2b-ecom",
    segmentKey: "ecommerce",
    nameVi: "BSV Official Store (Shopee · Lazada)",
    nameEn: "BSV Official Store (Shopee · Lazada)",
    nameZh: "BSV 官方店 (Shopee · Lazada)",
    phone: "—",
    tier: "silver",
    lastVisit: "19/05/2026",
    totalSpendVi: "₫2.9 tỷ",
    totalSpendEn: "₫2.9B",
    totalSpendZh: "29亿₫",
    visits: 1240,
  },
  {
    id: "b2b-social",
    segmentKey: "social-media",
    nameVi: "Golden Lotus Herbals · Social",
    nameEn: "Golden Lotus Herbals · Social",
    nameZh: "金莲花 · 社交渠道",
    phone: "—",
    tier: "bronze",
    lastVisit: "18/05/2026",
    totalSpendVi: "₫680 tr",
    totalSpendEn: "₫680M",
    totalSpendZh: "6.8亿₫",
    visits: 890,
  },
  {
    id: "b2b-import",
    segmentKey: "import",
    nameVi: "Cty TNHH Nhập khẩu Dược phẩm Đông Á",
    nameEn: "East Asia Pharma Import Co.",
    nameZh: "东亚药品进口公司",
    phone: "+84 28 7300 2200",
    tier: "gold",
    lastVisit: "19/05/2026",
    totalSpendVi: "₫5.8 tỷ",
    totalSpendEn: "₫5.8B",
    totalSpendZh: "58亿₫",
    visits: 42,
  },
  {
    id: "b2b-export",
    segmentKey: "export",
    nameVi: "Cty TNHH Xuất khẩu Golden Lotus Asia",
    nameEn: "Golden Lotus Asia Export Co.",
    nameZh: "金莲花亚洲出口公司",
    phone: "+84 28 7300 8800",
    tier: "gold",
    lastVisit: "20/05/2026",
    totalSpendVi: "₫9.6 tỷ",
    totalSpendEn: "₫9.6B",
    totalSpendZh: "96亿₫",
    visits: 36,
  },
  {
    id: "b2b-brand-marketing",
    segmentKey: "brand-marketing",
    nameVi: "Cty CP Marketing Thương Hiệu Golden Lotus",
    nameEn: "Golden Lotus Brand Marketing JSC",
    nameZh: "金莲花品牌营销公司",
    phone: "028 3822 9900",
    tier: "gold",
    lastVisit: "21/05/2026",
    totalSpendVi: "₫4.2 tỷ",
    totalSpendEn: "₫4.2B",
    totalSpendZh: "42亿₫",
    visits: 28,
  },
];

export function getB2BCustomerRecord(id: string): B2BCustomerRecord | undefined {
  return B2B_CUSTOMER_RECORDS.find((r) => r.id === id);
}

export function getB2BSegment(segmentKey: B2BCustomerSegmentKey): B2BCustomerSegment {
  return B2B_CUSTOMER_SEGMENTS.find((s) => s.key === segmentKey) ?? B2B_CUSTOMER_SEGMENTS[0];
}

export function getB2BProductLinesForSegment(
  segmentKey: B2BCustomerSegmentKey
): B2BProductLine[] {
  const segment = getB2BSegment(segmentKey);
  return segment.productLineKeys.map((key) => B2B_PRODUCT_LINES[key]);
}

export function productLineLabel(line: B2BProductLine, locale: "vi" | "en" | "zh"): string {
  if (locale === "en") return line.labelEn;
  if (locale === "zh") return line.labelZh;
  return line.labelVi;
}

export function segmentLabel(segment: B2BCustomerSegment, locale: "vi" | "en" | "zh"): string {
  if (locale === "en") return segment.labelEn;
  if (locale === "zh") return segment.labelZh;
  return segment.labelVi;
}

export function segmentTierLabel(
  record: B2BCustomerRecord,
  locale: "vi" | "en" | "zh"
): string {
  const segment = getB2BSegment(record.segmentKey);
  const base = segmentLabel(segment, locale);
  const channel =
    locale === "zh"
      ? segment.channelNoteZh
      : locale === "en"
        ? segment.channelNoteEn
        : segment.channelNoteVi;
  return channel ? `${base} · ${channel}` : base;
}
