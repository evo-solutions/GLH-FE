import { CENTRAL_WAREHOUSE } from "@/lib/centralWarehouse";
import { productInstanceImageDataUrl } from "@/lib/productInstanceImage";
import { LOCATION_SEEDS } from "@/lib/locationRegistry";
import type { ProductUnitInstance } from "@/types/product";

const ACTIVE_LOCATIONS = LOCATION_SEEDS.filter((s) => s.status === "active");

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function addDays(d: Date, days: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function ean13(productCode: string, index: number): string {
  const suffix = productCode.replace(/^BSV-/i, "").replace(/\D/g, "").padStart(4, "0").slice(-4);
  const body = `893${suffix}${String(index).padStart(5, "0")}`.slice(0, 12);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const n = Number(body[i]);
    sum += i % 2 === 0 ? n : n * 3;
  }
  const check = (10 - (sum % 10)) % 10;
  return `${body}${check}`;
}

function batchNo(productCode: string, imported: Date, index: number): string {
  const y = imported.getFullYear();
  const m = pad2(imported.getMonth() + 1);
  const suffix = productCode.replace(/^BSV-/i, "");
  return `LOT-${suffix}-${y}${m}-${String(index).padStart(4, "0")}`;
}

export interface BuildProductInstancesOptions {
  maxRows?: number;
  sellPrice?: string;
  importPrice?: string;
  /** Tỷ lệ đơn vị còn ở kho tổng (0–1). */
  centralRatio?: number;
}

export function buildProductInstances(
  productCode: string,
  count: number,
  options?: BuildProductInstancesOptions
): ProductUnitInstance[] {
  const maxRows = options?.maxRows ?? 80;
  const total = Math.max(0, Math.min(count, maxRows));
  const sellPrice = options?.sellPrice ?? "—";
  const importPrice = options?.importPrice ?? "—";
  const centralRatio =
    options?.centralRatio ?? (productCode === "BSV-COV19" ? 0.35 : productCode === "BSV-7022" ? 0 : 0.2);
  const base = hash(productCode);
  const centralThreshold = Math.round(centralRatio * 1000);

  return Array.from({ length: total }, (_, i) => {
    const idx = i + 1;
    const imported = addDays(new Date(2025, 10, 1), (base % 40) + i * 3);
    const shelfLife = productCode === "BSV-COV19" ? 730 : productCode === "BSV-2281" ? 540 : 365;
    const expires = addDays(imported, shelfLife - (i % 45));
    const nearExpiry = expires.getTime() - Date.now() < 90 * 24 * 60 * 60 * 1000;
    const opened = i % 17 === 0;

    const atCentral =
      ACTIVE_LOCATIONS.length === 0 ||
      hash(`${productCode}:${idx}`) % 1000 < centralThreshold;
    const loc = atCentral ? null : ACTIVE_LOCATIONS[(base + idx) % ACTIVE_LOCATIONS.length];
    const placement = atCentral ? "central" : "location";
    const locationId = loc?.id ?? null;
    const locationCode = atCentral ? CENTRAL_WAREHOUSE.code : loc!.code;
    const locationName = atCentral ? CENTRAL_WAREHOUSE.nameVi : loc!.nameVi;

    return {
      id: `${productCode}-${String(idx).padStart(5, "0")}`,
      barcode: ean13(productCode, idx),
      batchNo: batchNo(productCode, imported, idx),
      imageUrl: productInstanceImageDataUrl(productCode, idx),
      importedAt: formatDate(imported),
      expiresAt: formatDate(expires),
      importPrice,
      sellPrice,
      condition: opened ? "opened" : "sealed",
      conditionLabel: opened ? "Đã mở niêm" : "Nguyên seal",
      placement,
      locationId,
      locationName,
      locationCode,
      status: nearExpiry ? "near_expiry" : "ok",
      statusLabel: nearExpiry ? "Sắp hết hạn" : "Còn hạn",
    };
  });
}

export function localizeProductInstances(
  instances: ProductUnitInstance[],
  locale: "vi" | "en" | "zh"
): ProductUnitInstance[] {
  if (locale === "vi") return instances;

  return instances.map((row) => {
    const loc =
      row.locationId != null ? LOCATION_SEEDS.find((s) => s.id === row.locationId) : undefined;
    const centralName =
      locale === "zh" ? CENTRAL_WAREHOUSE.nameZh : CENTRAL_WAREHOUSE.nameEn;
    const locationName =
      row.placement === "central"
        ? centralName
        : locale === "zh"
          ? loc?.nameZh ?? row.locationName
          : loc?.nameEn ?? row.locationName;

    const conditionLabel =
      row.condition === "opened"
        ? locale === "zh"
          ? "已开封"
          : "Seal broken"
        : locale === "zh"
          ? "原封"
          : "Sealed";

    const statusLabel =
      row.status === "near_expiry"
        ? locale === "zh"
          ? "临近效期"
          : "Near expiry"
        : row.status === "expired"
          ? locale === "zh"
            ? "已过期"
            : "Expired"
          : locale === "zh"
            ? "在效期内"
            : "In date";

    return { ...row, locationName, conditionLabel, statusLabel };
  });
}
