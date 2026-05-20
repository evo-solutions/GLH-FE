"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QUICK_ALERTS_VISIBLE } from "@/lib/dashboardQuickAlerts";
import type { DashboardQuickAlert } from "@/types/dashboard";

const ROTATE_MS = 30_000;
const ANIM_MS = 380;

function pickIncoming(
  pool: DashboardQuickAlert[],
  visible: DashboardQuickAlert[]
): DashboardQuickAlert {
  const visibleIds = new Set(visible.map((a) => a.id));
  const candidates = pool.filter((a) => !visibleIds.has(a.id));
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  const others = pool.filter((a) => a.id !== visible[0]?.id);
  return others[Math.floor(Math.random() * others.length)] ?? pool[0];
}

export function useRotatingQuickAlerts(pool: DashboardQuickAlert[]) {
  const [visible, setVisible] = useState(() =>
    pool.slice(0, QUICK_ALERTS_VISIBLE)
  );
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const poolRef = useRef(pool);
  const visibleRef = useRef(visible);
  const timersRef = useRef<number[]>([]);

  poolRef.current = pool;
  visibleRef.current = visible;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    setVisible(pool.slice(0, QUICK_ALERTS_VISIBLE));
  }, [pool]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const replaceOne = useCallback(() => {
    const prev = visibleRef.current;
    if (poolRef.current.length <= QUICK_ALERTS_VISIBLE || prev.length === 0) return;

    const outgoing = prev[prev.length - 1];
    setLeavingId(outgoing.id);

    schedule(() => {
      const incoming = pickIncoming(poolRef.current, prev);
      setVisible([incoming, ...prev.slice(0, QUICK_ALERTS_VISIBLE - 1)]);
      setLeavingId(null);
      setEnteringId(incoming.id);
      schedule(() => setEnteringId(null), ANIM_MS);
    }, ANIM_MS);
  }, [schedule]);

  const shuffle = useCallback(() => {
    setVisible((prev) => {
      if (prev.length < 2) return prev;
      const next = [...prev];
      const from = Math.floor(Math.random() * next.length);
      let to = Math.floor(Math.random() * next.length);
      if (to === from) to = (to + 1) % next.length;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  useEffect(() => {
    if (pool.length <= QUICK_ALERTS_VISIBLE) return;

    const tick = () => {
      if (Math.random() < 0.65) replaceOne();
      else shuffle();
    };

    const intervalId = window.setInterval(tick, ROTATE_MS);
    return () => window.clearInterval(intervalId);
  }, [pool.length, replaceOne, shuffle]);

  return { visible, leavingId, enteringId };
}
