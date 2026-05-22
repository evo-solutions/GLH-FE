import type { GlobalCustomerListItem } from "@/types/customer";

/** Khách hàng B — doanh nghiệp mua dược liệu từ Holding Bông Sen Vàng (mock). */
export function getB2BCustomers(locale: "vi" | "en" | "zh"): GlobalCustomerListItem[] {
  const rows: Array<{
    id: string;
    nameVi: string;
    nameEn: string;
    nameZh: string;
    orgVi: string;
    orgEn: string;
    orgZh: string;
    phone: string;
    tier: "gold" | "silver" | "bronze";
    lastVisit: string;
    totalSpendVi: string;
    totalSpendEn: string;
    totalSpendZh: string;
  }> = [
    {
      id: "b2b-01",
      nameVi: "Công ty CP Dược phẩm Đông Nam",
      nameEn: "Dong Nam Herbal Pharma JSC",
      nameZh: "东南草药制药公司",
      orgVi: "Sản xuất thuốc đông y",
      orgEn: "Traditional medicine manufacturer",
      orgZh: "中药生产企业",
      phone: "028 3822 1100",
      tier: "gold",
      lastVisit: "18/05/2026",
      totalSpendVi: "₫12.4 tỷ",
      totalSpendEn: "₫12.4B",
      totalSpendZh: "124亿₫",
    },
    {
      id: "b2b-02",
      nameVi: "BV Y học cổ truyền TP.HCM",
      nameEn: "HCMC Traditional Medicine Hospital",
      nameZh: "胡志明市中医医院",
      orgVi: "Bệnh viện / bốc thuốc",
      orgEn: "Hospital / dispensing",
      orgZh: "医院配药",
      phone: "028 3869 4400",
      tier: "gold",
      lastVisit: "15/05/2026",
      totalSpendVi: "₫8.1 tỷ",
      totalSpendEn: "₫8.1B",
      totalSpendZh: "81亿₫",
    },
    {
      id: "b2b-03",
      nameVi: "Cty TNHH Mỹ phẩm thảo dược LotusCare",
      nameEn: "LotusCare Herbal Cosmetics Co.",
      nameZh: "莲花草本化妆品公司",
      orgVi: "Hóa mỹ phẩm từ dược liệu",
      orgEn: "Herbal cosmetics",
      orgZh: "草药化妆品",
      phone: "024 3772 8800",
      tier: "silver",
      lastVisit: "10/05/2026",
      totalSpendVi: "₫3.6 tỷ",
      totalSpendEn: "₫3.6B",
      totalSpendZh: "36亿₫",
    },
    {
      id: "b2b-04",
      nameVi: "Phòng khám Đông y Thầy Tuấn",
      nameEn: "Master Tuan TCM Clinic",
      nameZh: "俊医师中医诊所",
      orgVi: "Phòng mạch bốc thuốc",
      orgEn: "TCM clinic",
      orgZh: "中医诊所",
      phone: "0908 556 778",
      tier: "silver",
      lastVisit: "08/05/2026",
      totalSpendVi: "₫1.2 tỷ",
      totalSpendEn: "₫1.2B",
      totalSpendZh: "12亿₫",
    },
    {
      id: "b2b-05",
      nameVi: "Cty CP Thực phẩm chức năng VitaHerb",
      nameEn: "VitaHerb Functional Foods JSC",
      nameZh: "维草功能食品公司",
      orgVi: "TPCN / thực phẩm bổ sung",
      orgEn: "Supplements / functional foods",
      orgZh: "保健食品",
      phone: "0236 3855 2200",
      tier: "bronze",
      lastVisit: "02/05/2026",
      totalSpendVi: "₫890 tr",
      totalSpendEn: "₫890M",
      totalSpendZh: "8.9亿₫",
    },
  ];

  return rows.map((r) => ({
    id: r.id,
    globalId: `holding__${r.id}`,
    locationId: "holding-bsv",
    locationCode: "BSV-HQ",
    locationName:
      locale === "zh" ? "金莲花控股" : locale === "en" ? "Golden Lotus Holding" : "Bông Sen Vàng Holding",
    customerSegment: "B" as const,
    name: locale === "zh" ? r.nameZh : locale === "en" ? r.nameEn : r.nameVi,
    phone: r.phone,
    tier: r.tier,
    tierLabel:
      locale === "zh"
        ? r.tier === "gold"
          ? "金牌"
          : r.tier === "silver"
            ? "银牌"
            : "铜牌"
        : locale === "en"
          ? r.tier === "gold"
            ? "Gold"
            : r.tier === "silver"
              ? "Silver"
              : "Bronze"
          : r.tier === "gold"
            ? "Vàng"
            : r.tier === "silver"
              ? "Bạc"
              : "Đồng",
    lastVisit: r.lastVisit,
    totalSpent: locale === "zh" ? r.totalSpendZh : locale === "en" ? r.totalSpendEn : r.totalSpendVi,
    visits: 0,
    preferredHour: "—",
  }));
}
