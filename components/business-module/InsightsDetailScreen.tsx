"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs } from "antd";
import { useTranslations } from "next-intl";
import { ModulePageHeader } from "@/components/layout/ModulePageHeader";
import type { OrgScopeBrandId } from "@/services/business-module/mock-brands";
import { BusinessModuleTabPanel } from "./BusinessModuleTabPanel";
import "@/components/location/location.css";

export type InsightsTabKey =
  | "risks"
  | "opportunities"
  | "forecasts"
  | "recommendations";

const TAB_KEYS: InsightsTabKey[] = [
  "risks",
  "opportunities",
  "forecasts",
  "recommendations",
];

export function InsightsDetailScreen({
  moduleId,
}: {
  moduleId: OrgScopeBrandId;
}) {
  const t = useTranslations("heritageInsights");
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: InsightsTabKey = TAB_KEYS.includes(tabParam as InsightsTabKey)
    ? (tabParam as InsightsTabKey)
    : "risks";

  const [tab, setTab] = useState<InsightsTabKey>(initialTab);
  const [loadedTabs, setLoadedTabs] = useState<InsightsTabKey[]>([initialTab]);

  useEffect(() => {
    if (TAB_KEYS.includes(tabParam as InsightsTabKey)) {
      const k = tabParam as InsightsTabKey;
      setTab(k);
      setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
    }
  }, [tabParam]);

  const onTabChange = (key: string) => {
    const k = key as InsightsTabKey;
    setTab(k);
    setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
  };

  const tabEnabled = (key: InsightsTabKey) => loadedTabs.includes(key);

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
              <BusinessModuleTabPanel
                moduleId={moduleId}
                section="insights"
                namespace="heritageInsights"
                tabKey={key}
              />
            ) : null,
          }))}
        />
      </ModulePageHeader>
    </div>
  );
}
