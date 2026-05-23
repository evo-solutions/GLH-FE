"use client";

import { Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useBusinessModuleTabRows } from "@/hooks/useBusinessModule";
import type { OrgScopeBrandId } from "@/services/business-module/mock-brands";
import type {
  HeritageInsightsTab,
  HeritageSectionRow,
  HeritageTradeTab,
} from "@/types/heritage";

type SectionNamespace = "heritageTrade" | "heritageInsights";

type BusinessModuleTabPanelProps =
  | {
      moduleId: OrgScopeBrandId;
      section: "tradeMarketing";
      namespace: "heritageTrade";
      tabKey: HeritageTradeTab;
      enabled?: boolean;
    }
  | {
      moduleId: OrgScopeBrandId;
      section: "insights";
      namespace: "heritageInsights";
      tabKey: HeritageInsightsTab;
      enabled?: boolean;
    };

export function BusinessModuleTabPanel(props: BusinessModuleTabPanelProps) {
  const { moduleId, section, namespace, tabKey, enabled = true } = props;
  const t = useTranslations(namespace);
  const { data, isLoading, isError } = useBusinessModuleTabRows(
    moduleId,
    section,
    tabKey,
    enabled,
  );

  const columns: ColumnsType<HeritageSectionRow> = [
    {
      title: t("colName"),
      dataIndex: "name",
      render: (v) => <span className="font-semibold">{v}</span>,
    },
    { title: t("colStatus"), dataIndex: "status" },
    { title: t("colMetric"), dataIndex: "metric" },
    { title: t("colPeriod"), dataIndex: "period" },
    { title: t("colOwner"), dataIndex: "owner" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-muted text-center py-12 m-0">{t("error")}</p>;
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      scroll={{ x: 720 }}
      className="location-table"
    />
  );
}
