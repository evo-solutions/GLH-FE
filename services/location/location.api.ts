export const LOCATION_API = {
  list: "/api/v1/locations",
  meta: (id: string) => `/api/v1/locations/${id}`,
  overview: (id: string) => `/api/v1/locations/${id}/overview`,
  staffCosts: (id: string) => `/api/v1/locations/${id}/staff-costs`,
  sales: (id: string) => `/api/v1/locations/${id}/sales`,
  customer: (id: string, customerId: string) =>
    `/api/v1/locations/${id}/customers/${customerId}`,
  warehouse: (id: string) => `/api/v1/locations/${id}/warehouse`,
  inboundOrder: (locationId: string, orderId: string) =>
    `/api/v1/locations/${locationId}/inbound-orders/${orderId}`,
} as const;
