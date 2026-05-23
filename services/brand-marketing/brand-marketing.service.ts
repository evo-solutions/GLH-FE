import type { BrandMarketingRow, BrandMarketingTab } from "@/types/brand-marketing";
import { brandMarketingMockEn } from "./brand-marketing-mock-en";
import { brandMarketingMockZh } from "./brand-marketing-mock-zh";
import { brandMarketingMockVi } from "./brand-marketing.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mockForLocale(locale: string) {
  if (locale === "en") return brandMarketingMockEn;
  if (locale === "zh") return brandMarketingMockZh;
  return brandMarketingMockVi;
}

export async function fetchBrandMarketingTabRows(
  locale: string,
  tab: BrandMarketingTab,
): Promise<BrandMarketingRow[]> {
  if (USE_MOCK) {
    await delay(260);
  }
  return mockForLocale(locale)[tab] ?? [];
}
