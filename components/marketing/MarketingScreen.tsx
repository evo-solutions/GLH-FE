"use client";

import { Card, Col, Row, Statistic, Tag } from "antd";
import { useTranslations } from "next-intl";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import { useBusinessModel } from "@/libs/business-models/BusinessModelContext";
import { isHoldingB2B } from "@/libs/business-models/config";
import "./marketing.css";

const MOCK_CAMPAIGNS = [
  { id: "1", name: "Flash sale cuối tuần", status: "active", reach: "12.4K", conv: "3.2%" },
  { id: "2", name: "Khách hàng Vàng — tặng quà", status: "active", reach: "2.1K", conv: "8.1%" },
  { id: "3", name: "Zalo OA remarketing", status: "paused", reach: "8.6K", conv: "1.4%" },
];

export function MarketingScreen() {
  const t = useTranslations("marketing");
  const { slug, entityRole, commerceModel } = useBusinessModel();
  const isHolding = isHoldingB2B(slug);

  return (
    <div className="marketing-page">
      <BusinessModelModuleHeader pageKey="marketing" />

      <p className="marketing-page__intro">{t("intro")}</p>

      {entityRole === "subsidiary" && (
        <p className="marketing-page__legal text-muted">{t("legalSubsidiary")}</p>
      )}
      {isHolding && (
        <p className="marketing-page__legal text-muted">{t("legalHolding")}</p>
      )}

      <Row gutter={[16, 16]} className="marketing-kpis">
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title={t("kpiRevenue")} value="₫8.4 tỷ" />
            <span className="text-muted text-xs">{t("kpiRevenueNote")}</span>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title={t("kpiCampaigns")} value={3} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title={t("kpiSegment")}
              value={commerceModel === "b2c" ? "C" : "B"}
            />
          </Card>
        </Col>
      </Row>

      <section className="marketing-campaigns">
        <h2 className="marketing-campaigns__title">{t("campaignsTitle")}</h2>
        <div className="marketing-campaigns__list">
          {MOCK_CAMPAIGNS.map((c) => (
            <Card key={c.id} size="small" className="marketing-campaign-card">
              <div className="marketing-campaign-card__head">
                <strong>{c.name}</strong>
                <Tag color={c.status === "active" ? "success" : "default"}>
                  {c.status === "active" ? t("statusActive") : t("statusPaused")}
                </Tag>
              </div>
              <div className="marketing-campaign-card__meta text-muted">
                {t("reach")}: {c.reach} · {t("conversion")}: {c.conv}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
