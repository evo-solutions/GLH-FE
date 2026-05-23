"use client";

import { Tag } from "antd";
import { useTranslations } from "next-intl";
import { useBusinessModel } from "@/libs/business-models/BusinessModelContext";
import "./businessModelModuleHeader.css";

type Props = {
  /** i18n key under businessModel.pages.{pageKey} */
  pageKey:
    | "stores"
    | "products"
    | "warehouse"
    | "customers"
    | "supply"
    | "marketing"
    | "brandOverview"
    | "brandAwareness"
    | "brandCampaigns";
  className?: string;
};

export function BusinessModelModuleHeader({ pageKey, className }: Props) {
  const tModels = useTranslations("nav.businessModels");
  const tOrg = useTranslations("businessModel");
  const tPage = useTranslations("businessModel.pages");
  const { navKey, entityRole, commerceModel } = useBusinessModel();

  const commerceLabel =
    commerceModel === "b2c" ? tOrg("commerceB2c") : tOrg("commerceB2b");
  const roleLabel =
    entityRole === "subsidiary"
      ? tOrg("roleSubsidiary")
      : entityRole === "brand-marketing"
        ? tOrg("roleBrandMarketing")
        : entityRole === "holding"
          ? tOrg("roleHolding")
          : tOrg("roleB2bChannel");

  return (
    <header className={`bm-module-header ${className ?? ""}`}>
      <div className="bm-module-header__top">
        <h1 className="bm-module-header__title">{tPage(pageKey)}</h1>
        <div className="bm-module-header__badges">
          <Tag color={commerceModel === "b2c" ? "green" : "blue"}>{commerceLabel}</Tag>
          <Tag>{roleLabel}</Tag>
        </div>
      </div>
      <p className="bm-module-header__entity">
        {tModels(navKey)}
        <span className="bm-module-header__sep"> · </span>
        {tOrg("dataScope", { entity: tModels(navKey) })}
      </p>
    </header>
  );
}
