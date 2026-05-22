"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { easeOutCubic } from "@/lib/liveRevenueCounter";

type Options = {
  minBumpVnd?: number;
  maxBumpVnd?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
};

export function useLiveRevenueCounter(initialVnd: number, options: Options = {}) {
  const {
    minBumpVnd = 45_000_000,
    maxBumpVnd = 180_000_000,
    minDelayMs = 1_200,
    maxDelayMs = 4_000,
  } = options;

  const displayRef = useRef(initialVnd);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const [targetVnd, setTargetVnd] = useState(initialVnd);
  const [displayVnd, setDisplayVnd] = useState(initialVnd);
  const [pulse, setPulse] = useState(false);
  const [lastDeltaVnd, setLastDeltaVnd] = useState<number | null>(null);

  const reset = useCallback(
    (base: number) => {
      displayRef.current = base;
      setTargetVnd(base);
      setDisplayVnd(base);
      setLastDeltaVnd(null);
    },
    []
  );

  useEffect(() => {
    reset(initialVnd);
  }, [initialVnd, reset]);

  useEffect(() => {
    const from = displayRef.current;
    const to = targetVnd;
    if (from === to) return;

    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const startAt = performance.now();
    const duration = 520;

    const tick = (now: number) => {
      const p = easeOutCubic(Math.min(1, (now - startAt) / duration));
      const next = Math.round(from + (to - from) * p);
      displayRef.current = next;
      setDisplayVnd(next);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [targetVnd]);

  useEffect(() => {
    const schedule = () => {
      const delay = minDelayMs + Math.random() * (maxDelayMs - minDelayMs);
      timerRef.current = setTimeout(() => {
        const bump = Math.floor(
          minBumpVnd + Math.random() * (maxBumpVnd - minBumpVnd)
        );
        setLastDeltaVnd(bump);
        setPulse(true);
        setTargetVnd((prev) => prev + bump);
        window.setTimeout(() => setPulse(false), 450);
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      if (timerRef.current != null) clearTimeout(timerRef.current);
    };
  }, [initialVnd, minBumpVnd, maxBumpVnd, minDelayMs, maxDelayMs]);

  return { displayVnd, pulse, lastDeltaVnd };
}
