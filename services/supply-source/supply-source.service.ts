import type { SupplyPermissionCommand, SupplySourceData } from "@/types/supply-source";
import { mockUserSupplyCommands } from "./supply-permissions.mock";
import { supplySourceMockEn } from "./supply-source-mock-en";
import { supplySourceMockZh } from "./supply-source-mock-zh";
import { supplySourceMockVi } from "./supply-source.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mockForLocale(locale: string): SupplySourceData {
  if (locale === "en") return supplySourceMockEn;
  if (locale === "zh") return supplySourceMockZh;
  return supplySourceMockVi;
}

export async function fetchSupplySourceData(locale: string): Promise<SupplySourceData> {
  if (USE_MOCK) await delay(280);
  return mockForLocale(locale);
}

export async function fetchSupplyUserCommands(): Promise<SupplyPermissionCommand[]> {
  if (USE_MOCK) await delay(120);
  return [...mockUserSupplyCommands];
}
