import { buildTrackingCode } from "@/lib/trackingCode";

export function mockLineItem(
  locationId: string,
  productCode: string,
  name: string,
  qty: number,
  unitPrice: string,
  lineTotal: string
) {
  return {
    productCode,
    trackingCode: buildTrackingCode(productCode, locationId),
    name,
    qty,
    unitPrice,
    lineTotal,
  };
}

export function mockReturnLine(
  locationId: string,
  productCode: string,
  name: string,
  qty: number
) {
  return {
    productCode,
    trackingCode: buildTrackingCode(productCode, locationId),
    name,
    qty,
  };
}

export function mockStockItem(
  locationId: string,
  id: string,
  productCode: string,
  name: string,
  category: string,
  sellPrice: string,
  importPrice: string,
  stock: number,
  minStock: number,
  status: "ok" | "low" | "out",
  statusLabel: string
) {
  return {
    id,
    productCode,
    name,
    category,
    sellPrice,
    importPrice,
    stock,
    minStock,
    status,
    statusLabel,
  };
}
