"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { screenIdFromPathname } from "@/lib/golden-lotus/constants/routes";
import { GoldenLotusChrome } from "./GoldenLotusChrome";

export function GoldenLotusShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const screen = screenIdFromPathname(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="gl-root">
      <GoldenLotusChrome
        screen={screen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        {children}
      </GoldenLotusChrome>
    </div>
  );
}
