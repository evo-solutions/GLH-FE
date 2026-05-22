import {
  B2B_CUSTOMER_RECORDS,
  segmentTierLabel,
} from "@/lib/b2bCustomerCatalog";
import type { GlobalCustomerListItem } from "@/types/customer";

/** Khách hàng B — phân khúc & danh mục mua theo Holding Bông Sen Vàng (mock). */
export function getB2BCustomers(locale: "vi" | "en" | "zh"): GlobalCustomerListItem[] {
  const holdingName =
    locale === "zh" ? "金莲花控股" : locale === "en" ? "Golden Lotus Holding" : "Bông Sen Vàng Holding";

  return B2B_CUSTOMER_RECORDS.map((r) => ({
    id: r.id,
    globalId: `holding-bsv__${r.id}`,
    locationId: "holding-bsv",
    locationCode: "BSV-HQ",
    locationName: holdingName,
    customerSegment: "B" as const,
    name: locale === "zh" ? r.nameZh : locale === "en" ? r.nameEn : r.nameVi,
    phone: r.phone,
    tier: r.tier,
    tierLabel: segmentTierLabel(r, locale),
    lastVisit: r.lastVisit,
    totalSpent: locale === "zh" ? r.totalSpendZh : locale === "en" ? r.totalSpendEn : r.totalSpendVi,
    visits: r.visits,
    preferredHour: "—",
  }));
}

export function getB2BCustomerDisplayName(
  customerId: string,
  locale: "vi" | "en" | "zh"
): string {
  const row = B2B_CUSTOMER_RECORDS.find((r) => r.id === customerId);
  if (!row) return customerId;
  return locale === "zh" ? row.nameZh : locale === "en" ? row.nameEn : row.nameVi;
}
