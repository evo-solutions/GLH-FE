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
        colorPrimary: p.primary,
        colorPrimaryHover: p.primaryHover,
        colorPrimaryActive: p.primaryActive,
        colorSuccess: p.success,
        colorWarning: p.warning,
        colorError: p.danger,
        colorInfo: p.info,
        colorText: p.text,
        colorTextSecondary: p.textSecondary,
        colorTextTertiary: p.textMuted,
        colorBorder: p.border,
        colorBgLayout: p.bgPage,
        colorBgContainer: p.bgContainer,
        borderRadius: 8,
      },
    }),
    [mode, p]
  );

  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
}
