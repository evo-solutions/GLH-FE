"use client";

import { plqRegionDisplayCode } from "@/libs/supply-source/layout";
import { MaskedValue } from "./MaskedValue";
import type { SupplyGrowingRegion } from "@/types/supply-source";

export function SupplyRegionSidebar({
  regions,
  selectedId,
  hasRegionPermission,
  onSelect,
}: {
  regions: SupplyGrowingRegion[];
  selectedId: string;
  hasRegionPermission: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="supply-sidebar" aria-label="Growing regions">
      {regions.map((region) => {
        const active = region.id === selectedId;
        return (
          <button
            key={region.id}
            type="button"
            className={`supply-sidebar-item${active ? " supply-sidebar-item--active" : ""}`}
            onClick={() => onSelect(region.id)}
          >
            <span className="supply-sidebar-item-name">
              {hasRegionPermission ? (
                region.name
              ) : (
                <MaskedValue value={region.name} allowed={false} />
              )}
            </span>
            <span className="supply-sidebar-item-code">
              {plqRegionDisplayCode(region.regionCode)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
