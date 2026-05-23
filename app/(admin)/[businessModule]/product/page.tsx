import { ProductListScreen } from "@/components/product/ProductListScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleProductPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[] }>;
}) {
  const { businessModule } = await params;
  requireOrgScope(businessModule);
  return <ProductListScreen />;
}
