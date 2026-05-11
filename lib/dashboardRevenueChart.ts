import { locationIndex } from "@/lib/locationRegistry";
import type { RevenueChartData } from "@/types/dashboard";

type LocaleKey = "vi" | "en" | "zh";

function locationScale(locationId?: string): number {
  if (!locationId) return 1;
  const idx = locationIndex(locationId);
  return 0.42 + (idx % 9) * 0.065;
}

function scaleValues(values: number[], scale: number): number[] {
  return values.map((v) => Math.round(v * scale * 1000) / 1000);
}

const MONTH_VALUES = [
  28.4, 29.1, 30.5, 31.2, 32.0, 33.1, 34.4, 35.2, 36.0, 37.8, 39.2, 42.8,
];

const WEEK_VALUES = [
  9.2, 9.5, 9.8, 10.1, 10.0, 10.4, 10.6, 10.9, 11.2, 11.0, 11.5, 11.8,
];

const YEAR_VALUES = [312, 328, 356, 384, 412];

function monthLabels(locale: LocaleKey): string[] {
  if (locale === "zh") {
    return Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
  }
  if (locale === "en") {
    return Array.from({ length: 12 }, (_, i) => `M${i + 1}`);
  }
  return Array.from({ length: 12 }, (_, i) => `T${i + 1}`);
}

function weekLabels(locale: LocaleKey): string[] {
  if (locale === "zh") {
    return Array.from({ length: 12 }, (_, i) => `第${i + 1}周`);
  }
  if (locale === "en") {
    return Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
  }
  return Array.from({ length: 12 }, (_, i) => `Tuần ${i + 1}`);
}

function yearLabels(locale: LocaleKey): string[] {
  const years = [2022, 2023, 2024, 2025, 2026];
  if (locale === "zh") {
    return years.map((y) => `${y}年`);
  }
  return years.map(String);
}

/** Mock doanh thu tổng theo tuần / tháng / năm (đơn vị tỷ). Có thể scale theo cơ sở. */
export function buildRevenueChart(
  locale: LocaleKey,
  locationId?: string
): RevenueChartData {
  const scale = locationScale(locationId);
  return {
    week: {
      labels: weekLabels(locale),
      values: scaleValues(WEEK_VALUES, scale),
    },
    month: {
      labels: monthLabels(locale),
      values: scaleValues(MONTH_VALUES, scale),
    },
    year: {
      labels: yearLabels(locale),
      values: scaleValues(YEAR_VALUES, scale),
    },
  };
}
