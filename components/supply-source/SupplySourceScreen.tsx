"use client";

import {
  GlobalOutlined,
  HomeOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { Spin, Tabs } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  useSupplyPermissionCheck,
  useSupplySourceData,
  useSupplyUserCommands,
} from "@/hooks/useSupplySource";
import { SUPPLY_REGION_PERMISSION } from "@/libs/supply-source/permissions";
import { ModulePageHeader } from "@/components/layout/ModulePageHeader";
import { SupplyScopeWorkspace } from "./SupplyScopeWorkspace";
import type { SupplyScopeTab, SupplySourceScopeData } from "@/types/supply-source";
import "@/components/location/location.css";
import "./supply-source.css";

export function SupplySourceScreen() {
  const t = useTranslations("supplySource");
  const tNav = useTranslations("nav");
  const { data, isLoading, isError } = useSupplySourceData();
  const { data: commands, isLoading: permLoading } = useSupplyUserCommands();
  const hasCommand = useSupplyPermissionCheck(commands);
  const [scopeTab, setScopeTab] = useState<SupplyScopeTab>("domestic");

  if (isLoading || permLoading) {
    return (
      <div className="location-page flex justify-center py-24">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="location-page">
        <p className="text-muted text-center py-12 m-0">{t("error")}</p>
      </div>
    );
  }

  const scopeData: Record<SupplyScopeTab, SupplySourceScopeData> = {
    domestic: data.domestic,
    international: data.international,
    import: data.import,
  };

  const hasRegion = hasCommand(SUPPLY_REGION_PERMISSION);

  return (
    <div className="location-page">
      <ModulePageHeader title={tNav("supplySource")}>
        <Tabs
          activeKey={scopeTab}
          onChange={(k) => setScopeTab(k as SupplyScopeTab)}
          items={[
          {
            key: "domestic",
            label: (
              <span>
                <HomeOutlined className="mr-1.5" />
                {t("scopeTabs.domestic")}
              </span>
            ),
            children: (
              <SupplyScopeWorkspace
                key="domestic"
                scopeData={scopeData.domestic}
                hasRegionPermission={hasRegion}
                hasCommand={hasCommand}
              />
            ),
          },
          {
            key: "international",
            label: (
              <span>
                <GlobalOutlined className="mr-1.5" />
                {t("scopeTabs.international")}
              </span>
            ),
            children: (
              <SupplyScopeWorkspace
                key="international"
                scopeData={scopeData.international}
                hasRegionPermission={hasRegion}
                hasCommand={hasCommand}
              />
            ),
          },
          {
            key: "import",
            label: (
              <span>
                <ImportOutlined className="mr-1.5" />
                {t("scopeTabs.import")}
              </span>
            ),
            children: (
              <SupplyScopeWorkspace
                key="import"
                scopeData={scopeData.import}
                hasRegionPermission={hasRegion}
                hasCommand={hasCommand}
              />
            ),
          },
          ]}
        />
      </ModulePageHeader>
    </div>
  );
}
