import type { BusinessModelSlug } from "@/libs/business-models/config";
import { modelCustomerDetailPath } from "@/lib/businessModelRoutes";
import { DEFAULT_RETAIL_MODEL } from "@/libs/business-models/config";

const GLOBAL_CUSTOMER_SEP = "__";

export function globalCustomerId(locationId: string, customerId: string) {
  return `${locationId}${GLOBAL_CUSTOMER_SEP}${customerId}`;
}

export function parseGlobalCustomerId(globalId: string): {
  locationId: string;
  customerId: string;
} | null {
  const idx = globalId.indexOf(GLOBAL_CUSTOMER_SEP);
  if (idx <= 0) return null;
  return {
    locationId: globalId.slice(0, idx),
    customerId: globalId.slice(idx + GLOBAL_CUSTOMER_SEP.length),
  };
}

export function customerDetailPath(
  locationId: string,
  customerId: string,
  businessModel: BusinessModelSlug = DEFAULT_RETAIL_MODEL
) {
  return modelCustomerDetailPath(businessModel, globalCustomerId(locationId, customerId));
}
