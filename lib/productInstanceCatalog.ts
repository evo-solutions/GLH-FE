import { buildProductInstances, type BuildProductInstancesOptions } from "@/lib/productInstances";
import type { ProductUnitInstance } from "@/types/product";

export interface InstanceProductSpec {
  productCode: string;
  name: string;
  category: string;
  sellPrice: string;
  importPrice: string;
  poolSize: number;
  centralRatio: number;
}

/** Sản phẩm có đơn vị tồn vật lý — dùng chung product detail & kho cơ sở. */
export const INSTANCE_PRODUCT_SPECS: InstanceProductSpec[] = [
  {
    productCode: "BSV-COV19",
    name: "Vaccine Covid Vietnam",
    category: "Vaccine",
    sellPrice: "₫185,000",
    importPrice: "₫142,000",
    poolSize: 200,
    centralRatio: 0.35,
  },
  {
    productCode: "BSV-4412",
    name: "Omega-3 Premium 60v",
    category: "TPCN",
    sellPrice: "₫420,000",
    importPrice: "₫268,000",
    poolSize: 160,
    centralRatio: 0.18,
  },
  {
    productCode: "BSV-2281",
    name: "Vitamin C 1000mg",
    category: "Vitamin",
    sellPrice: "₫185,000",
    importPrice: "₫92,000",
    poolSize: 120,
    centralRatio: 0.2,
  },
  {
    productCode: "BSV-9033",
    name: "Collagen Peptide",
    category: "Làm đẹp",
    sellPrice: "₫560,000",
    importPrice: "₫340,000",
    poolSize: 80,
    centralRatio: 0.22,
  },
  {
    productCode: "BSV-7710",
    name: "Men vi sinh 30g",
    category: "Tiêu hóa",
    sellPrice: "₫295,000",
    importPrice: "₫168,000",
    poolSize: 100,
    centralRatio: 0.2,
  },
];

let poolsCache: Map<string, ProductUnitInstance[]> | null = null;

function specFor(productCode: string): InstanceProductSpec | undefined {
  return INSTANCE_PRODUCT_SPECS.find((s) => s.productCode === productCode);
}

function buildPool(spec: InstanceProductSpec): ProductUnitInstance[] {
  return buildProductInstances(spec.productCode, spec.poolSize, {
    maxRows: spec.poolSize,
    sellPrice: spec.sellPrice,
    importPrice: spec.importPrice,
    centralRatio: spec.centralRatio,
  });
}

function ensurePools(): Map<string, ProductUnitInstance[]> {
  if (poolsCache) return poolsCache;
  poolsCache = new Map();
  for (const spec of INSTANCE_PRODUCT_SPECS) {
    poolsCache.set(spec.productCode, buildPool(spec));
  }
  return poolsCache;
}

export function getProductInstancePool(productCode: string): ProductUnitInstance[] {
  const spec = specFor(productCode);
  if (!spec) {
    return buildProductInstances(productCode, 80, { maxRows: 80, centralRatio: 0.2 });
  }
  return ensurePools().get(productCode) ?? buildPool(spec);
}

export function getProductDetailInstances(
  productCode: string,
  _totalStock: number,
  options?: BuildProductInstancesOptions
): ProductUnitInstance[] {
  const maxRows = options?.maxRows ?? 60;
  const pool = getProductInstancePool(productCode);
  const spec = specFor(productCode);

  if (pool.length > 0) {
    return pool.slice(0, Math.min(maxRows, pool.length));
  }

  return buildProductInstances(productCode, maxRows, {
    sellPrice: options?.sellPrice ?? spec?.sellPrice,
    importPrice: options?.importPrice ?? spec?.importPrice,
    centralRatio: options?.centralRatio ?? spec?.centralRatio ?? 0.2,
    maxRows,
  });
}

export function countUnitsAtLocation(locationId: string, productCode: string): number {
  return getProductInstancePool(productCode).filter((u) => u.locationId === locationId).length;
}

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Đơn vị vật lý gắn với một dòng đơn nhập — chọn ổn định theo order + SKU + cơ sở. */
export function getInboundOrderProductUnits(
  locationId: string,
  orderId: string,
  productCode: string,
  qty: number
): ProductUnitInstance[] {
  if (qty <= 0) return [];

  const pool = getProductInstancePool(productCode)
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));
  if (pool.length === 0) return [];

  const atLocation = pool.filter((u) => u.locationId === locationId);
  const source = atLocation.length >= qty ? atLocation : pool;

  const key = `${orderId}:${productCode}:${locationId}`;
  const start = hashKey(key) % Math.max(1, source.length - qty + 1);
  return source.slice(start, start + qty);
}
