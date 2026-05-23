import type { BusinessModelConfig, BusinessModule } from "@/libs/business-models/config";
import {
  modelBrandAwarenessPath,
  modelBrandCampaignsPath,
  modelBrandOverviewPath,
  modelCustomerListPath,
  modelLocationListPath,
  modelMarketingPath,
  modelOrderListPath,
  modelProductListPath,
  modelSupplyPath,
} from "@/lib/businessModelRoutes";

const MODULE_I18N: Record<BusinessModule, string> = {
  stores: "stores",
  products: "products",
  warehouse: "warehouse",
  "customers-c": "customersC",
  "customers-b": "customersB",
  marketing: "marketing",
  supply: "supply",
  "brand-overview": "brandOverview",
  "brand-awareness": "brandAwareness",
  "brand-campaigns": "brandCampaigns",
};

export function moduleSectionLabelKey(module: BusinessModule): string {
  return MODULE_I18N[module];
}

export function getModuleNavItems(config: BusinessModelConfig) {
  const { slug, modules } = config;
  const hrefByModule: Record<BusinessModule, string> = {
    stores: modelLocationListPath(slug),
    products: modelProductListPath(slug),
    warehouse: modelOrderListPath(slug),
    "customers-c": modelCustomerListPath(slug),
    "customers-b": modelCustomerListPath(slug),
    marketing: modelMarketingPath(slug),
    supply: modelSupplyPath(slug),
    "brand-overview": modelBrandOverviewPath(slug),
    "brand-awareness": modelBrandAwarenessPath(slug),
    "brand-campaigns": modelBrandCampaignsPath(slug),
  };

  return modules.map((module) => ({
    module,
    href: hrefByModule[module],
    labelKey: moduleSectionLabelKey(module),
  }));
}
