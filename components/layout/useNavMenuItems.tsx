"use client";

import {
  ApartmentOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  ExperimentOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  BUSINESS_MODULES,
  SUBSIDIARY_MENU_KEY,
} from "@/libs/business-modules/config";
import {
  EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY,
  EXTERNAL_ORGANIZATION_MENU_KEY,
  EXTERNAL_ORGS_DISTRIBUTOR_CHANNELS,
  EXTERNAL_ORGS_TOP_LEVEL,
} from "@/libs/external-organizations/config";
import { buildOrgScopeNavChildren } from "@/libs/org-scope/nav-children";
import { HomeOutlined } from "@ant-design/icons";

export function useNavMenuItems(): MenuProps["items"] {
  const t = useTranslations("nav");

  return useMemo(() => {
    const subsidiaryMenus = BUSINESS_MODULES.map((mod) => {
      const Icon = mod.icon;
      return {
        key: mod.menuKey,
        icon: <Icon />,
        label: t(mod.navLabelKey),
        children: buildOrgScopeNavChildren(
          {
            basePath: mod.basePath,
            hasLocation: true,
            hasTradeMarketing: true,
          },
          t,
        ),
      };
    });

    const externalOrgMenuItem = (org: (typeof EXTERNAL_ORGS_TOP_LEVEL)[number]) => {
      const Icon = org.icon;
      return {
        key: org.menuKey,
        icon: <Icon />,
        label: t(org.navLabelKey),
        children: buildOrgScopeNavChildren(
          {
            basePath: org.basePath,
            hasLocation: true,
            hasTradeMarketing: true,
          },
          t,
        ),
      };
    };

    const externalMenusBeforeDistributor = EXTERNAL_ORGS_TOP_LEVEL.slice(0, 8).map(
      externalOrgMenuItem,
    );

    const externalMenusAfterDistributor = EXTERNAL_ORGS_TOP_LEVEL.slice(8).map(
      externalOrgMenuItem,
    );

    const distributorGroup = {
      key: EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY,
      icon: <ApartmentOutlined />,
      label: t("extNhaPhanPhoiHangTieuDung"),
      children: EXTERNAL_ORGS_DISTRIBUTOR_CHANNELS.map(externalOrgMenuItem),
    };

    return [
      { key: "/", icon: <HomeOutlined />, label: t("dashboard") },
      {
        key: "/product",
        icon: <AppstoreOutlined />,
        label: t("product"),
      },
      {
        key: "/supply-source",
        icon: <ExperimentOutlined />,
        label: t("supplySource"),
      },
      {
        key: "/order",
        icon: <ShoppingCartOutlined />,
        label: t("order"),
      },
      {
        key: SUBSIDIARY_MENU_KEY,
        id: "nav-menu-subsidiary",
        className: "nav-menu-subsidiary",
        icon: <ApartmentOutlined />,
        label: t("subsidiary"),
        children: subsidiaryMenus,
      },
      {
        key: EXTERNAL_ORGANIZATION_MENU_KEY,
        id: "nav-menu-external-org",
        className: "nav-menu-external-org",
        icon: <GlobalOutlined />,
        label: t("externalOrganization"),
        children: [
          ...externalMenusBeforeDistributor,
          distributorGroup,
          ...externalMenusAfterDistributor,
        ],
      },
      { type: "divider" as const },
      {
        key: "/brand-marketing",
        icon: <RocketOutlined />,
        label: t("brandMarketing"),
      },
      {
        key: "/insights",
        icon: <BulbOutlined />,
        label: t("insightsDecisions"),
      },
    ];
  }, [t]);
}
