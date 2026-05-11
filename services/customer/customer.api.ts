export const CUSTOMER_API = {
  list: "/api/v1/customers",
  detail: (globalId: string) => `/api/v1/customers/${globalId}`,
} as const;
