export function locationDetailPath(locationId: string, tab?: string) {
  const base = `/location/${locationId}`;
  return tab ? `${base}?tab=${tab}` : base;
}

export function locationCustomerPath(locationId: string, customerId: string) {
  return `/location/${locationId}/customer/${customerId}`;
}
