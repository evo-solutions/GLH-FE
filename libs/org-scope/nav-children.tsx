import {
  AppstoreOutlined,
  BulbOutlined,
  DashboardOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  businessModuleInsightsPath,
  businessModuleOverviewPath,
  businessModuleTradePath,
} from "@/libs/business-modules/config";
import type { OrgScopeConfig } from "./types";

type NavT = (key: string) => string;

/** Submenu con cho công ty con và tổ chức bên ngoài (cùng cấu trúc). */
export function buildOrgScopeNavChildren(
  scope: Pick<
    OrgScopeConfig,
    "basePath" | "hasLocation" | "showLocationInNav" | "hasTradeMarketing"
  >,
  t: NavT,
): NonNullable<MenuProps["items"]> {
  const { basePath, hasLocation, hasTradeMarketing } = scope;
  const showLocation = scope.showLocationInNav ?? hasLocation;
  const items: NonNullable<MenuProps["items"]> = [
    {
      key: businessModuleOverviewPath(basePath),
      icon: <DashboardOutlined />,
      label: t("heritageOverview"),
    },
  ];

  if (showLocation) {
    items.push({
      key: `/${basePath}/location`,
      icon: <ShopOutlined />,
      label: t("location"),
    });
  }

  items.push(
    {
      key: `/${basePath}/product`,
      icon: <AppstoreOutlined />,
      label: t("product"),
    },
    {
      key: `/${basePath}/order`,
      icon: <ShoppingCartOutlined />,
      label: t("order"),
    },
    {
      key: `/${basePath}/customer`,
      icon: <TeamOutlined />,
      label: t("customer"),
    },
  );

  if (hasTradeMarketing) {
    items.push({
      key: businessModuleTradePath(basePath),
      icon: <RocketOutlined />,
      label: t("tradeMarketing"),
    });
  }

  items.push({
    key: businessModuleInsightsPath(basePath),
    icon: <BulbOutlined />,
    label: t("insightsDecisions"),
  });

  return items;
}
