"use client";

import { Card, Col, Progress, Row, Statistic, Tag } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import {
  BRAND_MARKETING_OVERVIEW,
  pickLocalized,
  type Locale,
} from "@/lib/brandMarketingData";
import "./brandMarketing.css";

export function BrandMarketingOverviewScreen() {
  const t = useTranslations("brandMarketing");
  const locale = useLocale() as Locale;
  const data = BRAND_MARKETING_OVERVIEW;

  return (
    <div className="location-page brand-page">
      <BusinessModelModuleHeader pageKey="brandOverview" />
      <p className="brand-page__intro">{t("overviewIntro")}</p>

      <Card size="small" className="brand-strength-card">
        <div className="brand-strength-card__head">
          <span className="brand-strength-card__index">{data.strengthIndex}</span>
          <span className="brand-strength-card__grade">
            {pickLocalized(data.strengthGrade, locale)} · {t("strengthIndexLabel")}
          </span>
          <span className="brand-strength-card__trend">{data.strengthTrend}</span>
        </div>
        <Progress
          percent={data.strengthIndex}
          strokeColor="var(--pharma)"
          format={() => `${data.strengthIndex}/100`}
        />
      </Card>

      <Row gutter={[16, 16]} className="brand-kpi-row">
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="brand-kpi-card">
            <Statistic title={t("aidedAwareness")} value={data.aidedAwareness} suffix="%" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="brand-kpi-card">
            <Statistic title={t("unaidedAwareness")} value={data.unaidedAwareness} suffix="%" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="brand-kpi-card">
            <Statistic title={t("shareOfVoice")} value={data.shareOfVoice} suffix="%" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="brand-kpi-card">
            <Statistic title={t("brandPreference")} value={data.brandPreference} suffix="%" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="brand-kpi-card">
            <Statistic title={t("activeCampaigns")} value={data.activeCampaigns} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card size="small" title={t("pillarsTitle")}>
            {data.pillars.map((pillar) => (
              <div key={pillar.key} className="brand-pillar">
                <div className="brand-pillar__title">
                  <span>{pickLocalized(pillar.title, locale)}</span>
                  <Tag color="green">{pillar.trend}</Tag>
                </div>
                <Progress
                  percent={pillar.score}
                  size="small"
                  strokeColor="var(--pharma)"
                  format={() => `${pillar.score}/${pillar.target}`}
                />
                <p className="brand-pillar__insight">{pickLocalized(pillar.insight, locale)}</p>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card size="small" title={t("prioritiesTitle")}>
            <ul className="brand-priority-list">
              {data.priorities.map((item, i) => (
                <li key={i}>{pickLocalized(item, locale)}</li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
