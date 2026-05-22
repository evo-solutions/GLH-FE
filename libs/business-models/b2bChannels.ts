import type { B2BCustomerSegmentKey } from "@/lib/b2bCustomerCatalog";

/** Slug URL — mỗi phân khúc B2B = một đơn vị cùng cấp Thảo dược di sản */
export const B2B_CHANNEL_SLUGS = [
  "benh-vien-yhct",
  "phong-chan-tri-yhct",
  "nha-thuoc",
  "dn-duoc-lieu",
  "dn-san-xuat-duoc",
  "dn-san-xuat-my-pham",
  "npp-mt",
  "npp-mbaby",
  "npp-gt",
  "kenh-ecommerce",
  "kenh-social",
  "nhap-khau",
  "xuat-khau",
] as const;

export type B2BChannelSlug = (typeof B2B_CHANNEL_SLUGS)[number];

export interface B2BChannelDefinition {
  slug: B2BChannelSlug;
  navKey: string;
  segmentKey: B2BCustomerSegmentKey;
}

/** Thứ tự sidebar theo yêu cầu nghiệp vụ */
export const B2B_CHANNEL_DEFINITIONS: B2BChannelDefinition[] = [
  { slug: "benh-vien-yhct", navKey: "benhVienYhct", segmentKey: "hospital-tcm" },
  { slug: "phong-chan-tri-yhct", navKey: "phongChanTriYhct", segmentKey: "clinic-tcm" },
  { slug: "nha-thuoc", navKey: "nhaThuoc", segmentKey: "pharmacy" },
  { slug: "dn-duoc-lieu", navKey: "dnDuocLieu", segmentKey: "herbal-trading" },
  { slug: "dn-san-xuat-duoc", navKey: "dnSanXuatDuoc", segmentKey: "pharma-manufacturer" },
  { slug: "dn-san-xuat-my-pham", navKey: "dnSanXuatMyPham", segmentKey: "cosmetics-manufacturer" },
  { slug: "npp-mt", navKey: "nppMt", segmentKey: "distributor-mt" },
  { slug: "npp-mbaby", navKey: "nppMbaby", segmentKey: "distributor-mbaby" },
  { slug: "npp-gt", navKey: "nppGt", segmentKey: "distributor-gt" },
  { slug: "kenh-ecommerce", navKey: "kenhEcommerce", segmentKey: "ecommerce" },
  { slug: "kenh-social", navKey: "kenhSocial", segmentKey: "social-media" },
  { slug: "nhap-khau", navKey: "nhapKhau", segmentKey: "import" },
  { slug: "xuat-khau", navKey: "xuatKhau", segmentKey: "export" },
];

const SLUG_TO_SEGMENT = Object.fromEntries(
  B2B_CHANNEL_DEFINITIONS.map((d) => [d.slug, d.segmentKey])
) as Record<B2BChannelSlug, B2BCustomerSegmentKey>;

const SEGMENT_TO_SLUG = Object.fromEntries(
  B2B_CHANNEL_DEFINITIONS.map((d) => [d.segmentKey, d.slug])
) as Record<B2BCustomerSegmentKey, B2BChannelSlug>;

const CHANNEL_SLUG_SET = new Set<string>(B2B_CHANNEL_SLUGS);

export function isB2BChannelSlug(slug: string): slug is B2BChannelSlug {
  return CHANNEL_SLUG_SET.has(slug);
}

export function getSegmentKeyForChannelSlug(slug: B2BChannelSlug): B2BCustomerSegmentKey {
  return SLUG_TO_SEGMENT[slug];
}

export function getChannelSlugForSegmentKey(
  segmentKey: B2BCustomerSegmentKey
): B2BChannelSlug | undefined {
  return SEGMENT_TO_SLUG[segmentKey];
}

export function getB2BChannelDefinition(
  slug: B2BChannelSlug
): B2BChannelDefinition | undefined {
  return B2B_CHANNEL_DEFINITIONS.find((d) => d.slug === slug);
}

/** Sidebar: NHÀ PHÂN PHỐI (cha) → MT · Mẹ Bé · GT (con). */
export const B2B_DISTRIBUTOR_GROUP_KEY = "bm-group-nha-phan-phoi";

export const B2B_DISTRIBUTOR_CHANNEL_SLUGS = [
  "npp-mt",
  "npp-mbaby",
  "npp-gt",
] as const satisfies readonly B2BChannelSlug[];

export function isB2BDistributorChannelSlug(slug: string): boolean {
  return (B2B_DISTRIBUTOR_CHANNEL_SLUGS as readonly string[]).includes(slug);
}
