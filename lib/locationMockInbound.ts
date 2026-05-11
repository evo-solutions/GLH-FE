import { mockLineItem, mockReturnLine } from "@/lib/locationMockItems";

const INBOUND_LOC = "loc-hcm-1";

export function mockInboundLine(
  productCode: string,
  name: string,
  qty: number,
  unitPrice: string,
  lineTotal: string
) {
  return mockLineItem(INBOUND_LOC, productCode, name, qty, unitPrice, lineTotal);
}

export function mockInboundReturn(productCode: string, name: string, qty: number) {
  return mockReturnLine(INBOUND_LOC, productCode, name, qty);
}
