import type { SupplyInfoSection, SupplyPermissionCommand } from "@/types/supply-source";

export const SUPPLY_SECTION_PERMISSION: Record<
  SupplyInfoSection,
  SupplyPermissionCommand
> = {
  location: "GLH.SUPPLY.LOCATION.VIEW",
  enterprise: "GLH.SUPPLY.ENTERPRISE.VIEW",
  soilClimate: "GLH.SUPPLY.SOIL_CLIMATE.VIEW",
  species: "GLH.SUPPLY.SPECIES.VIEW",
  harvestYield: "GLH.SUPPLY.HARVEST.VIEW",
  processingLogistics: "GLH.SUPPLY.PROCESSING.VIEW",
  pricingTerms: "GLH.SUPPLY.PRICING.VIEW",
};

export const SUPPLY_REGION_PERMISSION: SupplyPermissionCommand =
  "GLH.SUPPLY.REGION.VIEW";
