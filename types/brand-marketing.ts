export type BrandMarketingRow = {
  id: string;
  name: string;
  status: string;
  metric: string;
  period: string;
  owner: string;
};

export type BrandMarketingTab =
  | "brandStrategy"
  | "campaigns"
  | "channels"
  | "partnerships"
  | "budgetPerformance";

export type BrandMarketingData = Record<BrandMarketingTab, BrandMarketingRow[]>;
