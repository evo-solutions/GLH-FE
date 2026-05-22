import {
  B2B_CUSTOMER_RECORDS,
  getB2BCustomerRecord,
  getB2BProductLinesForSegment,
  getB2BSegment,
  productLineLabel,
  segmentLabel,
  segmentTierLabel,
  type B2BProductLine,
} from "@/lib/b2bCustomerCatalog";
import type {
  CustomerActivityTouchpoint,
  CustomerOrderInvoice,
  CustomerOrderInvoiceLine,
  CustomerPurchaseSegmentRow,
  LocationCustomerDetail,
  LocationSalesCustomer,
} from "@/types/location";

type Locale = "vi" | "en" | "zh";

function tierLabelVi(tier: LocationSalesCustomer["tier"]): string {
  if (tier === "gold") return "Vàng";
  if (tier === "silver") return "Bạc";
  return "Đồng";
}

function tierLabelEn(tier: LocationSalesCustomer["tier"]): string {
  if (tier === "gold") return "Gold";
  if (tier === "silver") return "Silver";
  return "Bronze";
}

function tierLabelZh(tier: LocationSalesCustomer["tier"]): string {
  if (tier === "gold") return "金牌";
  if (tier === "silver") return "银牌";
  return "铜牌";
}

function formatLineTotal(unitPrice: string, qty: number, locale: Locale): string {
  const digits = unitPrice.replace(/[^\d]/g, "");
  const unit = Number(digits) || 50_000;
  const amount = unit * qty;
  if (locale === "en") {
    if (amount >= 1_000_000_000) return `₫${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(1)}M`;
    return `₫${Math.round(amount / 1000)}K`;
  }
  if (amount >= 1_000_000_000) return `₫${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(1)} tr`;
  return `₫${Math.round(amount / 1000)} nghìn`;
}

function buildPurchaseSegments(
  lines: B2BProductLine[],
  locale: Locale
): CustomerPurchaseSegmentRow[] {
  const n = lines.length;
  const base = Math.floor(100 / n);
  let remainder = 100 - base * n;
  return lines.map((line, i) => {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    const weightPct = base + extra;
    return {
      segment: productLineLabel(line, locale),
      weightPct,
      labeledRevenueYear:
        locale === "en"
          ? `₫ ${(weightPct * 0.12).toFixed(1)}M`
          : locale === "zh"
            ? `${(weightPct * 0.15).toFixed(1)}亿₫`
            : `₫ ${(weightPct * 0.18).toFixed(1)} tỷ`,
      orders90d: Math.max(2, Math.round(weightPct / 8)),
    };
  });
}

function buildB2BOrderInvoices(
  customerId: string,
  lines: B2BProductLine[],
  locale: Locale
): {
  touchpoints: CustomerActivityTouchpoint[];
  orderInvoices: Record<string, CustomerOrderInvoice>;
} {
  const touchpoints: CustomerActivityTouchpoint[] = [];
  const orderInvoices: Record<string, CustomerOrderInvoice> = {};
  const holdingName =
    locale === "zh" ? "金莲花控股" : locale === "en" ? "Golden Lotus Holding" : "Bông Sen Vàng Holding";

  const orderTemplates = [
    { daysAgo: 3, lineCount: Math.min(3, lines.length) },
    { daysAgo: 12, lineCount: Math.min(2, lines.length) },
    { daysAgo: 28, lineCount: Math.min(4, lines.length) },
  ];

  orderTemplates.forEach((tpl, orderIdx) => {
    const orderCode = `SO-BSV-${customerId.toUpperCase().replace(/-/g, "")}-2026-${String(orderIdx + 1).padStart(3, "0")}`;
    const d = new Date(2026, 4, 18);
    d.setDate(d.getDate() - tpl.daysAgo);
    const at = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} 10:30`;

    const invoiceLines: CustomerOrderInvoiceLine[] = [];
    for (let i = 0; i < tpl.lineCount; i++) {
      const line = lines[i % lines.length];
      const qty = 20 + orderIdx * 15 + i * 10;
      invoiceLines.push({
        id: `${orderCode}-${line.productCode}`,
        productCode: line.productCode,
        productName: productLineLabel(line, locale),
        barcode: "—",
        batchNo: `L${2026}${String(orderIdx + 1).padStart(2, "0")}`,
        qty,
        unitPrice: line.unitPriceVi,
        lineTotal: formatLineTotal(line.unitPriceVi, qty, locale),
      });
    }

    const totalAmount = invoiceLines.reduce((sum, l) => {
      const digits = l.lineTotal.replace(/[^\d.]/g, "");
      return sum + (Number(digits) || 0);
    }, 0);

    const totalDisplay =
      locale === "en"
        ? totalAmount >= 1_000_000
          ? `₫${(totalAmount / 1_000_000).toFixed(1)}M`
          : `₫${Math.round(totalAmount / 1000)}K`
        : totalAmount >= 1_000_000
          ? `₫${(totalAmount / 1_000_000).toFixed(1)} tr`
          : `₫${Math.round(totalAmount / 1000)} nghìn`;

    const channel =
      locale === "zh" ? "B2B 销售" : locale === "en" ? "B2B sales" : "Bán buôn B2B";

    orderInvoices[orderCode] = {
      orderCode,
      orderedAt: at,
      channel,
      touchpoint: holdingName,
      totalAmount: totalDisplay,
      lines: invoiceLines,
    };

    touchpoints.push({
      id: `tp-${customerId}-${orderIdx}`,
      at,
      locationId: "holding-bsv",
      locationName: holdingName,
      channel,
      touchpoint: holdingName,
      orderCode,
      outcome:
        locale === "zh"
          ? "已确认 · 待发货"
          : locale === "en"
            ? "Confirmed · pending shipment"
            : "Đã xác nhận · chờ xuất kho",
    });
  });

  return { touchpoints, orderInvoices };
}

export function buildB2BCustomerDetail(
  customerId: string,
  locale: Locale
): LocationCustomerDetail {
  const record = getB2BCustomerRecord(customerId) ?? B2B_CUSTOMER_RECORDS[0];
  const segment = getB2BSegment(record.segmentKey);
  const productLines = getB2BProductLinesForSegment(record.segmentKey);
  const { touchpoints, orderInvoices } = buildB2BOrderInvoices(customerId, productLines, locale);

  const name = locale === "zh" ? record.nameZh : locale === "en" ? record.nameEn : record.nameVi;
  const tierLabel =
    locale === "zh" ? tierLabelZh(record.tier) : locale === "en" ? tierLabelEn(record.tier) : tierLabelVi(record.tier);
  const segmentTypeLabel = segmentTierLabel(record, locale);
  const catalogList = productLines.map((l) => productLineLabel(l, locale)).join(" · ");

  const notes =
    locale === "zh"
      ? `客户类型：${segmentTypeLabel}。可采购品类：${catalogList}。`
      : locale === "en"
        ? `Segment: ${segmentTypeLabel}. Allowed catalog: ${catalogList}.`
        : `Loại KH: ${segmentTypeLabel}. Hàng được phép mua: ${catalogList}.`;

  const timeline = touchpoints
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
        channel: t.channel,
      };
    });

  const rating = record.tier === "gold" ? 4.9 : record.tier === "silver" ? 4.2 : 3.8;
  const ratingLabel =
    locale === "zh"
      ? record.tier === "gold"
        ? "战略客户"
        : "良好"
      : locale === "en"
        ? record.tier === "gold"
          ? "Strategic"
          : "Good"
        : record.tier === "gold"
          ? "Chiến lược"
          : "Tốt";

  return {
    id: record.id,
    locationId: "holding-bsv",
    name,
    phone: record.phone,
    email: `${record.id.replace(/-/g, "")}@b2b.bongsen.vn`,
    tier: record.tier,
    tierLabel: segmentTypeLabel,
    rating,
    ratingLabel,
    totalSpent:
      locale === "zh" ? record.totalSpendZh : locale === "en" ? record.totalSpendEn : record.totalSpendVi,
    visits: record.visits,
    avgBasket:
      locale === "zh"
        ? "₫120万"
        : locale === "en"
          ? "₫85M"
          : "₫85 tr",
    preferredHours: ["B2B"],
    memberSince: "01/2024",
    loyaltySegment: segmentLabel(segment, locale),
    visitedLocations: [
      {
        locationId: "holding-bsv",
        locationName:
          locale === "zh" ? "金莲花控股" : locale === "en" ? "Golden Lotus Holding" : "Bông Sen Vàng Holding",
      },
    ],
    activityTouchpoints: touchpoints.sort((a, b) => b.at.localeCompare(a.at)),
    orderInvoices,
    purchaseSegments: buildPurchaseSegments(productLines, locale),
    cohortRetention: [],
    loyaltyBenchmarks: [],
    timeline,
    notes,
  };
}
