import { getAllInboundOrderListRows } from "@/lib/inboundOrderData";
import { getLocationSeed } from "@/lib/locationRegistry";
import type { LocationInboundOrder } from "@/types/location";

function parseDateKey(d: string): number {
  const [day, month, year] = d.split("/").map(Number);
  return year * 10000 + month * 100 + day;
}

export function getAllInboundOrdersSorted(): LocationInboundOrder[] {
  return getAllInboundOrderListRows().sort(
    (a, b) => parseDateKey(b.orderedAt) - parseDateKey(a.orderedAt)
  );
}

export function localizeInboundOrders(
  rows: LocationInboundOrder[],
  locale: "vi" | "en" | "zh"
): LocationInboundOrder[] {
  if (locale === "vi") return rows;
  return rows.map((row) => {
    const seed = getLocationSeed(row.locationId);
    const locationName = locale === "zh" ? seed.nameZh : seed.nameEn;
    return { ...row, locationName };
  });
}
