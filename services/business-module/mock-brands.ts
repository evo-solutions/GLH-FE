import type { BusinessModuleId } from "@/libs/business-modules/config";
import type { ExternalOrganizationId } from "@/libs/external-organizations/config";
import type { HeritageModuleData, HeritageSectionRow } from "@/types/heritage";

type Locale = "vi" | "en" | "zh";

export type OrgScopeBrandId = BusinessModuleId | ExternalOrganizationId | "holding";

const HOLDING_BRAND: Record<Locale, string> = {
  vi: "GLH",
  en: "GLH",
  zh: "金莲花",
};

const BRAND_PREFIX: Record<
  Exclude<OrgScopeBrandId, "holding">,
  Record<Locale, string>
> = {
  thaoDuocDiSan: {
    vi: "TĐDS",
    en: "HTH",
    zh: "传承草本",
  },
  khangDuongDiSan: {
    vi: "KĐDS",
    en: "KDS",
    zh: "康养传承",
  },
  yogiFood: {
    vi: "Yogi Food",
    en: "Yogi Food",
    zh: "Yogi Food",
  },
  thuongSonTra: {
    vi: "TST",
    en: "MST",
    zh: "上山茶",
  },
  thanTra: {
    vi: "Thần Trà",
    en: "Than Tra",
    zh: "神茶",
  },
  benhVienYhct: {
    vi: "BV YHCT",
    en: "TCM Hospital",
    zh: "中医院",
  },
  phongChanTriYhct: {
    vi: "PCT YHCT",
    en: "TCM Clinic",
    zh: "中医诊室",
  },
  nhaThuoc: {
    vi: "Nhà thuốc",
    en: "Pharmacy",
    zh: "药店",
  },
  dnKdDuocLieu: {
    vi: "DN KD DL",
    en: "Herb trading",
    zh: "药材经营",
  },
  dnSxDuoc: {
    vi: "DN SX Dược",
    en: "Pharma mfg.",
    zh: "制药企业",
  },
  thucPhamChucNang: {
    vi: "TPCN",
    en: "Functional F&B",
    zh: "功能性食品",
  },
  thucPhamBoSung: {
    vi: "TPBS",
    en: "Supplements",
    zh: "膳食补充剂",
  },
  dnSxHoaMyPham: {
    vi: "DN SX Mỹ phẩm",
    en: "Cosmetics mfg.",
    zh: "化妆品制造",
  },
  nhaPhanPhoiMt: {
    vi: "MT",
    en: "MT channel",
    zh: "现代渠道",
  },
  nhaPhanPhoiMeBe: {
    vi: "Mẹ & Bé",
    en: "Mom & baby",
    zh: "母婴渠道",
  },
  nhaPhanPhoiGt: {
    vi: "GT",
    en: "GT channel",
    zh: "传统渠道",
  },
  kenhEcommerce: {
    vi: "E-commerce",
    en: "E-commerce",
    zh: "电商",
  },
  kenhSocialMedia: {
    vi: "Social",
    en: "Social media",
    zh: "社交媒体",
  },
  xuatKhau: {
    vi: "Xuất khẩu",
    en: "Export",
    zh: "出口",
  },
};

function prefixRow(
  row: HeritageSectionRow,
  brand: string,
): HeritageSectionRow {
  return {
    ...row,
    id: row.id,
    name: `${brand} · ${row.name}`,
    owner: row.owner.includes("—")
      ? row.owner.replace(/^[^—]+/, brand)
      : `${brand} · ${row.owner}`,
  };
}

function mapSection(
  rows: HeritageSectionRow[],
  brand: string,
): HeritageSectionRow[] {
  return rows.map((r) => prefixRow(r, brand));
}

export function applyBrandToModuleData(
  data: HeritageModuleData,
  moduleId: OrgScopeBrandId,
  locale: string,
): HeritageModuleData {
  const loc: Locale = locale === "en" || locale === "zh" ? locale : "vi";
  const brand =
    moduleId === "holding" ? HOLDING_BRAND[loc] : BRAND_PREFIX[moduleId][loc];

  return {
    tradeMarketing: {
      merchandiseDisplay: mapSection(data.tradeMarketing.merchandiseDisplay, brand),
      salesTraining: mapSection(data.tradeMarketing.salesTraining, brand),
      customerCare: mapSection(data.tradeMarketing.customerCare, brand),
      salesPolicy: mapSection(data.tradeMarketing.salesPolicy, brand),
      seasonalCampaigns: mapSection(data.tradeMarketing.seasonalCampaigns, brand),
      newStoreOpening: mapSection(data.tradeMarketing.newStoreOpening, brand),
    },
    insights: {
      risks: mapSection(data.insights.risks, brand),
      opportunities: mapSection(data.insights.opportunities, brand),
      forecasts: mapSection(data.insights.forecasts, brand),
      recommendations: mapSection(data.insights.recommendations, brand),
    },
  };
}
