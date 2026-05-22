import type { BusinessModelSlug } from "@/libs/business-models/config";
import {
  modelProductDetailPath,
  modelProductInboundOrderPath,
} from "@/lib/businessModelRoutes";
import { DEFAULT_SUBSIDIARY_SLUG } from "@/libs/business-models/config";

export function productDetailPath(
  productCode: string,
  businessModel: BusinessModelSlug = DEFAULT_SUBSIDIARY_SLUG
) {
  return modelProductDetailPath(businessModel, productCode);
}

export function productInboundOrderPath(
  productCode: string,
  locationId: string,
  orderId: string,
  businessModel: BusinessModelSlug = DEFAULT_SUBSIDIARY_SLUG
) {
  return modelProductInboundOrderPath(
    businessModel,
    productCode,
    locationId,
    orderId
  );
}
