"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Breadcrumb, Spin, Tabs } from "antd";
import { useTranslations } from "next-intl";
import { modelProductListPath } from "@/lib/businessModelRoutes";
import { useBusinessModel, useBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { useProductDetail } from "@/hooks/useProduct";
import { ProductInboundTab } from "./tabs/ProductInboundTab";
import { ProductItemsTab } from "./tabs/ProductItemsTab";
import { ProductOverviewTab } from "./tabs/ProductOverviewTab";
import "./product.css";

export type ProductTabKey = "overview" | "items" | "inbound";

export function ProductDetailScreen({ productCode }: { productCode: string }) {
  const t = useTranslations("product");
  const tNav = useTranslations("nav.businessModels");
  const businessModel = useBusinessModelSlug();
  const { navKey } = useBusinessModel();
  const productListHref = modelProductListPath(businessModel);
  const unitLabel = tNav(navKey);
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const initialTab: ProductTabKey =
    tabFromUrl === "items" || tabFromUrl === "inbound" ? tabFromUrl : "overview";
  const [tab, setTab] = useState<ProductTabKey>(initialTab);
  const [loadedTabs, setLoadedTabs] = useState<ProductTabKey[]>([initialTab]);
  const { data, isLoading, isError } = useProductDetail(productCode);

  useEffect(() => {
    if (tabFromUrl === "items" || tabFromUrl === "inbound" || tabFromUrl === "overview") {
      setTab(tabFromUrl);
      setLoadedTabs((prev) => (prev.includes(tabFromUrl) ? prev : [...prev, tabFromUrl]));
    }
  }, [tabFromUrl]);

  const onTabChange = (key: string) => {
    const k = key as ProductTabKey;
    setTab(k);
    setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
  };

  const tabEnabled = (key: ProductTabKey) => loadedTabs.includes(key);

  if (isLoading) {
    return (
      <div className="product-page flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="product-page">
        <Breadcrumb
          className="location-breadcrumb"
          items={[{ title: <Link href={productListHref}>{unitLabel}</Link> }]}
        />
        <p className="text-muted text-center py-16 m-0">{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="product-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href={productListHref}>{unitLabel}</Link> },
            { title: data.meta.name },
          ]}
        />
      </header>

      <Tabs
        activeKey={tab}
        onChange={onTabChange}
        items={[
          {
            key: "overview",
            label: t("tabs.overview"),
            children: <ProductOverviewTab data={data} enabled={tabEnabled("overview")} />,
          },
          {
            key: "items",
            label: t("tabs.items"),
            children: <ProductItemsTab data={data} enabled={tabEnabled("items")} />,
          },
          {
            key: "inbound",
            label: t("tabs.inbound"),
            children: (
              <ProductInboundTab
                productCode={productCode}
                data={data}
                enabled={tabEnabled("inbound")}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
