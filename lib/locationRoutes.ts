import { withModulePrefix } from "@/libs/business-modules/paths";

export function locationListPath(moduleBasePath?: string) {
  return withModulePrefix(moduleBasePath, "/location");
}

export function locationDetailPath(
  locationId: string,
  tab?: string,
  moduleBasePath?: string,
) {
  const base = withModulePrefix(moduleBasePath, `/location/${locationId}`);
  return tab ? `${base}?tab=${tab}` : base;
}

export function locationCustomerPath(
  locationId: string,
  customerId: string,
  moduleBasePath?: string,
) {
  return withModulePrefix(
    moduleBasePath,
    `/location/${locationId}/customer/${customerId}`,
  );
}
