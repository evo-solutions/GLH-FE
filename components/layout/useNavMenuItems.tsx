"use client";

import {
  AppstoreOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";

export function useNavMenuItems(): MenuProps["items"] {
  const t = useTranslations("nav");

  return [
    { key: "/", icon: <HomeOutlined />, label: t("dashboard") },
    { key: "/location", icon: <ShopOutlined />, label: t("location") },
    { key: "/product", icon: <AppstoreOutlined />, label: t("product") },
    { key: "/order", icon: <ShoppingCartOutlined />, label: t("order") },
    { key: "/customer", icon: <TeamOutlined />, label: t("customer") },
  ];
}
