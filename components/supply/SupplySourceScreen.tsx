"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  EnvironmentOutlined,
  GlobalOutlined,
  ImportOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Card, Empty, List, Tabs, Tag } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import { EncodedSupplyFieldRow } from "@/components/supply/EncodedSupplyField";
import {
  getGrowingZones,
  getImportSupplyRecords,
  labelFor,
  type GrowingZoneSupply,
  type ImportSupplyRecord,
  type Locale,
  type SupplyFieldGroup,
} from "@/lib/supplySourceData";
import "./supply.css";

type MainTabKey = "domestic" | "foreign" | "import";
type DetailTabKey = "profile" | "cultivation" | "trade";

function splitGroupsForDetailTabs(
  groups: SupplyFieldGroup[],
  mode: "zone" | "import" = "zone"
) {
  const profile: SupplyFieldGroup[] = [];
  const cultivation: SupplyFieldGroup[] = [];
  const trade: SupplyFieldGroup[] = [];

  for (const group of groups) {
    const id = group.id;
    if (mode === "import") {
      if (id.includes("-base") || id.includes("-info")) {
        cultivation.push(group);
      } else if (id.endsWith("-log") || id.endsWith("-com") || id.includes("-LOG") || id.includes("-COM")) {
        trade.push(group);
      }
      continue;
    }
    if (id.endsWith("-loc") || id.endsWith("-ent")) {
      profile.push(group);
    } else if (id.endsWith("-scl") || id.endsWith("-spc") || id.endsWith("-hrv")) {
      cultivation.push(group);
    } else if (id.endsWith("-log") || id.endsWith("-com")) {
      trade.push(group);
    }
  }

  return { profile, cultivation, trade };
}

function DetailGroupPanel({
  groups,
  locale,
}: {
  groups: SupplyFieldGroup[];
  locale: Locale;
}) {
  if (groups.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="supply-detail-empty" />;
  }

  return (
    <div className="supply-detail-panel">
      {groups.map((group) => (
        <Card
          key={group.id}
          size="small"
          className="supply-detail-group-card"
          title={labelFor(group.title, locale)}
        >
          <div className="supply-fields-grid">
            {group.items.map((item) => (
              <EncodedSupplyFieldRow
                key={item.id}
                label={labelFor(item.label, locale)}
                field={item.field}
                cell
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function GrowingZoneDetail({
  zone,
  locale,
}: {
  zone: GrowingZoneSupply;
  locale: Locale;
}) {
  const t = useTranslations("supply");
  const split = useMemo(() => splitGroupsForDetailTabs(zone.groups), [zone.groups]);
  const displayName = zone.zoneName.plainValue ?? zone.zoneCode;

  const tabs = [
    {
      key: "profile" as DetailTabKey,
      label: t("detailTabs.profile"),
      children: (
        <div className="supply-detail-panel">
          <Card size="small" className="supply-detail-group-card" title={t("fields.zoneName")}>
            <div className="supply-fields-grid supply-fields-grid--single">
              <EncodedSupplyFieldRow field={zone.zoneName} label={t("fields.zoneName")} cell />
            </div>
          </Card>
          <DetailGroupPanel groups={split.profile} locale={locale} />
        </div>
      ),
    },
    {
      key: "cultivation" as DetailTabKey,
      label: t("detailTabs.cultivation"),
      children: <DetailGroupPanel groups={split.cultivation} locale={locale} />,
    },
    {
      key: "trade" as DetailTabKey,
      label: t("detailTabs.trade"),
      children: <DetailGroupPanel groups={split.trade} locale={locale} />,
    },
  ];

  return (
    <div className="supply-detail">
      <header className="supply-detail__header">
        <h2 className="supply-detail__title">
          <EnvironmentOutlined />
          {displayName}
        </h2>
        <Tag>{zone.zoneCode}</Tag>
        <p className="supply-detail__summary">{labelFor(zone.summary, locale)}</p>
      </header>
      <Tabs className="supply-detail-tabs" items={tabs} />
    </div>
  );
}

function ImportRecordDetail({
  record,
  locale,
}: {
  record: ImportSupplyRecord;
  locale: Locale;
}) {
  const t = useTranslations("supply");
  const split = useMemo(() => splitGroupsForDetailTabs(record.groups, "import"), [record.groups]);
  const title = record.supplierName.plainValue ?? record.supplierName.token ?? record.id;

  const tabs = [
    {
      key: "profile" as DetailTabKey,
      label: t("detailTabs.profile"),
      children: (
        <div className="supply-detail-panel">
          <Card size="small" className="supply-detail-group-card" title={t("importSupplier")}>
            <div className="supply-fields-grid supply-fields-grid--single">
              <EncodedSupplyFieldRow
                field={record.supplierName}
                label={t("importSupplier")}
                cell
              />
            </div>
          </Card>
          <DetailGroupPanel groups={split.profile} locale={locale} />
        </div>
      ),
    },
    {
      key: "cultivation" as DetailTabKey,
      label: t("detailTabs.product"),
      children: <DetailGroupPanel groups={split.cultivation} locale={locale} />,
    },
    {
      key: "trade" as DetailTabKey,
      label: t("detailTabs.trade"),
      children: <DetailGroupPanel groups={split.trade} locale={locale} />,
    },
  ];

  return (
    <div className="supply-detail">
      <header className="supply-detail__header">
        <h2 className="supply-detail__title">
          <ShopOutlined />
          {title}
        </h2>
        <Tag color="processing">{labelFor(record.statusLabel, locale)}</Tag>
        <p className="supply-detail__summary">
          {record.type === "tcm" ? t("sections.importTcm") : t("sections.importSnacks")}
        </p>
      </header>
      <Tabs className="supply-detail-tabs" items={tabs} />
    </div>
  );
}

function MasterDetailLayout<T extends { id: string }>({
  items,
  selectedId,
  onSelect,
  renderListTitle,
  renderListMeta,
  renderDetail,
  emptyHint,
}: {
  items: T[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  renderListTitle: (item: T) => string;
  renderListMeta?: (item: T) => string;
  renderDetail: (item: T) => ReactNode;
  emptyHint: string;
}) {
  const selected = items.find((i) => i.id === selectedId) ?? items[0];

  return (
    <div className="supply-master-detail">
      <aside className="supply-master-detail__list">
        <List
          size="small"
          dataSource={items}
          rowKey="id"
          renderItem={(item) => {
            const active = item.id === (selectedId ?? items[0]?.id);
            return (
              <List.Item
                className={`supply-list-item${active ? " supply-list-item--active" : ""}`}
                onClick={() => onSelect(item.id)}
              >
                <div className="supply-list-item__body">
                  <span className="supply-list-item__title">{renderListTitle(item)}</span>
                  {renderListMeta && (
                    <span className="supply-list-item__meta">{renderListMeta(item)}</span>
                  )}
                </div>
              </List.Item>
            );
          }}
        />
      </aside>
      <section className="supply-master-detail__content">
        {selected ? (
          renderDetail(selected)
        ) : (
          <Empty description={emptyHint} className="supply-detail-empty" />
        )}
      </section>
    </div>
  );
}

function ZoneTabContent({ scope, locale }: { scope: "domestic" | "foreign"; locale: Locale }) {
  const t = useTranslations("supply");
  const zones = getGrowingZones(scope);
  const [selectedId, setSelectedId] = useState<string | null>(zones[0]?.id ?? null);

  useEffect(() => {
    if (zones.length > 0 && !zones.some((z) => z.id === selectedId)) {
      setSelectedId(zones[0].id);
    }
  }, [scope, zones, selectedId]);

  return (
    <div>
      <p className="supply-tab-hint">
        {scope === "domestic" ? t("sections.domesticHint") : t("sections.foreignHint")}
      </p>
      <MasterDetailLayout
        items={zones}
        selectedId={selectedId}
        onSelect={setSelectedId}
        renderListTitle={(z) => z.zoneName.plainValue ?? z.zoneCode}
        renderListMeta={(z) => z.zoneCode}
        renderDetail={(z) => <GrowingZoneDetail zone={z} locale={locale} />}
        emptyHint={t("selectZone")}
      />
    </div>
  );
}

function ImportTabContent({ locale }: { locale: Locale }) {
  const t = useTranslations("supply");
  const imports = useMemo(
    () => [...getImportSupplyRecords("tcm"), ...getImportSupplyRecords("snacks")],
    []
  );
  const [selectedId, setSelectedId] = useState<string | null>(imports[0]?.id ?? null);

  useEffect(() => {
    if (imports.length > 0 && !imports.some((r) => r.id === selectedId)) {
      setSelectedId(imports[0].id);
    }
  }, [imports, selectedId]);

  return (
    <div>
      <p className="supply-tab-hint">{t("sections.importHint")}</p>
      <MasterDetailLayout
        items={imports}
        selectedId={selectedId}
        onSelect={setSelectedId}
        renderListTitle={(r) => r.supplierName.plainValue ?? r.supplierName.token ?? r.id}
        renderListMeta={(r) =>
          r.type === "tcm" ? t("sections.importTcmShort") : t("sections.importSnacksShort")
        }
        renderDetail={(r) => <ImportRecordDetail record={r} locale={locale} />}
        emptyHint={t("selectImport")}
      />
    </div>
  );
}

export function SupplySourceScreen() {
  const t = useTranslations("supply");
  const locale = useLocale() as Locale;
  const [mainTab, setMainTab] = useState<MainTabKey>("domestic");

  const mainTabs = [
    {
      key: "domestic" as MainTabKey,
      label: (
        <span className="supply-main-tab-label">
          <EnvironmentOutlined />
          {t("mainTabs.domestic")}
        </span>
      ),
      children: <ZoneTabContent scope="domestic" locale={locale} />,
    },
    {
      key: "foreign" as MainTabKey,
      label: (
        <span className="supply-main-tab-label">
          <GlobalOutlined />
          {t("mainTabs.foreign")}
        </span>
      ),
      children: <ZoneTabContent scope="foreign" locale={locale} />,
    },
    {
      key: "import" as MainTabKey,
      label: (
        <span className="supply-main-tab-label">
          <ImportOutlined />
          {t("mainTabs.import")}
        </span>
      ),
      children: <ImportTabContent locale={locale} />,
    },
  ];

  return (
    <div className="supply-page location-page">
      <BusinessModelModuleHeader pageKey="supply" />

      <p className="supply-page__intro">{t("intro")}</p>
      <p className="supply-page__permission">{t("permissionNote")}</p>

      <Tabs
        className="supply-main-tabs"
        activeKey={mainTab}
        onChange={(key) => setMainTab(key as MainTabKey)}
        items={mainTabs}
      />
    </div>
  );
}
