import { INSTANCE_PRODUCT_SPECS, getInboundOrderProductUnits } from "@/lib/productInstanceCatalog";
import { getLocationSeed, LOCATION_IDS } from "@/lib/locationRegistry";
import type {
  CustomerActivityTouchpoint,
  CustomerCohortRow,
  CustomerLoyaltyBenchmarkRow,
  CustomerOrderInvoice,
  CustomerOrderInvoiceLine,
  CustomerPurchaseSegmentRow,
  CustomerTier,
  LocationCustomerDetail,
  LocationCustomerPurchase,
  LocationSalesCustomer,
} from "@/types/location";

type Locale = "vi" | "en" | "zh";

function hash(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function touchpointAt(daysAgo: number, hour: number, minute: number): string {
  const d = new Date(2026, 4, 18);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function productAt(index: number) {
  return INSTANCE_PRODUCT_SPECS[index % INSTANCE_PRODUCT_SPECS.length];
}

const LOYALTY_BENCHMARKS_VI: Omit<CustomerLoyaltyBenchmarkRow, "status">[] = [
  { segment: "Chăm sóc cao cấp", members: 12400, avgFrequency90d: 4.2, ltvIndex: 118 },
  { segment: "Nhạy giá", members: 38200, avgFrequency90d: 1.8, ltvIndex: 62 },
  { segment: "Mạn tính", members: 9050, avgFrequency90d: 6.1, ltvIndex: 132 },
];

const LOYALTY_BENCHMARKS_EN: Omit<CustomerLoyaltyBenchmarkRow, "status">[] = [
  { segment: "Premium care", members: 12400, avgFrequency90d: 4.2, ltvIndex: 118 },
  { segment: "Price sensitive", members: 38200, avgFrequency90d: 1.8, ltvIndex: 62 },
  { segment: "Chronic care", members: 9050, avgFrequency90d: 6.1, ltvIndex: 132 },
];

const LOYALTY_BENCHMARKS_ZH: Omit<CustomerLoyaltyBenchmarkRow, "status">[] = [
  { segment: "高端护理", members: 12400, avgFrequency90d: 4.2, ltvIndex: 118 },
  { segment: "价格敏感", members: 38200, avgFrequency90d: 1.8, ltvIndex: 62 },
  { segment: "慢病管理", members: 9050, avgFrequency90d: 6.1, ltvIndex: 132 },
];

function loyaltyBenchmarks(locale: Locale, highlightIdx: number): CustomerLoyaltyBenchmarkRow[] {
  const rows = locale === "zh" ? LOYALTY_BENCHMARKS_ZH : locale === "en" ? LOYALTY_BENCHMARKS_EN : LOYALTY_BENCHMARKS_VI;
  const statusLabels =
    locale === "zh"
      ? ["良好", "关注", "良好"]
      : locale === "en"
        ? ["Healthy", "Watch", "Healthy"]
        : ["Tốt", "Theo dõi", "Mở bán thêm"];

  return rows.map((row, i) => ({
    ...row,
    status: statusLabels[i] ?? statusLabels[0],
    segment: i === highlightIdx ? `${row.segment} ★` : row.segment,
  }));
}

type ActivityTemplate = {
  at: string;
  locationId: string;
  channel: string;
  touchpoint: string;
  outcome: string;
  orderLines?: { productCode: string; name: string; importPrice: string; qty: number }[];
};

function locationDisplayName(locationId: string, locale: Locale): string {
  const seed = getLocationSeed(locationId);
  if (locale === "zh") return seed.nameZh;
  if (locale === "en") return seed.nameEn;
  return seed.nameVi;
}

function posLabelFor(locationId: string, locale: Locale): string {
  const seed = getLocationSeed(locationId);
  if (locale === "zh") return `POS · ${seed.nameZh}`;
  if (locale === "en") return `POS · ${seed.nameEn}`;
  return `POS · ${seed.shortNameVi}`;
}

function pickOtherLocationIds(primaryLocationId: string, customerId: string, count: number): string[] {
  const others = LOCATION_IDS.filter((id) => id !== primaryLocationId);
  const start = hash(`${primaryLocationId}:${customerId}:locs`) % others.length;
  const picked: string[] = [];
  for (let i = 0; i < others.length && picked.length < count; i++) {
    const id = others[(start + i) % others.length];
    if (!picked.includes(id)) picked.push(id);
  }
  return picked;
}

function parseImportAmount(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return Number(digits) || 100_000;
}

function formatLineTotal(unitPrice: string, qty: number, locale: Locale): string {
  const amount = parseImportAmount(unitPrice) * qty;
  if (locale === "en") {
    if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(2)}M`;
    return `₫${Math.round(amount / 1000)}K`;
  }
  if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(1)} tr`;
  if (amount >= 1_000) return `₫${Math.round(amount / 1000)} nghìn`;
  return `₫${amount.toLocaleString("vi-VN")}`;
}

function buildOrderInvoice(
  locationId: string,
  orderCode: string,
  at: string,
  channel: string,
  touchpoint: string,
  orderLines: { productCode: string; name: string; importPrice: string; qty: number }[],
  locale: Locale
): CustomerOrderInvoice {
  const lines: CustomerOrderInvoiceLine[] = [];
  let total = 0;

  for (const ol of orderLines) {
    const units = getInboundOrderProductUnits(locationId, orderCode, ol.productCode, ol.qty);
    const unitPrice = ol.importPrice;
    const unitAmount = parseImportAmount(unitPrice);

    if (units.length > 0) {
      for (const unit of units) {
        lines.push({
          id: `${orderCode}-${unit.id}`,
          productCode: ol.productCode,
          productName: ol.name,
          barcode: unit.barcode,
          batchNo: unit.batchNo,
          qty: 1,
          unitPrice,
          lineTotal: formatLineTotal(unitPrice, 1, locale),
        });
        total += unitAmount;
      }
    } else {
      lines.push({
        id: `${orderCode}-${ol.productCode}`,
        productCode: ol.productCode,
        productName: ol.name,
        barcode: "—",
        batchNo: "—",
        qty: ol.qty,
        unitPrice,
        lineTotal: formatLineTotal(unitPrice, ol.qty, locale),
      });
      total += unitAmount * ol.qty;
    }
  }

  const totalAmount =
    locale === "en"
      ? total >= 1_000_000
        ? `₫${(total / 1_000_000).toFixed(2)}M`
        : `₫${Math.round(total / 1000)}K`
      : total >= 1_000_000
        ? `₫${(total / 1_000_000).toFixed(1)} tr`
        : `₫${Math.round(total / 1000)} nghìn`;

  return {
    orderCode,
    orderedAt: at,
    channel,
    touchpoint,
    totalAmount,
    lines,
  };
}

function buildExtraLocationPurchases(
  primaryLocationId: string,
  customerId: string,
  locale: Locale,
  channels: { pharmacy: string },
  h: number
): ActivityTemplate[] {
  const otherIds = pickOtherLocationIds(primaryLocationId, customerId, 2);
  const p0 = productAt(h + 5);
  const p1 = productAt(h + 6);
  const outcome =
    locale === "zh"
      ? "完成 · 积分"
      : locale === "en"
        ? "Completed · points"
        : "Hoàn tất · tích điểm";

  return otherIds.map((locId, idx) => ({
    at: touchpointAt(24 + idx * 13, 11 + idx * 2, 15 + idx * 8),
    locationId: locId,
    channel: channels.pharmacy,
    touchpoint: posLabelFor(locId, locale),
    outcome,
    orderLines: [
      {
        productCode: idx === 0 ? p0.productCode : p1.productCode,
        name: idx === 0 ? p0.name : p1.name,
        importPrice: idx === 0 ? p0.importPrice : p1.importPrice,
        qty: idx === 0 ? 1 : 2,
      },
    ],
  }));
}

function buildActivityAndInvoices(
  locationId: string,
  customerId: string,
  locale: Locale
): {
  touchpoints: CustomerActivityTouchpoint[];
  orderInvoices: Record<string, CustomerOrderInvoice>;
  visitedLocations: { locationId: string; locationName: string }[];
} {
  const seed = getLocationSeed(locationId);
  const h = hash(`${locationId}:${customerId}`);
  const posLabel = posLabelFor(locationId, locale);

  const channels =
    locale === "zh"
      ? { pharmacy: "药店", app: "应用", email: "邮件", zalo: "Zalo OA" }
      : locale === "en"
        ? { pharmacy: "Pharmacy", app: "App", email: "Email", zalo: "Zalo OA" }
        : { pharmacy: "Nhà thuốc", app: "Ứng dụng", email: "Email", zalo: "Zalo OA" };

  const p0 = productAt(h);
  const p1 = productAt(h + 1);
  const p2 = productAt(h + 2);
  const p3 = productAt(h + 3);

  const templates: Omit<ActivityTemplate, "locationId">[] =
    locale === "zh"
      ? [
          {
            at: touchpointAt(8, 14, 22),
            channel: channels.pharmacy,
            touchpoint: posLabel,
            outcome: "完成 · 积分",
            orderLines: [
              { productCode: p0.productCode, name: p0.name, importPrice: p0.importPrice, qty: 2 },
              { productCode: p1.productCode, name: p1.name, importPrice: p1.importPrice, qty: 1 },
            ],
          },
          {
            at: touchpointAt(16, 10, 14),
            channel: channels.pharmacy,
            touchpoint: posLabel,
            outcome: "完成 · 积分",
            orderLines: [{ productCode: p0.productCode, name: p0.name, importPrice: p0.importPrice, qty: 2 }],
          },
          {
            at: touchpointAt(30, 15, 2),
            channel: channels.app,
            touchpoint: "会员积分兑换",
            outcome: "兑换成功",
          },
          {
            at: touchpointAt(49, 9, 40),
            channel: channels.email,
            touchpoint: "调研",
            outcome: "已提交反馈",
          },
          {
            at: touchpointAt(67, 18, 22),
            channel: channels.zalo,
            touchpoint: "客服",
            outcome: "SLA 内已回复",
          },
          {
            at: touchpointAt(78, 19, 40),
            channel: channels.pharmacy,
            touchpoint: posLabel,
            outcome: "完成",
            orderLines: [{ productCode: p3.productCode, name: p3.name, importPrice: p3.importPrice, qty: 3 }],
          },
          {
            at: touchpointAt(102, 11, 5),
            channel: channels.pharmacy,
            touchpoint: posLabel,
            outcome: "积分 · 无 ADR",
            orderLines: [{ productCode: p2.productCode, name: p2.name, importPrice: p2.importPrice, qty: 1 }],
          },
        ]
      : locale === "en"
        ? [
            {
              at: touchpointAt(8, 14, 22),
              channel: channels.pharmacy,
              touchpoint: posLabel,
              outcome: "Completed · points",
              orderLines: [
                { productCode: p0.productCode, name: p0.name, importPrice: p0.importPrice, qty: 2 },
                { productCode: p1.productCode, name: p1.name, importPrice: p1.importPrice, qty: 1 },
              ],
            },
            {
              at: touchpointAt(16, 10, 14),
              channel: channels.pharmacy,
              touchpoint: posLabel,
              outcome: "Completed · points earned",
              orderLines: [{ productCode: p0.productCode, name: p0.name, importPrice: p0.importPrice, qty: 2 }],
            },
            {
              at: touchpointAt(30, 15, 2),
              channel: channels.app,
              touchpoint: "Loyalty redemption",
              outcome: "Redeemed successfully",
            },
            {
              at: touchpointAt(49, 9, 40),
              channel: channels.email,
              touchpoint: "Survey",
              outcome: "Feedback submitted",
            },
            {
              at: touchpointAt(67, 18, 22),
              channel: channels.zalo,
              touchpoint: "Customer care",
              outcome: "Replied within SLA",
            },
            {
              at: touchpointAt(78, 19, 40),
              channel: channels.pharmacy,
              touchpoint: posLabel,
              outcome: "Completed",
              orderLines: [{ productCode: p3.productCode, name: p3.name, importPrice: p3.importPrice, qty: 3 }],
            },
            {
              at: touchpointAt(102, 11, 5),
              channel: channels.pharmacy,
              touchpoint: posLabel,
              outcome: "Points · no ADR",
              orderLines: [{ productCode: p2.productCode, name: p2.name, importPrice: p2.importPrice, qty: 1 }],
            },
          ]
        : [
            {
              at: touchpointAt(8, 14, 22),
              channel: channels.pharmacy,
              touchpoint: posLabel,
              outcome: "Hoàn tất · tích điểm",
              orderLines: [
                { productCode: p0.productCode, name: p0.name, importPrice: p0.importPrice, qty: 2 },
                { productCode: p1.productCode, name: p1.name, importPrice: p1.importPrice, qty: 1 },
              ],
            },
            {
              at: touchpointAt(16, 10, 14),
              channel: channels.pharmacy,
              touchpoint: posLabel,
              outcome: "Hoàn tất · tích điểm",
              orderLines: [{ productCode: p0.productCode, name: p0.name, importPrice: p0.importPrice, qty: 2 }],
            },
            {
              at: touchpointAt(30, 15, 2),
              channel: channels.app,
              touchpoint: "Đổi điểm thân thiết",
              outcome: "Đã đổi thành công",
            },
            {
              at: touchpointAt(49, 9, 40),
              channel: channels.email,
              touchpoint: "Khảo sát",
              outcome: "Đã gửi phản hồi",
            },
            {
              at: touchpointAt(67, 18, 22),
              channel: channels.zalo,
              touchpoint: "CSKH",
              outcome: "Đã phản hồi trong SLA",
            },
            {
              at: touchpointAt(78, 19, 40),
              channel: channels.pharmacy,
              touchpoint: posLabel,
              outcome: "Hoàn tất",
              orderLines: [{ productCode: p3.productCode, name: p3.name, importPrice: p3.importPrice, qty: 3 }],
            },
            {
              at: touchpointAt(102, 11, 5),
              channel: channels.pharmacy,
              touchpoint: posLabel,
              outcome: "Tích điểm · không ADR",
              orderLines: [{ productCode: p2.productCode, name: p2.name, importPrice: p2.importPrice, qty: 1 }],
            },
          ];

  const withLocation: ActivityTemplate[] = [
    ...templates.map((tpl) => ({ ...tpl, locationId })),
    ...buildExtraLocationPurchases(locationId, customerId, locale, channels, h),
  ];

  const orderInvoices: Record<string, CustomerOrderInvoice> = {};
  let orderSeq = 0;

  const touchpoints: CustomerActivityTouchpoint[] = withLocation
    .map((tpl, i) => {
      const tplSeed = getLocationSeed(tpl.locationId);
      let orderCode: string | undefined;
      if (tpl.orderLines?.length) {
        orderSeq += 1;
        const dateKey = tpl.at.slice(0, 10).replace(/-/g, "");
        orderCode = `HD-${tplSeed.code}-${dateKey}-${String(orderSeq + (h % 90)).padStart(3, "0")}`;
        orderInvoices[orderCode] = buildOrderInvoice(
          tpl.locationId,
          orderCode,
          tpl.at,
          tpl.channel,
          tpl.touchpoint,
          tpl.orderLines,
          locale
        );
      }
      return {
        id: `tp-${customerId}-${i}`,
        at: tpl.at,
        locationId: tpl.locationId,
        locationName: locationDisplayName(tpl.locationId, locale),
        channel: tpl.channel,
        touchpoint: tpl.touchpoint,
        orderCode,
        outcome: tpl.outcome,
      };
    })
    .sort((a, b) => b.at.localeCompare(a.at));

  const visitedLocations = [...new Map(
    touchpoints
      .filter((tp) => tp.orderCode)
      .map((tp) => [tp.locationId, tp.locationName] as const)
  ).entries()].map(([locId, locName]) => ({
    locationId: locId,
    locationName: locName,
  }));

  return { touchpoints, orderInvoices, visitedLocations };
}

function buildPurchaseSegments(
  customerId: string,
  visits: number,
  locale: Locale
): CustomerPurchaseSegmentRow[] {
  const h = hash(customerId);
  const labels =
    locale === "zh"
      ? ["未开方", "慢病", "礼品", "急救"]
      : locale === "en"
        ? ["OTC only", "Chronic", "Gifting", "Acute"]
        : ["Không kê đơn", "Mạn tính", "Quà tặng", "Cấp cứu"];

  const weights = [
    [44, 28, 18, 10],
    [38, 32, 20, 10],
    [52, 24, 16, 8],
    [30, 35, 22, 13],
    [48, 26, 18, 8],
  ][h % 5];

  const revenueBase = 6 + (visits % 8) + (h % 5);
  const ordersBase = Math.max(4, Math.min(22, visits + (h % 6)));

  return labels.map((segment, i) => ({
    segment,
    weightPct: weights[i],
    labeledRevenueYear: `₫ ${revenueBase + i * 6}M`,
    orders90d: Math.max(1, ordersBase - i * 2),
  }));
}

function buildCohortRetention(locale: Locale): CustomerCohortRow[] {
  if (locale === "zh") {
    return [
      { period: "M+0", retentionPct: 100, note: "首购后基准队列" },
      { period: "M+1", retentionPct: 82, note: "促销结束后小幅下降" },
      { period: "M+2", retentionPct: 71, note: "夏季影响" },
      { period: "M+3", retentionPct: 64, note: "OTC 组稳定" },
      { period: "M+4", retentionPct: 58, note: "关注竞品价格" },
      { period: "M+5", retentionPct: 54, note: "建议留存券" },
    ];
  }
  if (locale === "en") {
    return [
      { period: "M+0", retentionPct: 100, note: "Baseline cohort after first purchase" },
      { period: "M+1", retentionPct: 82, note: "Slight drop after promo ends" },
      { period: "M+2", retentionPct: 71, note: "Hot season effect" },
      { period: "M+3", retentionPct: 64, note: "OTC group stabilizes" },
      { period: "M+4", retentionPct: 58, note: "Monitor competitor pricing" },
      { period: "M+5", retentionPct: 54, note: "Retention voucher proposed" },
    ];
  }
  return [
    { period: "M+0", retentionPct: 100, note: "Cohort gốc sau lần mua đầu" },
    { period: "M+1", retentionPct: 82, note: "Giảm nhẹ sau kết thúc KM" },
    { period: "M+2", retentionPct: 71, note: "Ảnh hưởng mùa nóng" },
    { period: "M+3", retentionPct: 64, note: "Ổn định nhóm OTC" },
    { period: "M+4", retentionPct: 58, note: "Theo dõi đối thủ giá" },
    { period: "M+5", retentionPct: 54, note: "Đề xuất voucher giữ chân" },
  ];
}

function timelineFromTouchpoints(
  touchpoints: CustomerActivityTouchpoint[],
  orderInvoices: Record<string, CustomerOrderInvoice>
): LocationCustomerPurchase[] {
  return touchpoints
    .filter((t) => t.orderCode)
    .map((t, i) => {
      const inv = orderInvoices[t.orderCode!];
      const [datePart, timePart] = t.at.split(" ");
      const [y, m, d] = datePart.split("-");
      return {
        id: `tl-${i}`,
        date: `${d}/${m}/${y}`,
        time: timePart,
        amount: inv?.totalAmount ?? "—",
        items: inv?.lines.map((l) => l.productName).join(", ") ?? t.orderCode!,
        channel: t.touchpoint,
      };
    });
}

function ratingForTier(tier: CustomerTier): { rating: number; ratingLabel: string } {
  if (tier === "gold") return { rating: 4.8, ratingLabel: "Xuất sắc" };
  if (tier === "silver") return { rating: 4.1, ratingLabel: "Tốt" };
  return { rating: 3.6, ratingLabel: "Tiềm năng" };
}

function localizeRating(tier: CustomerTier, locale: Locale): { rating: number; ratingLabel: string } {
  const base = ratingForTier(tier);
  if (locale === "vi") return base;
  if (locale === "en") {
    return {
      rating: base.rating,
      ratingLabel: tier === "gold" ? "Excellent" : tier === "silver" ? "Good" : "Potential",
    };
  }
  return {
    rating: base.rating,
    ratingLabel: tier === "gold" ? "优秀" : tier === "silver" ? "良好" : "潜力",
  };
}

function loyaltySegmentFor(tier: CustomerTier, h: number, locale: Locale): string {
  const idx = tier === "gold" ? 0 : tier === "silver" ? 1 : h % 2 === 0 ? 1 : 2;
  const rows = locale === "zh" ? LOYALTY_BENCHMARKS_ZH : locale === "en" ? LOYALTY_BENCHMARKS_EN : LOYALTY_BENCHMARKS_VI;
  return rows[idx].segment;
}

export function buildLocationCustomerDetail(
  locationId: string,
  summary: LocationSalesCustomer,
  locale: Locale
): LocationCustomerDetail {
  const h = hash(`${locationId}:${summary.id}`);
  const { rating, ratingLabel } = localizeRating(summary.tier, locale);
  const {
    touchpoints: activityTouchpoints,
    orderInvoices,
    visitedLocations,
  } = buildActivityAndInvoices(locationId, summary.id, locale);
  const highlightIdx = summary.tier === "gold" ? 0 : summary.tier === "silver" ? 1 : 2;

  const email =
    locale === "vi"
      ? `${summary.name.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, ".").toLowerCase().slice(0, 12)}@email.com`
      : undefined;

  return {
    id: summary.id,
    locationId,
    name: summary.name,
    phone: summary.phone.includes("***")
      ? `09${12 + (h % 80)} ${(100 + h % 900)} ${(200 + h % 900)}`
      : summary.phone,
    email: summary.id === "c1" ? "lan.phuong@email.com" : email,
    tier: summary.tier,
    tierLabel: summary.tierLabel,
    rating,
    ratingLabel,
    totalSpent: summary.totalSpent,
    visits: summary.visits,
    avgBasket:
      locale === "zh"
        ? `${(h % 5) + 6}0万₫`
        : locale === "en"
          ? `₫${((h % 5) + 7) * 100}K`
          : `₫${((h % 5) + 7) * 100} nghìn`,
    preferredHours: [summary.preferredHour],
    memberSince: ["01/2023", "06/2024", "05/2026", "09/2023", "11/2024"][h % 5],
    loyaltySegment: loyaltySegmentFor(summary.tier, h, locale),
    visitedLocations,
    activityTouchpoints,
    orderInvoices,
    purchaseSegments: buildPurchaseSegments(summary.id, summary.visits, locale),
    cohortRetention: buildCohortRetention(locale),
    loyaltyBenchmarks: loyaltyBenchmarks(locale, highlightIdx),
    timeline: timelineFromTouchpoints(activityTouchpoints, orderInvoices),
    notes:
      locale === "zh"
        ? summary.tier === "gold"
          ? "偏好高端保健品组合，关注效期。"
          : undefined
        : locale === "en"
          ? summary.tier === "gold"
            ? "Prefers premium supplement bundles; watches expiry dates."
            : undefined
          : summary.tier === "gold"
            ? "Ưu tiên combo TPCN cao cấp, hay mua theo mùa."
            : undefined,
  };
}
