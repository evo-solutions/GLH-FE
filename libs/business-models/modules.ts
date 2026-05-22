import type { BusinessModelConfig, BusinessModule } from "@/libs/business-models/config";
import {
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
  };

  return modules.map((module) => ({
    module,
    href: hrefByModule[module],
    labelKey: moduleSectionLabelKey(module),
  }));
}
