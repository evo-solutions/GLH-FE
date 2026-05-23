"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { ModulePageHeaderTag } from "@/components/layout/ModulePageHeader.types";
import { useBusinessModuleScope } from "@/hooks/useBusinessModuleScope";

export function useModulePageHeaderMeta() {
  const t = useTranslations("moduleHeader");
  const tNav = useTranslations("nav");
  const { module } = useBusinessModuleScope();

  return useMemo(() => {
    if (!module) {
      const tags: ModulePageHeaderTag[] = [
        { key: "b2b", label: t("tagB2b"), color: "processing" },
        { key: "holding", label: t("tagHolding") },
      ];
      return {
        tags,
        breadcrumb: t("breadcrumbHolding"),
      };
    }

    const orgName = tNav(module.navLabelKey);
    const tags: ModulePageHeaderTag[] = [
      { key: "b2c", label: t("tagB2c"), color: "processing" },
      { key: "company", label: t("tagCompany") },
    ];
    return {
      tags,
      breadcrumb: t("breadcrumbOrg", { org: orgName }),
    };
  }, [module, t, tNav]);
}
