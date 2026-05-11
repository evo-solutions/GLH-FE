export type ScreenId =
  | "dashboard"
  | "vendors"
  | "sku"
  | "customer"
  | "campaign"
  | "research"
  | "cases"
  | "hrm"
  | "ai"
  | "settings";

export type BadgeTone = "danger" | "warning" | "success" | "info";

export interface MockAlert {
  priority: string;
  signal: string;
  source: string;
  decision: string;
  owner: string;
  sla: string;
  status: BadgeTone;
  labelKey: string;
}

export interface MockVendor {
  code: string;
  name: string;
  score: number;
  regionKey: "north" | "central" | "south";
  city: string;
  contact: string;
  channel: string;
  rev: string;
  riskKey: BadgeTone | "low" | "medium" | "high";
  cov: string;
  trend: string;
  outlets: string;
  asm: string;
  syncedAt: string;
}

export interface MockSkuCard {
  name: string;
  sku: string;
  stock: string;
  cov: string;
  badgeKey: BadgeTone;
  trend: string;
  weekOrders: string;
}

export interface MockLowStockRow {
  id: string;
  sku: string;
  dc: string;
  onHand: string;
  safetyStock: string;
  avgDailyOut: string;
  /** Numeric days as string for display with daysUnit */
  daysCover: string;
  reorderProposal: string;
  nextInbound: string;
  planner: string;
  statusKey: BadgeTone;
}

export interface MockCampaign {
  title: string;
  period: string;
  roi: string;
  conv: string;
  statusKey: BadgeTone;
  desc: string;
}

export interface MockCampaignRoi {
  name: string;
  spend: string;
  rev: string;
  roi: string;
  conv: string;
  statusKey: BadgeTone;
  labelKey: string;
  period: string;
  audience: string;
  channel: string;
}

export interface MockCampaignVoucher {
  id: string;
  pool: string;
  issued: string;
  redeemed: string;
  push: string;
  openRate: string;
  expiry: string;
  costPerRedeem: string;
  budgetLeft: string;
}

export interface MockCustomerProfile {
  customerId: string;
  fullName: string;
  tier: string;
  tierSince: string;
  primaryChannel: string;
  phone: string;
  email: string;
  city: string;
  memberSince: string;
  lastSeen: string;
  clvIndex: string;
  consentMarketing: string;
}

export interface MockCustomerActivity {
  id: string;
  occurredAt: string;
  channel: string;
  touchpoint: string;
  detail: string;
  outcome: string;
}

export interface MockCustomerSegmentRow {
  id: string;
  segment: string;
  sharePct: string;
  labeledRev: string;
  orders90d: string;
}

export interface MockCustomerRetentionRow {
  period: string;
  retentionPct: string;
  note: string;
}

export interface MockCase {
  id: string;
  type: string;
  pri: string;
  sla: string;
  owner: string;
  statusKey: BadgeTone;
  labelKey: string;
  /** Intake / first receiver (display) */
  receivedBy: string;
  /** When the case was accepted into the queue (display) */
  receivedAt: string;
  /** Free-text current step / blockers (list view) */
  situation: string;
}

export interface MockAiRec {
  title: string;
  impactKey: "high" | "medium";
  conf: string;
  owner: string;
  statusKey: BadgeTone;
  detail: string;
}

export interface MockHrmApproval {
  id: string;
  requester: string;
  title: string;
  type: string;
  submitted: string;
  status: string;
  statusKey: BadgeTone;
}

export interface MockHrmStaff {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  dept: string;
  contact: string;
  joinDate: string;
  status: string;
  statusKey: BadgeTone;
}

/** Dashboard highlight strip (messages.dashboard.highlight) */
export type DashboardHighlightMsgs = {
  c1t: string;
  c1v: number;
  c1s: string;
  c2t: string;
  c2v: number;
  c3t: string;
  c3v: number;
};

export interface GoldenLotusBundle {
  mockData: {
    alerts: MockAlert[];
    vendors: MockVendor[];
    skuCards: MockSkuCard[];
    campaigns: MockCampaign[];
    campaignRoi: MockCampaignRoi[];
    campaignVouchers: MockCampaignVoucher[];
    customerProfile: MockCustomerProfile;
    customerActivities: MockCustomerActivity[];
    customerSegmentMix: MockCustomerSegmentRow[];
    customerRetentionSeries: MockCustomerRetentionRow[];
    cases: MockCase[];
    aiRecs: MockAiRec[];
    lowStock: MockLowStockRow[];
    hrmApprovals: MockHrmApproval[];
    hrmStaff: MockHrmStaff[];
  };
}
