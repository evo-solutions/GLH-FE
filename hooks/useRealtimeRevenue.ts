"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  formatIncrementVnd,
  formatRevenueBillions,
  nextRevenueIncrementVnd,
  nextRevenueTickDelayMs,
} from "@/lib/realtimeRevenue";

type UseRealtimeRevenueOptions = {
  enabled?: boolean;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  minIncrementVnd?: number;
  maxIncrementVnd?: number;
};

/** Simulated live revenue: random delay, then add random VND amount. */
export function useRealtimeRevenue(
  initialBillions: number,
  {
    enabled = true,
    minIntervalMs = 2_500,
    maxIntervalMs = 7_000,
    minIncrementVnd = 12_000_000,
    maxIncrementVnd = 72_000_000,
  }: UseRealtimeRevenueOptions = {},
) {
  const locale = useLocale();
  const [value, setValue] = useState(initialBillions);
  const [lastIncrementVnd, setLastIncrementVnd] = useState(0);
  const [tickFlash, setTickFlash] = useState(false);
  const valueRef = useRef(initialBillions);

  useEffect(() => {
    valueRef.current = initialBillions;
    setValue(initialBillions);
    setLastIncrementVnd(0);
  }, [initialBillions]);

  useEffect(() => {
    if (!enabled) return;

    let timeoutId = window.setTimeout(function tick() {
      const deltaVnd = nextRevenueIncrementVnd(minIncrementVnd, maxIncrementVnd);
      const deltaBillions =
        Math.round((deltaVnd / 1_000_000_000) * 1000) / 1000;
      const next = Math.round((valueRef.current + deltaBillions) * 1000) / 1000;
      valueRef.current = next;
      setValue(next);
      setLastIncrementVnd(deltaVnd);
      setTickFlash(true);
      window.setTimeout(() => setTickFlash(false), 800);

      timeoutId = window.setTimeout(
        tick,
        nextRevenueTickDelayMs(minIntervalMs, maxIntervalMs),
      );
    }, nextRevenueTickDelayMs(minIntervalMs, maxIntervalMs));

    return () => window.clearTimeout(timeoutId);
  }, [
    enabled,
    minIntervalMs,
    maxIntervalMs,
    minIncrementVnd,
    maxIncrementVnd,
  ]);

  return {
    value,
    tickFlash,
    lastIncrementVnd,
    formatted: formatRevenueBillions(value, locale),
    formattedIncrement:
      lastIncrementVnd > 0
        ? formatIncrementVnd(lastIncrementVnd, locale)
        : null,
  };
}
