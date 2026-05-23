"use client";

import { useEffect, useState } from "react";
import { SupplyRegionDetail } from "./SupplyRegionDetail";
import { SupplyRegionSidebar } from "./SupplyRegionSidebar";
import type { SupplyDetailTab, SupplyPermissionCommand, SupplySourceScopeData } from "@/types/supply-source";

export function SupplyScopeWorkspace({
  scopeData,
  hasRegionPermission,
  hasCommand,
}: {
  scopeData: SupplySourceScopeData;
  hasRegionPermission: boolean;
  hasCommand: (cmd: SupplyPermissionCommand) => boolean;
}) {
  const regions = scopeData.regions;
  const [selectedId, setSelectedId] = useState(regions[0]?.id ?? "");
  const [detailTab, setDetailTab] = useState<SupplyDetailTab>("regionPartner");

  useEffect(() => {
    if (regions.length === 0) {
      setSelectedId("");
      return;
    }
    if (!regions.some((r) => r.id === selectedId)) {
      setSelectedId(regions[0].id);
      setDetailTab("regionPartner");
    }
  }, [regions, selectedId]);

  const selected = regions.find((r) => r.id === selectedId);

  if (regions.length === 0) {
    return null;
  }

  return (
    <div className="supply-workspace">
      <SupplyRegionSidebar
        regions={regions}
        selectedId={selectedId}
        hasRegionPermission={hasRegionPermission}
        onSelect={(id) => {
          setSelectedId(id);
          setDetailTab("regionPartner");
        }}
      />
      {selected ? (
        <SupplyRegionDetail
          region={selected}
          detailTab={detailTab}
          onDetailTabChange={setDetailTab}
          hasRegionPermission={hasRegionPermission}
          hasCommand={hasCommand}
        />
      ) : null}
    </div>
  );
}
