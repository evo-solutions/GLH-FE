"use client";

import { LockOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useTranslations } from "next-intl";
export function MaskedValue({
  value,
  allowed,
}: {
  value: string;
  allowed: boolean;
}) {
  const t = useTranslations("supplySource");

  if (allowed) {
    return <span>{value}</span>;
  }

  return (
    <Tooltip title={t("maskedTooltip")}>
      <span className="supply-masked inline-flex items-center gap-1">
        <LockOutlined className="text-xs opacity-70" />
        {t("maskedValue")}
      </span>
    </Tooltip>
  );
}
