import { buildSalesCustomersForLocation } from "@/lib/customerDetailData";
import { getB2BCustomers } from "@/lib/b2bCustomerListData";
import type { BusinessModelSlug, CustomerSegment } from "@/libs/business-models/config";
import { getB2BSegmentKeyForModel } from "@/libs/business-models/config";
import { getB2BCustomersForSegment } from "@/lib/b2bCustomerListData";
import { getLocationSeed, getLocationIdsForModel, LOCATION_IDS } from "@/lib/locationRegistry";
import { globalCustomerId } from "@/lib/customerRoutes";
import type { GlobalCustomerListItem } from "@/types/customer";

function parseDateKey(d: string): number {
  const normalized = d.replace(/\//g, "/");
  const parts = normalized.split("/").map(Number);
  if (parts.length !== 3) return 0;
  const [day, month, year] = parts;
  return year * 10000 + month * 100 + day;
}

export function getAllGlobalCustomers(
  locale: "vi" | "en" | "zh",
  options?: {
    businessModel?: BusinessModelSlug;
    segment?: CustomerSegment;
  }
): GlobalCustomerListItem[] {
  const channelSegment = options?.businessModel
    ? getB2BSegmentKeyForModel(options.businessModel)
    : undefined;
  if (channelSegment) {
    return getB2BCustomersForSegment(locale, channelSegment);
  }

  if (options?.businessModel === "bong-sen-vang" || options?.segment === "B") {
    return getB2BCustomers(locale);
  }

  const rows: GlobalCustomerListItem[] = [];
  const locationIds = options?.businessModel
    ? getLocationIdsForModel(options.businessModel)
    : LOCATION_IDS;

  for (const locationId of locationIds) {
    const seed = getLocationSeed(locationId);
    const locationName = locale === "zh" ? seed.nameZh : locale === "en" ? seed.nameEn : seed.nameVi;
    const customers = buildSalesCustomersForLocation(locationId, locale);

    for (const c of customers) {
      const segment: CustomerSegment = "C";
      if (options?.segment && options.segment !== segment) continue;
      rows.push({
        ...c,
        globalId: globalCustomerId(locationId, c.id),
        locationId,
        locationCode: seed.code,
        locationName,
        customerSegment: segment,
      });
    }
  }

  return rows.sort((a, b) => parseDateKey(b.lastVisit) - parseDateKey(a.lastVisit));
}
