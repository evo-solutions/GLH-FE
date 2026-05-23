export type HeritageSectionRow = {
  id: string;
  name: string;
  status: string;
  metric: string;
  period: string;
  owner: string;
};

export type HeritageTradeTab =
  | "merchandiseDisplay"
  | "salesTraining"
  | "customerCare"
  | "salesPolicy"
  | "seasonalCampaigns"
  | "newStoreOpening";

export type HeritageInsightsTab =
  | "risks"
  | "opportunities"
  | "forecasts"
  | "recommendations";

export type HeritageModuleData = {
  tradeMarketing: Record<HeritageTradeTab, HeritageSectionRow[]>;
  insights: Record<HeritageInsightsTab, HeritageSectionRow[]>;
};
