"use client";

import { EnvironmentOutlined } from "@ant-design/icons";
import { Tabs, Tag } from "antd";
import { useTranslations } from "next-intl";
import {
  SUPPLY_DETAIL_TAB_SECTIONS,
  plqRegionDisplayCode,
} from "@/libs/supply-source/layout";
import { SupplyFieldCard } from "./SupplyFieldCard";
import { MaskedValue } from "./MaskedValue";
import type {
  SupplyDetailTab,
  SupplyGrowingRegion,
  SupplyInfoSection,
  SupplyPermissionCommand,
} from "@/types/supply-source";

const DETAIL_TABS: SupplyDetailTab[] = [
  "regionPartner",
  "cultivation",
  "logisticsPrice",
];

const PILL_FIELD_KEYS = new Set(["prep", "format", "storage", "payment", "delivery"]);

export function SupplyRegionDetail({
  region,
  detailTab,
  onDetailTabChange,
  hasRegionPermission,
  hasCommand,
}: {
  region: SupplyGrowingRegion;
  detailTab: SupplyDetailTab;
  onDetailTabChange: (tab: SupplyDetailTab) => void;
  hasRegionPermission: boolean;
  hasCommand: (cmd: SupplyPermissionCommand) => boolean;
}) {
  const t = useTranslations("supplySource");
  const plqCode = plqRegionDisplayCode(region.regionCode);

  const sectionById = new Map(
    region.sections.map((s) => [s.id, s] as const),
  );

  return (
    <div className="supply-detail-panel">
      <header className="supply-detail-head">
        <div className="supply-detail-title-row">
          <EnvironmentOutlined className="text-[var(--primary)]" />
          <h2 className="supply-detail-title">
            {hasRegionPermission ? (
              region.name
            ) : (
              <MaskedValue value={region.name} allowed={false} />
            )}
          </h2>
        </div>
        <Tag className="supply-detail-code !m-0">{plqCode}</Tag>
      </header>

      <Tabs
        activeKey={detailTab}
        onChange={(k) => onDetailTabChange(k as SupplyDetailTab)}
        className="supply-detail-tabs"
        items={DETAIL_TABS.map((tabKey) => {
          const sections = SUPPLY_DETAIL_TAB_SECTIONS[tabKey]
            .map((id) => sectionById.get(id))
            .filter((s): s is NonNullable<typeof s> => Boolean(s));

          return {
            key: tabKey,
            label: t(`detailTabs.${tabKey}`),
            children: (
              <div>
                {sections.length === 0 ? (
                  <p className="text-muted m-0 text-sm">{t("noSectionData")}</p>
                ) : (
                  sections.map((section) => (
                    <SectionFieldsGrid
                      key={section.id}
                      sectionId={section.id}
                      regionCode={region.regionCode}
                      sectionTitle={t(`sections.${section.id}`)}
                      fields={section.fields}
                      allowed={hasCommand(section.permissionCommand)}
                    />
                  ))
                )}
              </div>
            ),
          };
        })}
      />
    </div>
  );
}

function SectionFieldsGrid({
  sectionId,
  regionCode,
  sectionTitle,
  fields,
  allowed,
}: {
  sectionId: SupplyInfoSection;
  regionCode: string;
  sectionTitle: string;
  fields: SupplyGrowingRegion["sections"][number]["fields"];
  allowed: boolean;
}) {
  return (
    <section className="supply-section-block">
      <h3 className="supply-section-title">{sectionTitle}</h3>
      <div className="supply-card-grid">
        {fields.map((field) => (
          <SupplyFieldCard
            key={`${sectionId}-${field.key}`}
            regionCode={regionCode}
            field={field}
            allowed={allowed}
            pill={PILL_FIELD_KEYS.has(field.key)}
          />
        ))}
      </div>
    </section>
  );
}
