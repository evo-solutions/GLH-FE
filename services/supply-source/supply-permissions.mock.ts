import type { SupplyPermissionCommand } from "@/types/supply-source";

/** Mock quyền người dùng hiện tại — một số lệnh bị thiếu để minh họa mã hóa. */
export const mockUserSupplyCommands: SupplyPermissionCommand[] = [
  "GLH.SUPPLY.REGION.VIEW",
  "GLH.SUPPLY.LOCATION.VIEW",
  "GLH.SUPPLY.ENTERPRISE.VIEW",
  "GLH.SUPPLY.SOIL_CLIMATE.VIEW",
  "GLH.SUPPLY.SPECIES.VIEW",
  "GLH.SUPPLY.HARVEST.VIEW",
  "GLH.SUPPLY.PROCESSING.VIEW",
];
