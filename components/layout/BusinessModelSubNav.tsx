"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getModuleNavItems } from "@/libs/business-models/modules";
import { useBusinessModel } from "@/libs/business-models/BusinessModelContext";
import "./businessModelSubNav.css";

export function BusinessModelSubNav() {
  const t = useTranslations("nav.sections");
  const config = useBusinessModel();
  const pathname = usePathname();
  const items = getModuleNavItems(config);

  return (
    <nav className="bm-subnav" aria-label="Phân hệ đơn vị kinh doanh">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bm-subnav__link${active ? " bm-subnav__link--active" : ""}`}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
