"use client";

import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocale, useTranslations } from "next-intl";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import {
  BRAND_CAMPAIGNS,
  campaignStatusLabel,
  pickLocalized,
  type BrandCampaignRow,
  type Locale,
} from "@/lib/brandMarketingData";
import "./brandMarketing.css";

const STATUS_COLOR: Record<BrandCampaignRow["status"], string> = {
  active: "green",
  planned: "blue",
  completed: "default",
};

export function BrandCampaignsScreen() {
  const t = useTranslations("brandMarketing");
  const locale = useLocale() as Locale;

  const columns: ColumnsType<BrandCampaignRow> = [
    {
      title: t("campaignName"),
      render: (_, row) => (
        <div>
          <div className="brand-campaign-name">{pickLocalized(row.name, locale)}</div>
          <p className="brand-campaign-objective">{pickLocalized(row.objective, locale)}</p>
        </div>
      ),
    },
    {
      title: t("campaignChannel"),
      width: 160,
      render: (_, row) => pickLocalized(row.channel, locale),
    },
    {
      title: t("campaignStatus"),
      dataIndex: "status",
      width: 110,
      render: (status: BrandCampaignRow["status"]) => (
        <Tag color={STATUS_COLOR[status]}>{campaignStatusLabel(status, locale)}</Tag>
      ),
    },
    {
      title: t("campaignPeriod"),
      dataIndex: "period",
      width: 130,
    },
    {
      title: t("campaignBudget"),
      dataIndex: "budgetVi",
      width: 100,
    },
    {
      title: t("campaignReach"),
      dataIndex: "reach",
      width: 140,
    },
    {
      title: t("campaignLift"),
      dataIndex: "awarenessLift",
      width: 180,
    },
  ];

  return (
    <div className="location-page brand-page">
      <BusinessModelModuleHeader pageKey="brandCampaigns" />
      <p className="brand-page__intro">{t("campaignsIntro")}</p>

      <Card size="small" title={t("campaignsTableTitle")}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={BRAND_CAMPAIGNS}
          pagination={false}
          size="small"
          scroll={{ x: 960 }}
        />
      </Card>
    </div>
  );
}
