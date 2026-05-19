"use client";

import { Typography } from "antd";
import { useMessages, useTranslations } from "next-intl";
import { TabDataNote } from "@/components/ui/golden-lotus/TabDataNote";

export type FlowPlaceholderModuleId =
  | "inventory"
  | "orders"
  | "sellout"
  | "reconciliation"
  | "ar"
  | "events";

type PlaceholderMsgs = {
  tabPerm: string;
  tabFlow: string;
  tabSource: string;
  tabProcess: string;
  title: string;
  summary: string;
  bullets: string[];
};

export function DomainFlowPlaceholder({
  moduleId,
}: {
  moduleId: FlowPlaceholderModuleId;
}) {
  const t = useTranslations("GoldenLotus");
  const messages = useMessages() as {
    GoldenLotus: { placeholders: Record<FlowPlaceholderModuleId, PlaceholderMsgs> };
  };
  const p = messages.GoldenLotus.placeholders[moduleId];

  return (
    <>
      <TabDataNote
        perm={p.tabPerm}
        flow={p.tabFlow}
        source={p.tabSource}
        process_={p.tabProcess}
      />
      <div className="gl-section-head">
        <h2>{p.title}</h2>
      </div>
      <div className="gl-panel">
        <Typography.Paragraph style={{ marginBottom: "1rem" }}>
          {p.summary}
        </Typography.Paragraph>
        <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
          {t("placeholders.scopeLabel")}
        </Typography.Text>
        <ul className="gl-domain-flow-list" style={{ margin: 0, paddingLeft: "1.25rem" }}>
          {p.bullets.map((line, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
