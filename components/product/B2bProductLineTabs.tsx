"use client";

import { Tabs } from "antd";
import { useLocale } from "next-intl";
import {
  productLineLabel,
  type B2BProductLine,
  type B2BProductLineKey,
} from "@/lib/b2bCustomerCatalog";

interface B2bProductLineTabsProps {
  lines: B2BProductLine[];
  activeKey: B2BProductLineKey;
  onChange: (key: B2BProductLineKey) => void;
}

export function B2bProductLineTabs({ lines, activeKey, onChange }: B2bProductLineTabsProps) {
  const locale = useLocale() as "vi" | "en" | "zh";

  return (
    <Tabs
      className="b2b-product-line-tabs"
      activeKey={activeKey}
      onChange={(key) => onChange(key as B2BProductLineKey)}
      items={lines.map((line) => ({
        key: line.key,
        label: productLineLabel(line, locale),
      }))}
    />
  );
}
