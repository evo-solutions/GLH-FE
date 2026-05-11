import { InboundOrderDetailScreen } from "@/components/product/InboundOrderDetailScreen";

export default async function ProductInboundOrderPage({
  params,
}: {
  params: Promise<{ productCode: string; locationId: string; orderId: string }>;
}) {
  const { productCode: rawCode, locationId, orderId } = await params;
  const productCode = decodeURIComponent(rawCode);

  return (
    <InboundOrderDetailScreen
      productCode={productCode}
      locationId={locationId}
      orderId={orderId}
    />
  );
}
