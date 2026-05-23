import type { OrgScopeBrandId } from "./mock-brands";
import type {
  HeritageInsightsTab,
  HeritageModuleData,
  HeritageSectionRow,
  HeritageTradeTab,
} from "@/types/heritage";
import { heritageMockEn } from "@/services/heritage/heritage-mock-en";
import { heritageMockZh } from "@/services/heritage/heritage-mock-zh";
import { heritageMockVi } from "@/services/heritage/heritage.mock";
import { applyBrandToModuleData } from "./mock-brands";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function baseMockFor(locale: string): HeritageModuleData {
  if (locale === "en") return heritageMockEn;
  if (locale === "zh") return heritageMockZh;
  return heritageMockVi;
}

function mockForModule(
  moduleId: OrgScopeBrandId,
  locale: string,
): HeritageModuleData {
  return applyBrandToModuleData(baseMockFor(locale), moduleId, locale);
}

export type BusinessModuleSectionKey = "tradeMarketing" | "insights";

export async function fetchBusinessModuleTabRows(
  moduleId: OrgScopeBrandId,
  locale: string,
  section: BusinessModuleSectionKey,
  tab: HeritageTradeTab | HeritageInsightsTab,
): Promise<HeritageSectionRow[]> {
  if (USE_MOCK) {
    await delay(280);
    const data = mockForModule(moduleId, locale);
    if (section === "tradeMarketing") {
      return data.tradeMarketing[tab as HeritageTradeTab] ?? [];
    }
    return data.insights[tab as HeritageInsightsTab] ?? [];
  }

  const data = mockForModule(moduleId, locale);
  return data[section][tab as keyof HeritageModuleData[typeof section]];
}
