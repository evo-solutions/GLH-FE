import type { ComponentType } from "react";
import type { OrgScopeBrandId } from "@/services/business-module/mock-brands";

export type OrgScopeKind = "subsidiary" | "external";

export type OrgScopeConfig = {
  kind: OrgScopeKind;
  id: OrgScopeBrandId;
  basePath: string;
  menuKey: string;
  navLabelKey: string;
  icon: ComponentType<{ className?: string }>;
  /** Cho phép route /location (link từ SP, đơn, …). */
  hasLocation: boolean;
  /** Hiện mục Cơ sở trên sidebar — mặc định = hasLocation. */
  showLocationInNav?: boolean;
  hasTradeMarketing: boolean;
  /** Menu group cha (vd. nhà phân phối — 3 kênh). */
  parentMenuKey?: string;
};
