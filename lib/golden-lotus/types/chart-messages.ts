export type GlChartMsgs = {
  dashboard: {
    charts: {
      months: string[];
      weeks: string[];
      vendorLabels: string[];
      campaignLabels: string[];
      segLabels: string[];
      custPieLabels: string[];
      retentionX: string[];
    };
  };
  sku: { charts: { skuLabels: string[] } };
  shell: { toastRealtime: string[] };
};
