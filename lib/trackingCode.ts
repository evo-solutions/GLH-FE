import { getLocationSeed } from "@/lib/locationRegistry";

export function getLocationStoreCode(locationId: string): string {
  return getLocationSeed(locationId).code;
}

export function buildTrackingCode(productCode: string, locationId: string): string {
  const suffix = productCode.trim().replace(/^BSV-/i, "");
  const prefix = getLocationSeed(locationId).trackingPrefix;
  return `${prefix}-${suffix}`;
}
