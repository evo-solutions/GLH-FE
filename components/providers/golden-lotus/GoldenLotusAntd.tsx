"use client";

import type { ReactNode } from "react";
import { App, ConfigProvider, theme } from "antd";
import enUS from "antd/locale/en_US";
import viVN from "antd/locale/vi_VN";
import zhCN from "antd/locale/zh_CN";
import { useLocale } from "next-intl";
import type { Locale } from "@/libs/i18n/config";

const antdLocales = { en: enUS, vi: viVN, zh: zhCN };

export function GoldenLotusAntd({ children }: { children: ReactNode }) {
  const locale = useLocale() as Locale;

  return (
    <ConfigProvider
      locale={antdLocales[locale] ?? enUS}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0d6e8d",
          colorSuccess: "#1b5e3c",
          colorWarning: "#c9a94f",
          colorError: "#c0392b",
          borderRadius: 8,
          fontFamily:
            'var(--font-inter), system-ui, "Segoe UI", Roboto, sans-serif',
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
