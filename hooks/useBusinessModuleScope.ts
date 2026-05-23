"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { OrgScopeConfig } from "@/libs/org-scope/types";
import { getOrgScopeFromPathname } from "@/libs/org-scope/resolve";

export function useBusinessModuleScope(): {
  module: OrgScopeConfig | undefined;
  moduleBasePath: string | undefined;
} {
  const pathname = usePathname();

  return useMemo(() => {
    const module = getOrgScopeFromPathname(pathname);
    return {
      module,
      moduleBasePath: module?.basePath,
    };
  }, [pathname]);
}
