"use client";

import {
  CustomerServiceOutlined,
  FundProjectionScreenOutlined,
  ReadOutlined,
  RightOutlined,
  ShopOutlined,
  SlidersOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Card, Col, Collapse, Row, Statistic, Tag } from "antd";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import { useBusinessModel } from "@/libs/business-models/BusinessModelContext";
import { isHoldingB2B } from "@/libs/business-models/config";
import {
  getTradeMarketingScope,
  type TradeMarketingPillarKey,
} from "@/lib/tradeMarketingData";
import type { Locale } from "@/lib/supplySourceData";
import "./marketing.css";

const PILLAR_ICONS: Record<TradeMarketingPillarKey, ReactNode> = {
  display: <ShopOutlined />,
  training: <ReadOutlined />,
  customerCare: <CustomerServiceOutlined />,
  salesPolicy: <SlidersOutlined />,
  seasonalCampaigns: <TagOutlined />,
  newStores: <FundProjectionScreenOutlined />,
};

function loc<T extends { vi: string; en: string; zh: string }>(
  text: T,
  locale: Locale
): string {
  return locale === "zh" ? text.zh : locale === "en" ? text.en : text.vi;
}

export function MarketingScreen() {
  const t = useTranslations("marketing");
  const locale = useLocale() as Locale;
  const { slug, entityRole } = useBusinessModel();
  const isHolding = isHoldingB2B(slug);
  const scope = getTradeMarketingScope(slug);

  if (isHolding) {
    return (
      <div className="location-page marketing-page">
        <BusinessModelModuleHeader pageKey="marketing" />
        <p className="marketing-page__intro">{t("holdingIntro")}</p>
        <Card size="small" className="marketing-mission-card">
          <p className="marketing-mission-card__text">{t("holdingNote")}</p>
        </Card>
      </div>
    );
  }

  const pillarItems: CollapseProps["items"] = scope.pillars.map((pillar) => ({
    key: pillar.key,
    label: (
      <div className="marketing-pillar-header">
        <span className="marketing-pillar-header__icon" aria-hidden>
          {PILLAR_ICONS[pillar.key]}
        </span>
        <div className="marketing-pillar-header__main">
          <span className="marketing-pillar-header__title">
            {loc(pillar.title, locale)}
          </span>
          <span className="marketing-pillar-header__focus">
            {loc(pillar.focus, locale)}
          </span>
        </div>
        <span className="marketing-pillar-header__kpi">
          <span className="marketing-pillar-header__kpi-label">
            {loc(pillar.kpiLabel, locale)}
          </span>
          <span className="marketing-pillar-header__kpi-value">{pillar.kpiValue}</span>
        </span>
      </div>
    ),
    children: (
      <div className="marketing-pillar-body">
        <p className="marketing-pillar-body__desc">{loc(pillar.description, locale)}</p>
        <ul className="marketing-pillar-body__activities">
          {pillar.activities.map((act) => (
            <li key={act.id} className="marketing-activity-row">
              <span className="marketing-activity-row__label">
                {loc(act.label, locale)}
              </span>
              <span className="marketing-activity-row__meta">
                <Tag
                  className="marketing-activity-row__tag"
                  color={
                    act.status === "active"
                      ? "success"
                      : act.status === "planned"
                        ? "processing"
                        : "default"
                  }
                >
                  {t(`status.${act.status}`)}
                </Tag>
                {act.metric && (
                  <span className="marketing-activity-row__metric">
                    {loc(act.metric, locale)}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  }));

  return (
    <div className="location-page marketing-page">
      <BusinessModelModuleHeader pageKey="marketing" />

      <p className="marketing-page__intro">{t("intro")}</p>

      <Card size="small" className="marketing-mission-card">
        <h2 className="marketing-mission-card__title">{t("missionTitle")}</h2>
        <p className="marketing-mission-card__text">{t("missionBody")}</p>
        <ul className="marketing-mission-card__list">
          <li>{t("missionCustomer")}</li>
          <li>{t("missionStore")}</li>
          <li>{t("missionFourNeeds")}</li>
        </ul>
        <p className="marketing-mission-card__exclude">{t("notBrandMkt")}</p>
      </Card>

      <Row gutter={[16, 16]} className="marketing-kpis">
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="marketing-stat-card">
            <Statistic title={t("kpiStoresCompetitive")} value={scope.kpis.storesCompetitive} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="marketing-stat-card">
            <Statistic title={t("kpiCampaigns")} value={scope.kpis.campaignsActive} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="marketing-stat-card">
            <Statistic title={t("kpiNewStores")} value={scope.kpis.newStoresYtd} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="marketing-stat-card">
            <Statistic title={t("kpiSatisfaction")} value={scope.kpis.satisfactionIndex} />
          </Card>
        </Col>
      </Row>

      <section className="marketing-pillars-section">
        <h2 className="marketing-pillars__title">{t("pillarsTitle")}</h2>
        <p className="marketing-pillars__hint">{t("pillarsHint")}</p>

        <Collapse
          className="marketing-pillars-collapse"
          accordion
          defaultActiveKey={[]}
          expandIconPlacement="end"
          expandIcon={({ isActive }) => (
            <RightOutlined
              className="marketing-pillars-collapse__chevron"
              rotate={isActive ? 90 : 0}
            />
          )}
          items={pillarItems}
        />
      </section>

      {entityRole === "subsidiary" && (
        <p className="marketing-page__legal">{t("legalSubsidiary")}</p>
      )}
    </div>
  );
}
