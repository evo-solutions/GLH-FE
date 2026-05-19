"use client";

import type { ReactNode } from "react";
import { GoldenLotusToastProvider } from "@/lib/golden-lotus/context/GoldenLotusToastContext";
import { GoldenLotusAntd } from "./GoldenLotusAntd";

export function GoldenLotusProviders({ children }: { children: ReactNode }) {
  return (
    <GoldenLotusToastProvider>
      <GoldenLotusAntd>{children}</GoldenLotusAntd>
    </GoldenLotusToastProvider>
  );
}
