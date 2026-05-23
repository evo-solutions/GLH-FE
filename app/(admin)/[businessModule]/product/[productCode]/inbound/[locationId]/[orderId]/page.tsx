import { InboundOrderDetailScreen } from "@/components/product/InboundOrderDetailScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleInboundOrderDetailPage({
  params,
}: {
  params: Promise<{
    businessModule: string | string[];
    productCode: string;
    locationId: string;
    orderId: string;
  }>;
}) {
  const { businessModule, productCode, locationId, orderId } = await params;
  requireOrgScope(businessModule);
  return (
    <InboundOrderDetailScreen
      productCode={decodeURIComponent(productCode)}
      locationId={locationId}
      orderId={orderId}
    />
  );
}
