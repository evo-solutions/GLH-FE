"use client";

import { ConfigProvider, theme } from "antd";
import { ReactNode, useMemo } from "react";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { palette } from "@/libs/theme";

export function AntdProvider({ children }: { children: ReactNode }) {
  const { theme: mode } = useThemeContext();
  const p = palette[mode];

  const antdTheme = useMemo(
    () => ({
      algorithm:
        mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: p.pharma,
        colorPrimaryHover: p.pharmaDeep,
        colorSuccess: p.leaf,
        colorWarning: p.gold,
        colorError: p.danger,
        colorInfo: p.info,
        colorText: p.text,
        colorTextSecondary: p.muted,
        colorBorder: p.border,
        colorBgLayout: p.bgPage,
        colorBgContainer: p.bgPage,
        borderRadius: 8,
      },
    }),
    [mode, p]
  );

  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
}
