"use client";

import { HomeOutlined, ShopOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { ALL_BUSINESS_MODELS } from "@/libs/business-models/config";
import { getModuleNavItems } from "@/libs/business-models/modules";

export function useNavMenuItems(): MenuProps["items"] {
  const t = useTranslations("nav");
  const tSections = useTranslations("nav.sections");
  const tModels = useTranslations("nav.businessModels");

  const modelMenus: MenuProps["items"] = ALL_BUSINESS_MODELS.map((model) => {
    const children = getModuleNavItems(model).map((c) => ({
      key: c.href,
      label: tSections(c.labelKey),
    }));

    return {
      key: `bm-${model.slug}`,
      icon: <ShopOutlined />,
      label: tModels(model.navKey),
      children,
    };
  });

  return [
    { key: "/", icon: <HomeOutlined />, label: t("dashboard") },
    ...(modelMenus ?? []),
  ];
}
