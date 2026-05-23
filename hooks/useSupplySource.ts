"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import {
  fetchSupplySourceData,
  fetchSupplyUserCommands,
} from "@/services/supply-source/supply-source.service";
import type { SupplyPermissionCommand } from "@/types/supply-source";

export const supplySourceKeys = {
  all: ["supply-source"] as const,
  data: (locale: string) => [...supplySourceKeys.all, "data", locale] as const,
  permissions: () => [...supplySourceKeys.all, "permissions"] as const,
};

export function useSupplySourceData(enabled = true) {
  const locale = useLocale();

  return useQuery({
    queryKey: supplySourceKeys.data(locale),
    queryFn: () => fetchSupplySourceData(locale),
    enabled,
    staleTime: 60_000,
  });
}

export function useSupplyUserCommands(enabled = true) {
  return useQuery({
    queryKey: supplySourceKeys.permissions(),
    queryFn: fetchSupplyUserCommands,
    enabled,
    staleTime: 60_000,
  });
}

export function useSupplyPermissionCheck(commands: SupplyPermissionCommand[] | undefined) {
  const set = new Set(commands ?? []);

  return (command: SupplyPermissionCommand) => set.has(command);
}
