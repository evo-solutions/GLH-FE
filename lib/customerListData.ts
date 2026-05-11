import { buildSalesCustomersForLocation } from "@/lib/customerDetailData";
import { getLocationSeed, LOCATION_IDS } from "@/lib/locationRegistry";
import { globalCustomerId } from "@/lib/customerRoutes";
import type { GlobalCustomerListItem } from "@/types/customer";

function parseDateKey(d: string): number {
  const normalized = d.replace(/\//g, "/");
  const parts = normalized.split("/").map(Number);
  if (parts.length !== 3) return 0;
  const [day, month, year] = parts;
  return year * 10000 + month * 100 + day;
}

export function getAllGlobalCustomers(locale: "vi" | "en" | "zh"): GlobalCustomerListItem[] {
  const rows: GlobalCustomerListItem[] = [];

  for (const locationId of LOCATION_IDS) {
    const seed = getLocationSeed(locationId);
    const locationName = locale === "zh" ? seed.nameZh : locale === "en" ? seed.nameEn : seed.nameVi;
    const customers = buildSalesCustomersForLocation(locationId, locale);

    for (const c of customers) {
      rows.push({
        ...c,
        globalId: globalCustomerId(locationId, c.id),
        locationId,
        locationCode: seed.code,
        locationName,
      });
    }
  }

  return rows.sort((a, b) => parseDateKey(b.lastVisit) - parseDateKey(a.lastVisit));
}
