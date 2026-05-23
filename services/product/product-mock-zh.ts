import { localizeInboundOrderRows } from "@/lib/inboundOrderData";
import { localizeProductInstances } from "@/lib/productInstances";
import type { ProductDetail, ProductListItem } from "@/types/product";
import { buildLocalizedProductList, productMockVi } from "./product.mock";

function withZhLabels(items: ProductListItem[]): ProductListItem[] {
  return items.map((item) => ({
    ...item,
    monthlyRevenue: item.monthlyRevenue.replace(/ tr$/, "万"),
    statusLabel:
      item.productCode === "BSV-COV19"
        ? "分销中"
        : item.status === "hot"
          ? "热销"
          : item.status === "stable"
            ? "稳定"
            : item.status === "slow"
              ? "滞销"
              : item.status === "new"
                ? "新品"
                : "缺货",
  }));
}

const listZh = withZhLabels(buildLocalizedProductList("zh"));

export const productMockZh = {
  list: () => listZh,
  detail: (code: string): ProductDetail => {
    const item = listZh.find((p) => p.productCode === code) ?? listZh[0];
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
          label: ["总库存件数", "月营收", "月销量", "有货门店"][i] ?? k.label,
        })),
        channelMix: {
          labels: ["门店", "Zalo预订", "Grab", "其他"],
          values: base.overview.channelMix.values,
        },
      },
      instances: localizeProductInstances(base.instances, "zh"),
      inboundOrders: localizeInboundOrderRows(base.inboundOrders, "zh"),
    };
  },
  meta: (code: string) => productMockZh.detail(code).meta,
};
