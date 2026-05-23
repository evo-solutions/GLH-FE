import type { SupplyDetailTab, SupplyInfoSection } from "@/types/supply-source";

export const SUPPLY_DETAIL_TAB_SECTIONS: Record<SupplyDetailTab, SupplyInfoSection[]> = {
  regionPartner: ["location", "enterprise"],
  cultivation: ["soilClimate", "species", "harvestYield"],
  logisticsPrice: ["processingLogistics", "pricingTerms"],
};

const FIELD_PLQ_SUFFIX: Record<string, string> = {
  addr: "LOC",
  area: "ARE",
  alt: "ALT",
  coord: "GPS",
  org: "ORG",
  rep: "REP",
  license: "LIC",
  contact: "CTC",
  soil: "SOL",
  climate: "CLI",
  hydro: "HYD",
  species: "SPC",
  age: "AGE",
  cert: "CRT",
  season: "SEA",
  yield: "YLD",
  forecast: "FCST",
  transport: "LOG",
  prep: "PRC",
  format: "FMT",
  storage: "STR",
  price: "PRC",
  payment: "PAY",
  ship: "SHP",
  delivery: "DLV",
  joint: "JNT",
  trace: "TRC",
  part: "PRT",
};

/** Mã PLQ hiển thị trên sidebar (vd. PLQ-VT-001). */
export function plqRegionDisplayCode(regionCode: string): string {
  const parts = regionCode.split("-").filter(Boolean);
  const head = parts[0] ?? "VT";
  const tail = (parts[parts.length - 1] ?? "01").replace(/\D/g, "") || "01";
  const num = tail.padStart(3, "0").slice(-3);
  return `PLQ-${head}-${num}`;
}

/** Mã khóa trên từng card (vd. VT1-LOG-T). */
export function plqFieldLockCode(regionCode: string, fieldKey: string): string {
  const head = regionCode.split("-")[0]?.replace(/\d/g, "") ?? "VT";
  const suffix = FIELD_PLQ_SUFFIX[fieldKey] ?? fieldKey.slice(0, 3).toUpperCase();
  return `${head}1-${suffix}-T`;
}
