"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { BusinessModelSlug } from "@/libs/business-models/config";
import { getBusinessModelConfig, type BusinessModelConfig } from "@/libs/business-models/config";

const BusinessModelContext = createContext<BusinessModelConfig | null>(null);

export function BusinessModelProvider({
  slug,
  children,
}: {
  slug: BusinessModelSlug;
  children: ReactNode;
}) {
  const config = getBusinessModelConfig(slug);
  return (
    <BusinessModelContext.Provider value={config}>{children}</BusinessModelContext.Provider>
  );
}

export function useBusinessModel(): BusinessModelConfig {
  const ctx = useContext(BusinessModelContext);
  if (!ctx) {
    throw new Error("useBusinessModel must be used within BusinessModelProvider");
  }
  return ctx;
}

export function useBusinessModelSlug(): BusinessModelSlug {
  return useBusinessModel().slug;
}

export function useOptionalBusinessModelSlug(): BusinessModelSlug | undefined {
  return useContext(BusinessModelContext)?.slug;
}
