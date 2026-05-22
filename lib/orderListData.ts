import type { BusinessModelSlug } from "@/libs/business-models/config";
import { isHoldingB2B } from "@/libs/business-models/config";
import { getAllInboundOrderListRows } from "@/lib/inboundOrderData";
import {
  getHoldingInboundOrders,
  HOLDING_CENTRAL_WAREHOUSE_ID,
  HOLDING_WAREHOUSE_LABEL,
} from "@/lib/holdingWarehouseData";
import { getLocationIdsForModel, getLocationSeed } from "@/lib/locationRegistry";
import type { LocationInboundOrder } from "@/types/location";

function parseDateKey(d: string): number {
  const [day, month, year] = d.split("/").map(Number);
  return year * 10000 + month * 100 + day;
}

export function getAllInboundOrdersSorted(
  businessModel?: BusinessModelSlug,
  locale: "vi" | "en" | "zh" = "vi"
): LocationInboundOrder[] {
  if (businessModel && isHoldingB2B(businessModel)) {
    return getHoldingInboundOrders(locale).sort(
      (a, b) => parseDateKey(b.orderedAt) - parseDateKey(a.orderedAt)
    );
  }
  const rows = getAllInboundOrderListRows();
  const filtered = businessModel
    ? rows.filter((r) => getLocationIdsForModel(businessModel).includes(r.locationId))
    : rows;
  return filtered.sort((a, b) => parseDateKey(b.orderedAt) - parseDateKey(a.orderedAt));
}

export function localizeInboundOrders(
  rows: LocationInboundOrder[],
  locale: "vi" | "en" | "zh"
): LocationInboundOrder[] {
  if (locale === "vi") return rows;
  return rows.map((row) => {
    if (row.locationId === HOLDING_CENTRAL_WAREHOUSE_ID) {
      const locationName =
        locale === "zh"
          ? HOLDING_WAREHOUSE_LABEL.zh
          : locale === "en"
            ? HOLDING_WAREHOUSE_LABEL.en
            : HOLDING_WAREHOUSE_LABEL.vi;
      return { ...row, locationName };
    }
    const seed = getLocationSeed(row.locationId);
    const locationName = locale === "zh" ? seed.nameZh : seed.nameEn;
    return { ...row, locationName };
  });
}
