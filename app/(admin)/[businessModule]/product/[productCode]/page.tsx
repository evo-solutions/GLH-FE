import { ProductDetailScreen } from "@/components/product/ProductDetailScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleProductDetailPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[]; productCode: string }>;
}) {
  const { businessModule, productCode } = await params;
  requireOrgScope(businessModule);
  return <ProductDetailScreen productCode={decodeURIComponent(productCode)} />;
}
