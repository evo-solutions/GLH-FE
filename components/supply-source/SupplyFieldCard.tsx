"use client";

import { LockOutlined } from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import { plqFieldLockCode } from "@/libs/supply-source/layout";
import type { SupplyField } from "@/types/supply-source";

export function SupplyFieldCard({
  regionCode,
  field,
  allowed,
  pill = false,
}: {
  regionCode: string;
  field: SupplyField;
  allowed: boolean;
  pill?: boolean;
}) {
  const t = useTranslations("supplySource");
  const lockCode = plqFieldLockCode(regionCode, field.key);

  const body = allowed ? (
    <p
      className={
        pill
          ? "supply-field-card-body supply-field-card-body--pill"
          : "supply-field-card-body supply-field-card-body--visible"
      }
    >
      {field.value}
    </p>
  ) : (
    <Tooltip title={t("maskedTooltip")}>
      <p className="supply-field-card-body supply-masked m-0">
        <LockOutlined className="mr-1 text-xs opacity-70" />
        {t("maskedValue")}
      </p>
    </Tooltip>
  );

  return (
    <article className="supply-field-card">
      <div className="supply-field-card-top">
        <span className="supply-field-card-label">{field.label}</span>
        <Tag className="supply-field-card-lock" icon={<LockOutlined />}>
          {lockCode}
        </Tag>
      </div>
      {body}
    </article>
  );
}
