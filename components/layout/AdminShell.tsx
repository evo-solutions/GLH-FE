"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { NavDrawer } from "@/components/layout/NavDrawer";
import { Sidebar } from "@/components/layout/Sidebar";

const MOBILE_NAV_MQ = "(max-width: 768px)";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MQ);
    const onChange = (e: MediaQueryListEvent) => {
      if (!e.matches) setNavOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="admin-shell relative flex h-screen w-full flex-col overflow-hidden">
      <Header onOpenNav={() => setNavOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <div className="app-sidebar-desktop hidden md:block shrink-0 overflow-auto">
          <Sidebar />
        </div>
        <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
        <main className="min-h-0 flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
