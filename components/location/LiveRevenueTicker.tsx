"use client";

import { useLocale, useTranslations } from "next-intl";
import { useLiveRevenueCounter } from "@/hooks/useLiveRevenueCounter";
import {
  formatJustInDelta,
  formatLiveRevenueVnd,
  locationLiveRevenueBase,
} from "@/lib/locationLiveRevenue";
import { useMemo } from "react";

export function LiveRevenueTicker({ locationId }: { locationId: string }) {
  const t = useTranslations("location.liveRevenue");
  const locale = useLocale();

  const baseVnd = useMemo(() => locationLiveRevenueBase(locationId), [locationId]);

  const { displayVnd, pulse, lastDeltaVnd } = useLiveRevenueCounter(baseVnd, {
    minBumpVnd: 45_000,
    maxBumpVnd: 425_000,
    minDelayMs: 1_200,
    maxDelayMs: 4_000,
  });

  return (
    <section className="location-live-revenue" aria-live="polite">
      <div className="location-live-revenue__head">
        <div className="location-live-revenue__titles">
          <span className="location-live-revenue__badge">{t("live")}</span>
          <h3 className="location-live-revenue__title">{t("title")}</h3>
        </div>
        <span className="location-live-revenue__hint">{t("today")}</span>
      </div>

      <p
        className={`location-live-revenue__amount ${pulse ? "location-live-revenue__amount--pulse" : ""}`}
      >
        {formatLiveRevenueVnd(locale, displayVnd)}
      </p>

      {lastDeltaVnd != null ? (
        <p className="location-live-revenue__tick">
          {t("justIn", { amount: formatJustInDelta(locale, lastDeltaVnd) })}
        </p>
      ) : null}
    </section>
  );
}
