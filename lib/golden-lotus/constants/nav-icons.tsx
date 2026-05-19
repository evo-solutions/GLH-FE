import type { ReactNode } from "react";
import {
  AuditOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  InboxOutlined,
  LineChartOutlined,
  NotificationOutlined,
  PayCircleOutlined,
  RadarChartOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TransactionOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import type { ScreenId } from "@/lib/golden-lotus/types";

/** Ant Design icons per screen id (sidebar items reference these keys). */
export const GOLDEN_LOTUS_NAV_ICONS: Record<ScreenId, ReactNode> = {
  dashboard: <DashboardOutlined />,
  events: <RadarChartOutlined />,
  settings: <SettingOutlined />,
  hrm: <UsergroupAddOutlined />,
  vendors: <ShopOutlined />,
  customer: <TeamOutlined />,
  sku: <InboxOutlined />,
  inventory: <TransactionOutlined />,
  campaign: <NotificationOutlined />,
  orders: <ShoppingCartOutlined />,
  sellout: <LineChartOutlined />,
  ar: <PayCircleOutlined />,
  reconciliation: <AuditOutlined />,
  cases: <CustomerServiceOutlined />,
  research: <ExperimentOutlined />,
  ai: <ThunderboltOutlined />,
};
