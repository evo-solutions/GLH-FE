"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb, Tabs } from "antd";
import { useTranslations } from "next-intl";
import type { OrgScopeBrandId } from "@/services/business-module/mock-brands";
import { BusinessModuleTabPanel } from "./BusinessModuleTabPanel";
import "@/components/location/location.css";

export type TradeMarketingTabKey =
  | "merchandiseDisplay"
  | "salesTraining"
  | "customerCare"
  | "salesPolicy"
  | "seasonalCampaigns"
  | "newStoreOpening";

const TAB_KEYS: TradeMarketingTabKey[] = [
  "merchandiseDisplay",
  "salesTraining",
  "customerCare",
  "salesPolicy",
  "seasonalCampaigns",
  "newStoreOpening",
];

export function TradeMarketingDetailScreen({
  moduleId,
  moduleNavLabelKey,
}: {
  moduleId: OrgScopeBrandId;
  moduleNavLabelKey: string;
}) {
  const t = useTranslations("heritageTrade");
  const tNav = useTranslations("nav");
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: TradeMarketingTabKey = TAB_KEYS.includes(
    tabParam as TradeMarketingTabKey,
  )
    ? (tabParam as TradeMarketingTabKey)
    : "merchandiseDisplay";

  const [tab, setTab] = useState<TradeMarketingTabKey>(initialTab);
  const [loadedTabs, setLoadedTabs] = useState<TradeMarketingTabKey[]>([
    initialTab,
  ]);

  useEffect(() => {
    if (TAB_KEYS.includes(tabParam as TradeMarketingTabKey)) {
      const k = tabParam as TradeMarketingTabKey;
      setTab(k);
      setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
    }
  }, [tabParam]);

  const onTabChange = (key: string) => {
    const k = key as TradeMarketingTabKey;
    setTab(k);
    setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
  };

  const tabEnabled = (key: TradeMarketingTabKey) => loadedTabs.includes(key);
  const moduleLabel = tNav(moduleNavLabelKey);

  return (
    <div className="location-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[{ title: moduleLabel }, { title: tNav("tradeMarketing") }]}
        />
        <h1 className="m-0 mt-2 text-xl font-bold text-[var(--text)]">
          {tNav("tradeMarketing")}
        </h1>
        <p className="mt-2 mb-0 text-muted">{t("subtitle")}</p>
      </header>

      <Tabs
        activeKey={tab}
        onChange={onTabChange}
        className="mt-4"
        items={TAB_KEYS.map((key) => ({
          key,
          label: t(`tabs.${key}`),
          children: tabEnabled(key) ? (
            <BusinessModuleTabPanel
              moduleId={moduleId}
              section="tradeMarketing"
              namespace="heritageTrade"
              tabKey={key}
            />
          ) : null,
        }))}
      />
    </div>
  );
}
