"use client";

import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import type { EncodedSupplyField as EncodedFieldType } from "@/lib/supplySourceData";

type Props = {
  field: EncodedFieldType;
  label: string;
  /** Ô trong lưới ngang của card chi tiết */
  cell?: boolean;
};

export function EncodedSupplyFieldRow({ field, label, cell }: Props) {
  const t = useTranslations("supply");

  return (
    <div className={`supply-field${cell ? " supply-field--cell" : ""}`}>
      <span className="supply-field__label">{label}</span>
      <div className="supply-field__value">
        {field.encoded ? (
          <>
            <Tooltip title={t("encodedHint")}>
              <Tag icon={<LockOutlined />} className="supply-field__tag supply-field__tag--locked">
                {field.token ?? "ENC-••••"}
              </Tag>
            </Tooltip>
            {field.plainValue ? (
              <span className="supply-field__preview" title={t("decryptPreview")}>
                {field.plainValue}
              </span>
            ) : (
              <span className="supply-field__masked">{t("maskedValue")}</span>
            )}
          </>
        ) : (
          <Tag icon={<UnlockOutlined />} className="supply-field__tag supply-field__tag--open">
            {field.plainValue}
          </Tag>
        )}
      </div>
    </div>
  );
}
