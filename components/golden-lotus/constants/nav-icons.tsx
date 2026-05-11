import type { ReactNode } from "react";
import {
  CustomerServiceOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  InboxOutlined,
  NotificationOutlined,
  SettingOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TruckOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import type { ScreenId } from "../types";

/** Ant Design icons per screen id (sidebar items reference these keys). */
export const GOLDEN_LOTUS_NAV_ICONS: Record<ScreenId, ReactNode> = {
  dashboard: <DashboardOutlined />,
  vendors: <TruckOutlined />,
  sku: <InboxOutlined />,
  customer: <TeamOutlined />,
  campaign: <NotificationOutlined />,
  research: <ExperimentOutlined />,
  cases: <CustomerServiceOutlined />,
  hrm: <UsergroupAddOutlined />,
  ai: <ThunderboltOutlined />,
  settings: <SettingOutlined />,
};
