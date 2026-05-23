"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs } from "antd";
import { useTranslations } from "next-intl";
import { ModulePageHeader } from "@/components/layout/ModulePageHeader";
import { BrandMarketingTabPanel } from "./BrandMarketingTabPanel";
import type { BrandMarketingTab } from "@/types/brand-marketing";
import "@/components/location/location.css";

const TAB_KEYS: BrandMarketingTab[] = [
  "brandStrategy",
  "campaigns",
  "channels",
  "partnerships",
  "budgetPerformance",
];

export function BrandMarketingScreen() {
  const t = useTranslations("brandMarketing");
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: BrandMarketingTab = TAB_KEYS.includes(tabParam as BrandMarketingTab)
    ? (tabParam as BrandMarketingTab)
    : "brandStrategy";

  const [tab, setTab] = useState<BrandMarketingTab>(initialTab);
  const [loadedTabs, setLoadedTabs] = useState<BrandMarketingTab[]>([initialTab]);

  useEffect(() => {
    if (TAB_KEYS.includes(tabParam as BrandMarketingTab)) {
      const k = tabParam as BrandMarketingTab;
      setTab(k);
      setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
    }
  }, [tabParam]);

  const onTabChange = (key: string) => {
    const k = key as BrandMarketingTab;
    setTab(k);
    setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
  };

  const tabEnabled = (key: BrandMarketingTab) => loadedTabs.includes(key);

  return (
    <div className="location-page">
      <ModulePageHeader title={t("title")}>
        <Tabs
          activeKey={tab}
          onChange={onTabChange}
          items={TAB_KEYS.map((key) => ({
            key,
            label: t(`tabs.${key}`),
            children: tabEnabled(key) ? (
              <BrandMarketingTabPanel tabKey={key} />
            ) : null,
          }))}
        />
      </ModulePageHeader>
    </div>
  );
}
