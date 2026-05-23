export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Parse highlight `todayValue` (billions) from mock/API. */
export function parseRevenueBillions(display: string): number {
  const n = parseFloat(display.replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function formatRevenueBillions(value: number, locale: string): string {
  const loc = locale === "en" ? "en-US" : locale === "zh" ? "zh-CN" : "vi-VN";
  return value.toLocaleString(loc, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Random tick size in VND (for “vừa ghi nhận” line). */
export function nextRevenueIncrementVnd(
  minVnd = 12_000_000,
  maxVnd = 72_000_000,
): number {
  return Math.round(randomBetween(minVnd, maxVnd) / 1_000) * 1_000;
}

export function formatIncrementVnd(amountVnd: number, locale: string): string {
  const loc = locale === "en" ? "en-US" : locale === "zh" ? "zh-CN" : "vi-VN";
  const formatted = amountVnd.toLocaleString(loc, { maximumFractionDigits: 0 });
  if (locale === "en") return `$${formatted}`;
  if (locale === "zh") return `¥${formatted}`;
  return `₫${formatted}`;
}

export function nextRevenueTickDelayMs(
  minMs = 2_000,
  maxMs = 6_500,
): number {
  return Math.round(randomBetween(minMs, maxMs));
}

export function nextRevenueIncrementBillions(
  min = 0.002,
  max = 0.018,
): number {
  return Math.round(randomBetween(min, max) * 1000) / 1000;
}
