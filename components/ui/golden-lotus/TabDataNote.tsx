"use client";

import { ApartmentOutlined } from "@ant-design/icons";
import { Card, Descriptions } from "antd";
import { useTranslations } from "next-intl";

export function TabDataNote({
  perm,
  flow,
  source,
  process_,
}: {
  perm: string;
  flow: string;
  source: string;
  process_: string;
}) {
  const t = useTranslations("GoldenLotus");

  return (
    <div className="gl-tab-data-note-stack">
      <Card size="small" variant="borderless" className="gl-tab-data-note" role="region">
        <Descriptions
          title={
            <span className="gl-tab-data-note__title">
              <ApartmentOutlined style={{ marginRight: 8 }} aria-hidden />
              {t("tabNote.title")}
            </span>
          }
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
          size="small"
          styles={{ label: { fontWeight: 600 } }}
          items={[
            {
              key: "perm",
              label: t("tabNote.permLabel"),
              children: perm,
            },
            {
              key: "flow",
              label: t("tabNote.flowLabel"),
              children: flow,
            },
            {
              key: "source",
              label: t("tabNote.sourceLabel"),
              children: source,
            },
            {
              key: "process",
              label: t("tabNote.processLabel"),
              children: process_,
            },
          ]}
        />
      </Card>
    </div>
  );
}
