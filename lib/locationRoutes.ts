import {
  DEFAULT_RETAIL_MODEL,
  type BusinessModelSlug,
} from "@/libs/business-models/config";
import {
  modelLocationCustomerPath,
  modelLocationDetailPath,
  modelLocationListPath,
} from "@/lib/businessModelRoutes";

/** @deprecated Prefer modelLocationListPath(slug) */
export function locationListPath(model: BusinessModelSlug = DEFAULT_RETAIL_MODEL) {
  return modelLocationListPath(model);
}

export function locationDetailPath(
  locationId: string,
  tab?: string,
  model: BusinessModelSlug = DEFAULT_RETAIL_MODEL
) {
  return modelLocationDetailPath(model, locationId, tab);
}

export function locationCustomerPath(
  locationId: string,
  customerId: string,
  model: BusinessModelSlug = DEFAULT_RETAIL_MODEL
) {
  return modelLocationCustomerPath(model, locationId, customerId);
}
