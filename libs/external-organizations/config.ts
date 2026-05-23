import type { ComponentType } from "react";
import {
  ExportOutlined,
  GlobalOutlined,
  MedicineBoxOutlined,
  ShopOutlined,
  ShoppingOutlined,
  ShareAltOutlined,
  ExperimentOutlined,
  AppleOutlined,
  SkinOutlined,
  BankOutlined,
} from "@ant-design/icons";
import type { OrgScopeConfig } from "@/libs/org-scope/types";

/** Menu group — không phải route. */
export const EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY = "eo-distributor-group";

export const EXTERNAL_ORGANIZATION_MENU_KEY = "external-organization";

export type ExternalOrganizationId =
  | "benhVienYhct"
  | "phongChanTriYhct"
  | "nhaThuoc"
  | "dnKdDuocLieu"
  | "dnSxDuoc"
  | "thucPhamChucNang"
  | "thucPhamBoSung"
  | "dnSxHoaMyPham"
  | "nhaPhanPhoiMt"
  | "nhaPhanPhoiMeBe"
  | "nhaPhanPhoiGt"
  | "kenhEcommerce"
  | "kenhSocialMedia"
  | "xuatKhau";

type ExternalOrgDef = {
  id: ExternalOrganizationId;
  basePath: string;
  menuKey: string;
  navLabelKey: string;
  icon: ComponentType<{ className?: string }>;
  parentMenuKey?: string;
};

const DEFS: ExternalOrgDef[] = [
  {
    id: "benhVienYhct",
    basePath: "ext-benh-vien-yhct",
    menuKey: "eo-benh-vien-yhct",
    navLabelKey: "extBenhVienYhct",
    icon: BankOutlined,
  },
  {
    id: "phongChanTriYhct",
    basePath: "ext-phong-chan-tri-yhct",
    menuKey: "eo-phong-chan-tri-yhct",
    navLabelKey: "extPhongChanTriYhct",
    icon: MedicineBoxOutlined,
  },
  {
    id: "nhaThuoc",
    basePath: "ext-nha-thuoc",
    menuKey: "eo-nha-thuoc",
    navLabelKey: "extNhaThuoc",
    icon: MedicineBoxOutlined,
  },
  {
    id: "dnKdDuocLieu",
    basePath: "ext-dn-kd-duoc-lieu",
    menuKey: "eo-dn-kd-duoc-lieu",
    navLabelKey: "extDnKdDuocLieu",
    icon: ExperimentOutlined,
  },
  {
    id: "dnSxDuoc",
    basePath: "ext-dn-sx-duoc",
    menuKey: "eo-dn-sx-duoc",
    navLabelKey: "extDnSxDuoc",
    icon: ExperimentOutlined,
  },
  {
    id: "thucPhamChucNang",
    basePath: "ext-thuc-pham-chuc-nang",
    menuKey: "eo-thuc-pham-chuc-nang",
    navLabelKey: "extThucPhamChucNang",
    icon: AppleOutlined,
  },
  {
    id: "thucPhamBoSung",
    basePath: "ext-thuc-pham-bo-sung",
    menuKey: "eo-thuc-pham-bo-sung",
    navLabelKey: "extThucPhamBoSung",
    icon: AppleOutlined,
  },
  {
    id: "dnSxHoaMyPham",
    basePath: "ext-dn-sx-hoa-my-pham",
    menuKey: "eo-dn-sx-hoa-my-pham",
    navLabelKey: "extDnSxHoaMyPham",
    icon: SkinOutlined,
  },
  {
    id: "nhaPhanPhoiMt",
    basePath: "ext-nha-phan-phoi-mt",
    menuKey: "eo-nha-phan-phoi-mt",
    navLabelKey: "extNhaPhanPhoiMt",
    icon: ShopOutlined,
    parentMenuKey: EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY,
  },
  {
    id: "nhaPhanPhoiMeBe",
    basePath: "ext-nha-phan-phoi-me-be",
    menuKey: "eo-nha-phan-phoi-me-be",
    navLabelKey: "extNhaPhanPhoiMeBe",
    icon: ShopOutlined,
    parentMenuKey: EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY,
  },
  {
    id: "nhaPhanPhoiGt",
    basePath: "ext-nha-phan-phoi-gt",
    menuKey: "eo-nha-phan-phoi-gt",
    navLabelKey: "extNhaPhanPhoiGt",
    icon: ShoppingOutlined,
    parentMenuKey: EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY,
  },
  {
    id: "kenhEcommerce",
    basePath: "ext-kenh-ecommerce",
    menuKey: "eo-kenh-ecommerce",
    navLabelKey: "extKenhEcommerce",
    icon: GlobalOutlined,
  },
  {
    id: "kenhSocialMedia",
    basePath: "ext-kenh-social-media",
    menuKey: "eo-kenh-social-media",
    navLabelKey: "extKenhSocialMedia",
    icon: ShareAltOutlined,
  },
  {
    id: "xuatKhau",
    basePath: "ext-xuat-khau",
    menuKey: "eo-xuat-khau",
    navLabelKey: "extXuatKhau",
    icon: ExportOutlined,
  },
];

export const EXTERNAL_ORGANIZATIONS: OrgScopeConfig[] = DEFS.map((d) => ({
  kind: "external" as const,
  id: d.id,
  basePath: d.basePath,
  menuKey: d.menuKey,
  navLabelKey: d.navLabelKey,
  icon: d.icon,
  hasLocation: true,
  hasTradeMarketing: true,
  parentMenuKey: d.parentMenuKey,
}));

/** Các tổ chức không thuộc nhóm nhà phân phối (thứ tự menu). */
export const EXTERNAL_ORGS_TOP_LEVEL = EXTERNAL_ORGANIZATIONS.filter(
  (o) => !o.parentMenuKey,
);

export const EXTERNAL_ORGS_DISTRIBUTOR_CHANNELS = EXTERNAL_ORGANIZATIONS.filter(
  (o) => o.parentMenuKey === EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY,
);

export const EXTERNAL_ORGANIZATION_BY_PATH = Object.fromEntries(
  EXTERNAL_ORGANIZATIONS.map((o) => [o.basePath, o]),
) as Record<string, OrgScopeConfig>;
