"use client";

import { useLocale } from "next-intl";

export function useGoldenLotusNumberLocale() {
  const locale = useLocale();
  return locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN";
}
