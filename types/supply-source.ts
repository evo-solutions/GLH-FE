export type SupplyScopeTab = "domestic" | "international" | "import";

export type SupplyDetailTab = "regionPartner" | "cultivation" | "logisticsPrice";

export type SupplyInfoSection =
  | "location"
  | "enterprise"
  | "soilClimate"
  | "species"
  | "harvestYield"
  | "processingLogistics"
  | "pricingTerms";

export type SupplyPermissionCommand =
  | "GLH.SUPPLY.REGION.VIEW"
  | "GLH.SUPPLY.LOCATION.VIEW"
  | "GLH.SUPPLY.ENTERPRISE.VIEW"
  | "GLH.SUPPLY.SOIL_CLIMATE.VIEW"
  | "GLH.SUPPLY.SPECIES.VIEW"
  | "GLH.SUPPLY.HARVEST.VIEW"
  | "GLH.SUPPLY.PROCESSING.VIEW"
  | "GLH.SUPPLY.PRICING.VIEW";

export type SupplyField = {
  key: string;
  label: string;
  value: string;
};

export type SupplySection = {
  id: SupplyInfoSection;
  permissionCommand: SupplyPermissionCommand;
  fields: SupplyField[];
};

export type SupplyGrowingRegion = {
  id: string;
  regionCode: string;
  name: string;
  permissionCommand: SupplyPermissionCommand;
  sections: SupplySection[];
};

export type SupplySourceScopeData = {
  scope: SupplyScopeTab;
  regions: SupplyGrowingRegion[];
};

export type SupplySourceData = Record<SupplyScopeTab, SupplySourceScopeData>;
