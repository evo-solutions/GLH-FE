import { ProductDetailScreen } from "@/components/product/ProductDetailScreen";

export default async function ModelProductDetailPage({
  params,
}: {
  params: Promise<{ productCode: string }>;
}) {
  const { productCode } = await params;
  return <ProductDetailScreen productCode={decodeURIComponent(productCode)} />;
}
