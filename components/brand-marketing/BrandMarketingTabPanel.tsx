"use client";

import { Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useBrandMarketingTabRows } from "@/hooks/useBrandMarketing";
import type { BrandMarketingRow, BrandMarketingTab } from "@/types/brand-marketing";

export function BrandMarketingTabPanel({
  tabKey,
  enabled = true,
}: {
  tabKey: BrandMarketingTab;
  enabled?: boolean;
}) {
  const t = useTranslations("brandMarketing");
  const { data, isLoading, isError } = useBrandMarketingTabRows(tabKey, enabled);

  const columns: ColumnsType<BrandMarketingRow> = [
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
