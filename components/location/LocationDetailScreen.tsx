"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, Spin, Tabs } from "antd";
import { useTranslations } from "next-intl";
import { modelLocationListPath } from "@/lib/businessModelRoutes";
import { useBusinessModel, useBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { useLocationMeta } from "@/hooks/useLocation";
import { OverviewTab } from "./tabs/OverviewTab";
import { StaffCostsTab } from "./tabs/StaffCostsTab";
import { SalesTab } from "./tabs/SalesTab";
import { WarehouseTab } from "./tabs/WarehouseTab";
import "./location.css";

export type LocationTabKey = "overview" | "staffCosts" | "sales" | "warehouse";

const TAB_KEYS: LocationTabKey[] = ["overview", "staffCosts", "sales", "warehouse"];

export function LocationDetailScreen({ locationId }: { locationId: string }) {
  const t = useTranslations("location");
  const tNav = useTranslations("nav.businessModels");
  const businessModel = useBusinessModelSlug();
  const { navKey } = useBusinessModel();
  const locationListHref = modelLocationListPath(businessModel);
  const moduleTitle = tNav(navKey);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: LocationTabKey = TAB_KEYS.includes(tabParam as LocationTabKey)
    ? (tabParam as LocationTabKey)
    : "overview";

  const [tab, setTab] = useState<LocationTabKey>(initialTab);
  const [loadedTabs, setLoadedTabs] = useState<LocationTabKey[]>([initialTab]);
  const { data: meta, isLoading, isError } = useLocationMeta(locationId);

  useEffect(() => {
    if (TAB_KEYS.includes(tabParam as LocationTabKey)) {
      const k = tabParam as LocationTabKey;
      setTab(k);
      setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
    }
  }, [tabParam]);

  const onTabChange = (key: string) => {
    const k = key as LocationTabKey;
    setTab(k);
    setLoadedTabs((prev) => (prev.includes(k) ? prev : [...prev, k]));
  };

  const tabEnabled = (key: LocationTabKey) => loadedTabs.includes(key);

  if (isLoading) {
    return (
      <div className="location-page flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !meta) {
    return (
      <div className="location-page">
        <Breadcrumb
          className="location-breadcrumb"
          items={[{ title: <Link href={locationListHref}>{moduleTitle}</Link> }]}
        />
        <p className="text-muted text-center py-16 m-0">{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="location-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href={locationListHref}>{moduleTitle}</Link> },
            { title: meta.name },
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
            children: <OverviewTab locationId={locationId} />,
          },
          {
            key: "staffCosts",
            label: t("tabs.staffCosts"),
            children: <StaffCostsTab locationId={locationId} enabled={tabEnabled("staffCosts")} />,
          },
          {
            key: "sales",
            label: t("tabs.sales"),
            children: <SalesTab locationId={locationId} enabled={tabEnabled("sales")} />,
          },
          {
            key: "warehouse",
            label: t("tabs.warehouse"),
            children: <WarehouseTab locationId={locationId} enabled={tabEnabled("warehouse")} />,
          },
        ]}
      />
    </div>
  );
}
