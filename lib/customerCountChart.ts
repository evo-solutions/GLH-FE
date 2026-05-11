import { locationIndex } from "@/lib/locationRegistry";
import type { CustomerCountChartData } from "@/types/dashboard";

type Locale = "vi" | "en" | "zh";

function monthLabels(locale: Locale): string[] {
  if (locale === "en") {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }
  if (locale === "zh") {
    return ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  }
  return ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
}

function weekLabels(): string[] {
  return Array.from({ length: 52 }, (_, i) => `W${i + 1}`);
}

function dayLabels(locale: Locale): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    if (locale === "en") return `D${day}`;
    if (locale === "zh") return `${day}日`;
    return `N${day}`;
  });
}

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

/** Số lượng khách hàng theo tháng / tuần / ngày — toàn hệ thống hoặc theo cơ sở. */
export function buildCustomerCountChart(
  locale: Locale,
  locationId?: string
): CustomerCountChartData {
  const scale = locationScale(locationId);
  const growthUp = locationId ? locationIndex(locationId) % 3 !== 1 : true;
  const endTotal = Math.round((locationId ? 4200 : 248420) * scale);

  return {
    month: {
      labels: monthLabels(locale),
      values: trendValues(12, endTotal, growthUp, 0.02),
    },
    week: {
      labels: weekLabels(),
      values: trendValues(52, endTotal, growthUp, 0.035),
    },
    day: {
      labels: dayLabels(locale),
      values: trendValues(30, endTotal, growthUp, 0.04),
    },
  };
}
