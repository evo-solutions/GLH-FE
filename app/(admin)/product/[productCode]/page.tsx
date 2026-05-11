import { ProductDetailScreen } from "@/components/product/ProductDetailScreen";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productCode: string }>;
}) {
  const { productCode: raw } = await params;
  const productCode = decodeURIComponent(raw);
  return <ProductDetailScreen productCode={productCode} />;
}
