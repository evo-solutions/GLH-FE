import { localizeInboundOrderRows } from "@/lib/inboundOrderData";
import { localizeProductInstances } from "@/lib/productInstances";
import type { ProductDetail, ProductListItem } from "@/types/product";
import { buildLocalizedProductList, productMockVi } from "./product.mock";

function withEnLabels(items: ProductListItem[]): ProductListItem[] {
  return items.map((item) => ({
    ...item,
    monthlyRevenue: item.monthlyRevenue.replace(/ tr$/, "M"),
    statusLabel:
      item.productCode === "BSV-COV19"
        ? "In distribution"
        : item.status === "hot"
          ? "Best seller"
          : item.status === "stable"
            ? "Stable"
            : item.status === "slow"
              ? "Slow moving"
              : item.status === "new"
                ? "New"
                : "Out of stock",
  }));
}

const listEn = withEnLabels(buildLocalizedProductList("en"));

export const productMockEn = {
  list: () => listEn,
  detail: (code: string): ProductDetail => {
    const item = listEn.find((p) => p.productCode === code) ?? listEn[0];
    const base = productMockVi.detail(code);
    return {
      ...base,
      meta: {
        ...base.meta,
        productCode: item.productCode,
        name: item.name,
        category: item.category,
        brand: item.brand,
        sellPrice: item.sellPrice,
        importPrice: item.importPrice,
        status: item.status,
        statusLabel: item.statusLabel,
      },
      overview: {
        ...base.overview,
        kpis: base.overview.kpis.map((k, i) => ({
          ...k,
          label: ["Total units in stock", "Monthly revenue", "Units sold (month)", "Locations stocking"][i] ?? k.label,
        })),
        channelMix: {
          labels: ["In-store", "Zalo order", "Grab", "Other"],
          values: base.overview.channelMix.values,
        },
      },
      instances: localizeProductInstances(base.instances, "en"),
      inboundOrders: localizeInboundOrderRows(base.inboundOrders, "en"),
    };
  },
  meta: (code: string) => productMockEn.detail(code).meta,
};
