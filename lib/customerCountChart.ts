import { locationIndex } from "@/lib/locationRegistry";
import type { CustomerCountChartData } from "@/types/dashboard";

type Locale = "vi" | "en" | "zh";

function locationScale(locationId?: string): number {
  if (!locationId) return 1;
  const idx = locationIndex(locationId);
  return 0.38 + (idx % 9) * 0.07;
}

function trendValues(
  count: number,
  end: number,
  growthUp: boolean,
  noise = 0.025
): number[] {
  if (count <= 0) return [];
  const start = growthUp ? end * 0.84 : end * 1.1;
  return Array.from({ length: count }, (_, i) => {
    const t = count <= 1 ? 1 : i / (count - 1);
    const base = growthUp ? start + (end - start) * t : start - (start - end) * t;
    const wobble = 1 + Math.sin(i * 1.4 + end * 0.00001) * noise;
    return Math.max(0, Math.round(base * wobble));
  });
}

function monthLabels(locale: Locale): string[] {
  if (locale === "zh") {
    return Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
  }
  if (locale === "en") {
    return Array.from({ length: 12 }, (_, i) => `M${i + 1}`);
  }
  return Array.from({ length: 12 }, (_, i) => `T${i + 1}`);
}

function weekLabels(locale: Locale): string[] {
  if (locale === "zh") {
    return Array.from({ length: 12 }, (_, i) => `第${i + 1}周`);
  }
  if (locale === "en") {
    return Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
  }
  return Array.from({ length: 12 }, (_, i) => `Tuần ${i + 1}`);
}

function yearLabels(locale: Locale): string[] {
  const years = [2022, 2023, 2024, 2025, 2026];
  if (locale === "zh") {
    return years.map((y) => `${y}年`);
  }
  return years.map(String);
}

/** Số lượng khách hàng theo tuần / tháng / năm — toàn hệ thống hoặc theo cơ sở. */
export function buildCustomerCountChart(
  locale: Locale,
  locationId?: string
): CustomerCountChartData {
  const scale = locationScale(locationId);
  const growthUp = locationId ? locationIndex(locationId) % 3 !== 1 : true;
  const endTotal = Math.round((locationId ? 4200 : 248420) * scale);

  return {
    week: {
      labels: weekLabels(locale),
      values: trendValues(12, endTotal, growthUp, 0.03),
    },
    month: {
      labels: monthLabels(locale),
      values: trendValues(12, endTotal, growthUp, 0.02),
    },
    year: {
      labels: yearLabels(locale),
      values: trendValues(5, endTotal, growthUp, 0.015),
    },
  };
}
