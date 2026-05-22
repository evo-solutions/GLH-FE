import type { CustomerSegment } from "@/libs/business-models/config";
import type { LocationSalesCustomer } from "@/types/location";

export interface GlobalCustomerListItem extends LocationSalesCustomer {
  globalId: string;
  locationId: string;
  locationCode: string;
  locationName: string;
  customerSegment?: CustomerSegment;
}
