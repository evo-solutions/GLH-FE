"use client";

import { ConfigProvider, ThemeConfig, theme } from "antd";
import { ReactNode } from "react";
import { useThemeContext } from "@/components/layout/ThemeToggle";

interface AntdProviderProps {
  children: ReactNode;
}

const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#ff6600",
  },
  algorithm: theme.defaultAlgorithm,
};

const darkTheme: ThemeConfig = {
  ...lightTheme,
  algorithm: theme.darkAlgorithm,
};

export function AntdProvider({ children }: AntdProviderProps) {
  const { theme: currentTheme } = useThemeContext();
  const antdTheme = currentTheme === "dark" ? darkTheme : lightTheme;
  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
}

