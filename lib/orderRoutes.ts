import type { BusinessModelSlug } from "@/libs/business-models/config";
import { modelOrderDetailPath } from "@/lib/businessModelRoutes";
import { DEFAULT_RETAIL_MODEL } from "@/libs/business-models/config";

export function orderDetailPath(
  orderId: string,
  businessModel: BusinessModelSlug = DEFAULT_RETAIL_MODEL
) {
  return modelOrderDetailPath(businessModel, orderId);
}
