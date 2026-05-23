"use client";

import { Card, Progress, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocale, useTranslations } from "next-intl";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import {
  BRAND_AWARENESS_SURVEYS,
  pickLocalized,
  type AwarenessSurveyRow,
  type Locale,
} from "@/lib/brandMarketingData";
import "./brandMarketing.css";

export function BrandAwarenessScreen() {
  const t = useTranslations("brandMarketing");
  const locale = useLocale() as Locale;

  const columns: ColumnsType<AwarenessSurveyRow> = [
    {
      title: t("surveyPeriod"),
      dataIndex: "period",
      width: 100,
    },
    {
      title: t("surveyRegion"),
      render: (_, row) => pickLocalized(row.region, locale),
    },
    {
      title: t("sampleSize"),
      dataIndex: "sampleSize",
      width: 110,
      align: "right",
    },
    {
      title: t("aidedAwareness"),
      dataIndex: "aidedAwareness",
      width: 120,
      render: (v: number) => <Progress percent={v} size="small" />,
    },
    {
      title: t("unaidedAwareness"),
      dataIndex: "unaidedAwareness",
      width: 130,
      render: (v: number) => <Progress percent={v} size="small" strokeColor="#1677ff" />,
    },
    {
      title: t("topOfMind"),
      dataIndex: "topOfMind",
      width: 100,
      render: (v: number) => `${v}%`,
    },
    {
      title: t("consideration"),
      dataIndex: "consideration",
      width: 110,
      render: (v: number) => `${v}%`,
    },
    {
      title: "NPS",
      dataIndex: "nps",
      width: 72,
      render: (v: number) => <span className="font-semibold">{v}</span>,
    },
  ];

  return (
    <div className="location-page brand-page">
      <BusinessModelModuleHeader pageKey="brandAwareness" />
      <p className="brand-page__intro">{t("awarenessIntro")}</p>
      <p className="brand-survey-hint">{t("awarenessHint")}</p>

      <Card size="small" title={t("surveyTableTitle")}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={BRAND_AWARENESS_SURVEYS}
          pagination={false}
          size="small"
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
