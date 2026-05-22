"use client";

import { HomeOutlined, ShopOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import type { BusinessModelConfig } from "@/libs/business-models/config";
import { ALL_BUSINESS_MODELS } from "@/libs/business-models/config";
import {
  B2B_DISTRIBUTOR_GROUP_KEY,
  isB2BDistributorChannelSlug,
} from "@/libs/business-models/b2bChannels";
import { getModuleNavItems } from "@/libs/business-models/modules";

function buildBusinessModelSubmenu(
  model: BusinessModelConfig,
  tSections: ReturnType<typeof useTranslations<"nav.sections">>,
  tModels: ReturnType<typeof useTranslations<"nav.businessModels">>
): NonNullable<MenuProps["items"]>[number] {
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
}

function buildDistributorGroupMenu(
  models: BusinessModelConfig[],
  tSections: ReturnType<typeof useTranslations<"nav.sections">>,
  tModels: ReturnType<typeof useTranslations<"nav.businessModels">>
): NonNullable<MenuProps["items"]>[number] {
  return {
    key: B2B_DISTRIBUTOR_GROUP_KEY,
    icon: <ShopOutlined />,
    label: tModels("nhaPhanPhoi"),
    children: models.map((model) => {
      const moduleChildren = getModuleNavItems(model).map((c) => ({
        key: c.href,
        label: tSections(c.labelKey),
      }));

      return {
        key: `bm-${model.slug}`,
        label: tModels(model.navKey),
        children: moduleChildren,
      };
    }),
  };
}

export function useNavMenuItems(): MenuProps["items"] {
  const t = useTranslations("nav");
  const tSections = useTranslations("nav.sections");
  const tModels = useTranslations("nav.businessModels");

  const modelMenus: MenuProps["items"] = [];
  const distributorModels: BusinessModelConfig[] = [];

  for (const model of ALL_BUSINESS_MODELS) {
    if (isB2BDistributorChannelSlug(model.slug)) {
      distributorModels.push(model);
      continue;
    }
    if (distributorModels.length > 0) {
      modelMenus.push(
        buildDistributorGroupMenu(distributorModels, tSections, tModels)
      );
      distributorModels.length = 0;
    }
    modelMenus.push(buildBusinessModelSubmenu(model, tSections, tModels));
  }

  if (distributorModels.length > 0) {
    modelMenus.push(
      buildDistributorGroupMenu(distributorModels, tSections, tModels)
    );
  }

  return [
    { key: "/", icon: <HomeOutlined />, label: t("dashboard") },
    ...(modelMenus ?? []),
  ];
}
