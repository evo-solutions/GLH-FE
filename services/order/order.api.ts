export const ORDER_API = {
  list: "/api/v1/orders",
  detail: (orderId: string) => `/api/v1/orders/${orderId}`,
} as const;
