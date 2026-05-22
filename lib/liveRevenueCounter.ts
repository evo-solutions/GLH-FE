export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/** Parse giá trị highlight (vd. 1.24 + " tỷ") sang VND. */
export function parseHighlightRevenueVnd(todayValue: string, unit?: string): number {
  const n = parseFloat(String(todayValue).replace(",", "."));
  if (!Number.isFinite(n)) return 1.24e9;
  const u = (unit ?? "").toLowerCase();
  if (u.includes("tỷ") || u.includes("ty") || u.includes(" b") || u.includes("亿")) {
    return n * 1e9;
  }
  if (u.includes("tr") || u.includes("m")) return n * 1e6;
  return n * 1e9;
}

export function formatRevenueVnd(locale: string, value: number): string {
  if (locale === "zh") {
    if (value >= 1_000_000) {
      return `₫${(value / 1_000_000).toLocaleString("zh-CN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}M`;
    }
    return `₫${value.toLocaleString("zh-CN")}`;
  }
  if (locale === "en") {
    return `₫${value.toLocaleString("en-US")}`;
  }
  return `₫${value.toLocaleString("vi-VN")}`;
}

export function formatJustInDelta(locale: string, deltaVnd: number): string {
  if (deltaVnd >= 100_000_000) {
    const ty = deltaVnd / 1e9;
    if (locale === "zh") return `+${ty.toFixed(2)}亿`;
    if (locale === "en") return `+${ty.toFixed(2)}B`;
    return `+${ty.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} tỷ`;
  }
  return `+${formatRevenueVnd(locale, deltaVnd)}`;
}

export type LiveRevenueDisplayParts = {
  main: string;
  unit: string;
};

/** Hiển thị theo đơn vị gốc của card (tỷ / B / 亿). */
export function formatLiveRevenueParts(
  locale: string,
  vnd: number,
  unitTemplate?: string
): LiveRevenueDisplayParts {
  const billions = vnd / 1e9;
  const unit =
    unitTemplate ??
    (locale === "zh" ? " 亿" : locale === "en" ? " B" : " tỷ");

  if (locale === "vi") {
    return {
      main: billions.toLocaleString("vi-VN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      unit,
    };
  }

  return {
    main: billions.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    unit,
  };
}
