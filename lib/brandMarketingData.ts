export type Locale = "vi" | "en" | "zh";

export interface LocalizedText {
  vi: string;
  en: string;
  zh: string;
}

export interface BrandStrengthPillar {
  key: string;
  title: LocalizedText;
  score: number;
  target: number;
  trend: string;
  insight: LocalizedText;
}

export interface AwarenessSurveyRow {
  id: string;
  period: string;
  region: LocalizedText;
  sampleSize: number;
  aidedAwareness: number;
  unaidedAwareness: number;
  topOfMind: number;
  consideration: number;
  nps: number;
}

export interface BrandCampaignRow {
  id: string;
  name: LocalizedText;
  channel: LocalizedText;
  status: "active" | "planned" | "completed";
  budgetVi: string;
  reach: string;
  awarenessLift: string;
  period: string;
  objective: LocalizedText;
}

export interface BrandMarketingOverview {
  strengthIndex: number;
  strengthGrade: LocalizedText;
  strengthTrend: string;
  aidedAwareness: number;
  unaidedAwareness: number;
  shareOfVoice: number;
  brandPreference: number;
  activeCampaigns: number;
  pillars: BrandStrengthPillar[];
  priorities: LocalizedText[];
}

const loc = (vi: string, en: string, zh: string): LocalizedText => ({ vi, en, zh });

export const BRAND_MARKETING_OVERVIEW: BrandMarketingOverview = {
  strengthIndex: 72,
  strengthGrade: loc("Khá mạnh", "Moderately strong", "较强"),
  strengthTrend: "+4 điểm / quý",
  aidedAwareness: 68,
  unaidedAwareness: 41,
  shareOfVoice: 24,
  brandPreference: 36,
  activeCampaigns: 3,
  pillars: [
    {
      key: "awareness",
      title: loc("Nhận diện thương hiệu", "Brand awareness", "品牌认知"),
      score: 68,
      target: 75,
      trend: "+6%",
      insight: loc(
        "Tỷ lệ nhận biết có hỗ trợ tăng sau chiến dịch truyền thông Q2 — cần mở rộng vùng Đông Nam Bộ.",
        "Aided awareness rose after Q2 comms — expand in the Southeast.",
        "提示认知在 Q2 传播后上升 — 需拓展东南部。"
      ),
    },
    {
      key: "association",
      title: loc("Liên kết thương hiệu", "Brand association", "品牌联想"),
      score: 71,
      target: 78,
      trend: "+3%",
      insight: loc(
        "Khách hàng gắn BSV với “dược liệu chuẩn hóa · minh bạch nguồn gốc”.",
        "Customers link BSV to standardized herbs and traceable origin.",
        "客户将 BSV 与标准化药材、可追溯来源关联。"
      ),
    },
    {
      key: "loyalty",
      title: loc("Lòng trung thành", "Brand loyalty", "品牌忠诚"),
      score: 65,
      target: 72,
      trend: "+2%",
      insight: loc(
        "NPS ổn định; cần tăng tái mua qua chương trình chăm sóc thương hiệu.",
        "NPS stable; grow repurchase via brand care programs.",
        "NPS 稳定；需通过品牌关怀提升复购。"
      ),
    },
    {
      key: "equity",
      title: loc("Giá trị thương hiệu", "Brand equity", "品牌价值"),
      score: 74,
      target: 80,
      trend: "+5%",
      insight: loc(
        "Thương hiệu được đánh giá cao về uy tín YHCT — tận dụng cho xuất khẩu.",
        "Strong TCM credibility — leverage for export positioning.",
        "中医药信誉高 — 可用于出口定位。"
      ),
    },
  ],
  priorities: [
    loc(
      "Tăng nhận biết không hỗ trợ tại Hà Nội & TP.HCM lên 45% trong 2 quý.",
      "Raise unaided awareness in Hanoi & HCMC to 45% within 2 quarters.",
      "2 个季度内将河内与胡志明无提示认知提升至 45%。"
    ),
    loc(
      "Đồng bộ thông điệp “Nguồn gốc minh bạch” trên social & MT.",
      "Align “transparent origin” message on social & MT.",
      "在社交媒体与现代渠道统一“透明溯源”信息。"
    ),
    loc(
      "Đo lường lift nhận diện sau mỗi chiến dịch truyền thông.",
      "Measure awareness lift after each brand campaign.",
      "每次品牌传播活动后测量认知提升。"
    ),
  ],
};

export const BRAND_AWARENESS_SURVEYS: AwarenessSurveyRow[] = [
  {
    id: "s-q1-hn",
    period: "Q1/2026",
    region: loc("Hà Nội", "Hanoi", "河内"),
    sampleSize: 1200,
    aidedAwareness: 72,
    unaidedAwareness: 44,
    topOfMind: 18,
    consideration: 52,
    nps: 46,
  },
  {
    id: "s-q1-hcm",
    period: "Q1/2026",
    region: loc("TP. Hồ Chí Minh", "Ho Chi Minh City", "胡志明市"),
    sampleSize: 1500,
    aidedAwareness: 70,
    unaidedAwareness: 42,
    topOfMind: 16,
    consideration: 49,
    nps: 44,
  },
  {
    id: "s-q1-dn",
    period: "Q1/2026",
    region: loc("Đà Nẵng · Miền Trung", "Da Nang · Central", "岘港 · 中部"),
    sampleSize: 800,
    aidedAwareness: 58,
    unaidedAwareness: 31,
    topOfMind: 9,
    consideration: 38,
    nps: 41,
  },
  {
    id: "s-q4-24-national",
    period: "Q4/2025",
    region: loc("Toàn quốc", "Nationwide", "全国"),
    sampleSize: 4200,
    aidedAwareness: 64,
    unaidedAwareness: 37,
    topOfMind: 14,
    consideration: 45,
    nps: 43,
  },
];

export const BRAND_CAMPAIGNS: BrandCampaignRow[] = [
  {
    id: "c-heritage-story",
    name: loc("Câu chuyện Di sản Thảo dược", "Heritage Herbals Story", "草药遗产故事"),
    channel: loc("Social · Video dài", "Social · Long-form video", "社交 · 长视频"),
    status: "active",
    budgetVi: "₫1.2 tỷ",
    reach: "4.2M lượt xem",
    awarenessLift: "+8% nhận biết có hỗ trợ",
    period: "03/2026 – 06/2026",
    objective: loc(
      "Xây dựng hình ảnh thương hiệu gắn di sản & nguồn gốc bản địa.",
      "Build brand image tied to heritage and local origin.",
      "塑造与遗产、本土来源相关的品牌形象。"
    ),
  },
  {
    id: "c-transparent-origin",
    name: loc("Minh bạch nguồn gốc BSV", "BSV Transparent Origin", "BSV 透明溯源"),
    channel: loc("PR · KOL · Báo chí", "PR · KOL · Press", "公关 · KOL · 媒体"),
    status: "active",
    budgetVi: "₫850 tr",
    reach: "28 bài PR · 12 KOL",
    awarenessLift: "+5% consideration",
    period: "04/2026 – 05/2026",
    objective: loc(
      "Tăng độ tin cậy và sự ưu tiên khi mua hàng B2C/B2B.",
      "Increase trust and purchase preference in B2C/B2B.",
      "提升 B2C/B2B 购买信任与偏好。"
    ),
  },
  {
    id: "c-tet-gift",
    name: loc("Quà tặng thương hiệu · Tết", "Brand gifting · Lunar New Year", "品牌礼品 · 春节"),
    channel: loc("OOH · MT · E-commerce", "OOH · MT · E-commerce", "户外 · MT · 电商"),
    status: "planned",
    budgetVi: "₫600 tr",
    reach: "Dự kiến 2.1M tiếp cận",
    awarenessLift: "Mục tiêu +6% top-of-mind",
    period: "11/2026 – 01/2027",
    objective: loc(
      "Tăng top-of-mind trong mùa cao điểm quà tặng sức khỏe.",
      "Grow top-of-mind in peak health gifting season.",
      "在健康礼品旺季提升第一提及率。"
    ),
  },
  {
    id: "c-yhct-edu",
    name: loc("Giáo dục YHCT cho người tiêu dùng", "TCM education for consumers", "消费者中医药科普"),
    channel: loc("TikTok · Facebook · Hội thảo", "TikTok · Facebook · Seminars", "TikTok · Facebook · 研讨会"),
    status: "completed",
    budgetVi: "₫420 tr",
    reach: "1.8M engagement",
    awarenessLift: "+4% unaided",
    period: "01/2026 – 03/2026",
    objective: loc(
      "Gắn thương hiệu với chuyên môn YHCT có trách nhiệm.",
      "Associate brand with responsible TCM expertise.",
      "将品牌与负责任的中医药专业关联。"
    ),
  },
];

export function pickLocalized(text: LocalizedText, locale: Locale): string {
  if (locale === "en") return text.en;
  if (locale === "zh") return text.zh;
  return text.vi;
}

export function campaignStatusLabel(
  status: BrandCampaignRow["status"],
  locale: Locale
): string {
  const map = {
    active: loc("Đang chạy", "Active", "进行中"),
    planned: loc("Kế hoạch", "Planned", "计划中"),
    completed: loc("Hoàn tất", "Completed", "已完成"),
  };
  return pickLocalized(map[status], locale);
}
