import {
  B2B_CUSTOMER_RECORDS,
  getB2BSegment,
  segmentLabel,
  segmentTierLabel,
  type B2BCustomerSegmentKey,
} from "@/lib/b2bCustomerCatalog";
import type { GlobalCustomerListItem } from "@/types/customer";

function mapB2BRecord(
  r: (typeof B2B_CUSTOMER_RECORDS)[number],
  locale: "vi" | "en" | "zh",
  locationName: string
): GlobalCustomerListItem {
  return {
    id: r.id,
    globalId: `holding-bsv__${r.id}`,
    locationId: "holding-bsv",
    locationCode: "BSV-HQ",
    locationName,
    customerSegment: "B" as const,
    name: locale === "zh" ? r.nameZh : locale === "en" ? r.nameEn : r.nameVi,
    phone: r.phone,
    tier: r.tier,
    tierLabel: segmentTierLabel(r, locale),
    lastVisit: r.lastVisit,
    totalSpent: locale === "zh" ? r.totalSpendZh : locale === "en" ? r.totalSpendEn : r.totalSpendVi,
    visits: r.visits,
    preferredHour: "—",
  };
}

/** Khách hàng B — tổng hợp Holding Bông Sen Vàng (mock). */
export function getB2BCustomers(locale: "vi" | "en" | "zh"): GlobalCustomerListItem[] {
  const holdingName =
    locale === "zh" ? "金莲花控股" : locale === "en" ? "Golden Lotus Holding" : "Bông Sen Vàng Holding";

  return B2B_CUSTOMER_RECORDS.map((r) => mapB2BRecord(r, locale, holdingName));
}

/** Khách B thuộc một kênh B2B (module sidebar cùng cấp cty con). */
export function getB2BCustomersForSegment(
  locale: "vi" | "en" | "zh",
  segmentKey: B2BCustomerSegmentKey
): GlobalCustomerListItem[] {
  const segment = getB2BSegment(segmentKey);
  const locationName = segmentLabel(segment, locale);

  const extraForSegment: Partial<
    Record<
      B2BCustomerSegmentKey,
      { id: string; nameVi: string; nameEn: string; nameZh: string; tier: "silver" | "bronze" }[]
    >
  > = {
    "hospital-tcm": [
      {
        id: "b2b-hospital-q7",
        nameVi: "BV YHCT Quận 7",
        nameEn: "District 7 TCM Hospital",
        nameZh: "第七区中医医院",
        tier: "silver",
      },
    ],
    pharmacy: [
      {
        id: "b2b-pharmacy-lc",
        nameVi: "Nhà thuốc Long Châu · Q1",
        nameEn: "Long Chau Pharmacy · D1",
        nameZh: "长龙药店 · 第一区",
        tier: "bronze",
      },
    ],
    "distributor-mt": [
      {
        id: "b2b-dist-win",
        nameVi: "WinCommerce · MT",
        nameEn: "WinCommerce · MT",
        nameZh: "WinCommerce · MT",
        tier: "silver",
      },
    ],
    import: [
      {
        id: "b2b-import-tw",
        nameVi: "NCC Đài Loan · Thuốc YHCT",
        nameEn: "Taiwan supplier · TCM",
        nameZh: "台湾供应商 · 中成药",
        tier: "silver",
      },
    ],
  };

  const primary = B2B_CUSTOMER_RECORDS.filter((r) => r.segmentKey === segmentKey);
  const rows = primary.map((r) => mapB2BRecord(r, locale, locationName));

  for (const ex of extraForSegment[segmentKey] ?? []) {
    rows.push({
      id: ex.id,
      globalId: `holding-bsv__${ex.id}`,
      locationId: "holding-bsv",
      locationCode: "BSV-HQ",
      locationName,
      customerSegment: "B",
      name: locale === "zh" ? ex.nameZh : locale === "en" ? ex.nameEn : ex.nameVi,
      phone: "—",
      tier: ex.tier,
      tierLabel: segmentLabel(segment, locale),
      lastVisit: "15/05/2026",
      totalSpent: locale === "zh" ? "₫420 tr" : locale === "en" ? "₫420M" : "₫420 tr",
      visits: 12,
      preferredHour: "—",
    });
  }

  return rows;
}

export function getB2BCustomerDisplayName(
  customerId: string,
  locale: "vi" | "en" | "zh"
): string {
  const row = B2B_CUSTOMER_RECORDS.find((r) => r.id === customerId);
  if (row) {
    return locale === "zh" ? row.nameZh : locale === "en" ? row.nameEn : row.nameVi;
  }
  return customerId;
}
