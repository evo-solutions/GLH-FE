"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useTranslations } from "next-intl";

const { Header: AntHeader } = Layout;

export function Header({ onOpenNav }: { onOpenNav: () => void }) {
  const t = useTranslations();

  return (
    <AntHeader className="flex items-center justify-between gap-3 !px-4 md:!px-6 !py-3 shrink-0 !bg-background border-b border-border">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          type="text"
          className="!flex shrink-0 items-center justify-center !w-10 !h-10 md:!hidden"
          icon={<MenuOutlined className="text-lg text-pharma" />}
          onClick={onOpenNav}
          aria-label={t("nav.open")}
        />
        <span className="truncate text-pharma uppercase text-lg font-bold">
          {t("app_title")}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </AntHeader>
  );
}
