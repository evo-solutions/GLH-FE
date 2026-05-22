import type { BusinessModelSlug } from "@/libs/business-models/config";

export type TradeMarketingPillarKey =
  | "display"
  | "training"
  | "customerCare"
  | "salesPolicy"
  | "seasonalCampaigns"
  | "newStores";

export interface TradeMarketingActivity {
  id: string;
  label: { vi: string; en: string; zh: string };
  status: "active" | "planned" | "done";
  metric?: { vi: string; en: string; zh: string };
}

export interface TradeMarketingPillar {
  key: TradeMarketingPillarKey;
  title: { vi: string; en: string; zh: string };
  description: { vi: string; en: string; zh: string };
  focus: { vi: string; en: string; zh: string };
  kpiLabel: { vi: string; en: string; zh: string };
  kpiValue: string;
  activities: TradeMarketingActivity[];
}

export interface TradeMarketingScope {
  kpis: {
    storesCompetitive: string;
    campaignsActive: number;
    newStoresYtd: number;
    satisfactionIndex: string;
  };
  pillars: TradeMarketingPillar[];
}

const PILLAR_TEMPLATES: Omit<TradeMarketingPillar, "kpiValue" | "activities">[] = [
  {
    key: "display",
    title: { vi: "Trưng bày hàng hoá", en: "In-store display", zh: "商品陈列" },
    description: {
      vi: "Thiết kế & kiểm soát trưng bày tại điểm bán — sản phẩm nổi bật, đúng vị trí, đúng chuẩn nhận diện.",
      en: "Design and audit shelf/display at stores — visibility, planogram, brand standards.",
      zh: "门店陈列设计与巡检。",
    },
    focus: {
      vi: "Chiến thắng tại điểm bán · kệ & POSM",
      en: "Win at shelf · planogram & POSM",
      zh: "货架与物料",
    },
    kpiLabel: { vi: "Điểm bán đạt chuẩn TB", en: "Stores meeting display standard", zh: "达标门店" },
  },
  {
    key: "training",
    title: { vi: "Đào tạo nhân viên bán hàng", en: "Sales staff training", zh: "销售培训" },
    description: {
      vi: "Nâng năng lực NVBH: sản phẩm, tư vấn 4 nhu cầu, kỹ năng chốt và chăm sóc sau bán.",
      en: "Upskill store staff: product knowledge, four needs framework, closing & follow-up.",
      zh: "提升门店销售能力。",
    },
    focus: {
      vi: "Người bán hàng · hiểu khách tại quầy",
      en: "Frontline sellers · customer understanding",
      zh: "一线销售",
    },
    kpiLabel: { vi: "Giờ đào tạo / tháng", en: "Training hours / month", zh: "月培训时数" },
  },
  {
    key: "customerCare",
    title: { vi: "Chăm sóc khách hàng", en: "Customer care", zh: "客户关怀" },
    description: {
      vi: "Theo dõi 4 nhu cầu & mức hài lòng của khách C tại từng điểm bán — phản hồi, xử lý, giữ chân.",
      en: "Track four needs and satisfaction of C customers per store — feedback and retention.",
      zh: "跟踪四类需求与满意度。",
    },
    focus: {
      vi: "Khách hàng · hài lòng tại điểm mua",
      en: "Customer · satisfaction at purchase",
      zh: "客户满意",
    },
    kpiLabel: { vi: "Điểm hài lòng TB (CSAT)", en: "Avg. CSAT score", zh: "平均满意度" },
  },
  {
    key: "salesPolicy",
    title: { vi: "Chính sách bán hàng", en: "Sales policies", zh: "销售政策" },
    description: {
      vi: "Chương trình giá, combo, tích điểm, hoa hồng NVBH — dữ liệu để ra quyết định nhanh tại điểm bán.",
      en: "Pricing bundles, loyalty, incentives — data-driven policies for store decisions.",
      zh: "价格与激励政策。",
    },
    focus: {
      vi: "Chính sách · cạnh tranh mạnh tại ĐB",
      en: "Policies · strong competitiveness",
      zh: "门店竞争力",
    },
    kpiLabel: { vi: "Chính sách đang áp dụng", en: "Active policies", zh: "生效政策数" },
  },
  {
    key: "seasonalCampaigns",
    title: {
      vi: "Chiến dịch marketing theo thời điểm",
      en: "Time-based trade campaigns",
      zh: "时段营销活动",
    },
    description: {
      vi: "Triển khai theo mùa, lễ, sự kiện bán lẻ — không phải brand ATL/truyền thông đại chúng.",
      en: "Seasonal and retail-calendar activations — not brand mass media.",
      zh: "按季节与零售节点执行，非品牌大众传播。",
    },
    focus: {
      vi: "Chiến thắng khách · tại thời điểm mua",
      en: "Win customers · at moment of purchase",
      zh: "购买时点",
    },
    kpiLabel: { vi: "Chiến dịch đang chạy", en: "Active campaigns", zh: "进行中活动" },
  },
  {
    key: "newStores",
    title: { vi: "Mở mới điểm bán", en: "New store openings", zh: "新开门店" },
    description: {
      vi: "Mở mới & giữ điểm cũ luôn ở trạng thái cạnh tranh mạnh — khảo sát, kế hoạch trade-in.",
      en: "Open new outlets and keep existing stores highly competitive.",
      zh: "拓展新点并保持老店竞争力。",
    },
    focus: {
      vi: "Điểm bán · mở mới & duy trì",
      en: "Stores · open & sustain",
      zh: "门店拓展",
    },
    kpiLabel: { vi: "Điểm mở mới YTD", en: "New stores YTD", zh: "本年新开店" },
  },
];

function activitiesFor(
  key: TradeMarketingPillarKey,
  unit: string
): TradeMarketingActivity[] {
  const maps: Record<TradeMarketingPillarKey, TradeMarketingActivity[]> = {
    display: [
      {
        id: "d1",
        label: { vi: "Audit trưng bày Q2 · " + unit, en: "Q2 display audit · " + unit, zh: "Q2陈列检查" },
        status: "active",
        metric: { vi: "18/20 điểm đạt", en: "18/20 stores pass", zh: "18/20达标" },
      },
      {
        id: "d2",
        label: { vi: "Bộ POSM mùa hè", en: "Summer POSM kit", zh: "夏季物料包" },
        status: "planned",
      },
    ],
    training: [
      {
        id: "t1",
        label: { vi: "Workshop 4 nhu cầu khách C", en: "Four-needs workshop", zh: "四类需求培训" },
        status: "active",
        metric: { vi: "240 giờ", en: "240 hours", zh: "240小时" },
      },
      {
        id: "t2",
        label: { vi: "E-learning NVBH mới", en: "New staff e-learning", zh: "新员工线上课" },
        status: "done",
      },
    ],
    customerCare: [
      {
        id: "c1",
        label: { vi: "Khảo sát CSAT tháng 5", en: "May CSAT survey", zh: "5月满意度调查" },
        status: "active",
        metric: { vi: "4.6/5", en: "4.6/5", zh: "4.6/5" },
      },
      {
        id: "c2",
        label: { vi: "Hotline phản hồi ĐB", en: "Store feedback hotline", zh: "门店反馈热线" },
        status: "active",
      },
    ],
    salesPolicy: [
      {
        id: "p1",
        label: { vi: "Combo TPCN + trà dược", en: "Supplement + tea bundle", zh: "组合促销" },
        status: "active",
        metric: { vi: "12 điểm bán", en: "12 stores", zh: "12店" },
      },
      {
        id: "p2",
        label: { vi: "Tích điểm khách Vàng", en: "Gold tier loyalty", zh: "金牌积分" },
        status: "active",
      },
    ],
    seasonalCampaigns: [
      {
        id: "s1",
        label: { vi: "KM mùa nóng · điểm bán", en: "Hot season promo", zh: "旺季促销" },
        status: "active",
        metric: { vi: "+14% doanh thu ĐB", en: "+14% store sales", zh: "门店+14%" },
      },
      {
        id: "s2",
        label: { vi: "Tết Trung thu · quà tặng", en: "Mid-autumn gifting", zh: "中秋礼品" },
        status: "planned",
      },
    ],
    newStores: [
      {
        id: "n1",
        label: { vi: "Khai trương HCM mới", en: "New HCM opening", zh: "胡志明新店" },
        status: "active",
        metric: { vi: "Tuần 3/5", en: "Week 3/5", zh: "第3周" },
      },
      {
        id: "n2",
        label: { vi: "Revamp ĐB cũ · kệ mới", en: "Legacy store refresh", zh: "老店翻新" },
        status: "done",
      },
    ],
  };
  return maps[key];
}

function kpiValuesFor(key: TradeMarketingPillarKey, storeCount: number): string {
  const v: Record<TradeMarketingPillarKey, string> = {
    display: `${Math.max(storeCount - 2, 1)}/${storeCount}`,
    training: "186",
    customerCare: "4.5/5",
    salesPolicy: "8",
    seasonalCampaigns: "3",
    newStores: "2",
  };
  return v[key];
}

const STORE_COUNTS: Partial<Record<BusinessModelSlug, number>> = {
  "thao-duoc-di-san": 5,
  "khang-duong-di-san": 5,
  "yogi-food": 3,
  "thuong-son-tra": 2,
  "than-tra": 3,
};

export function getTradeMarketingScope(slug: BusinessModelSlug): TradeMarketingScope {
  const stores = STORE_COUNTS[slug] ?? 5;
  const unit =
    slug === "thao-duoc-di-san"
      ? "TDDS"
      : slug === "khang-duong-di-san"
        ? "KDDs"
        : slug === "yogi-food"
          ? "YOGI"
          : slug === "thuong-son-tra"
            ? "TST"
            : "TT";

  const pillars: TradeMarketingPillar[] = PILLAR_TEMPLATES.map((t) => ({
    ...t,
    kpiValue: kpiValuesFor(t.key, stores),
    activities: activitiesFor(t.key, unit),
  }));

  return {
    kpis: {
      storesCompetitive: `${stores - 1}/${stores}`,
      campaignsActive: 3,
      newStoresYtd: 2,
      satisfactionIndex: "4.5/5",
    },
    pillars,
  };
}
