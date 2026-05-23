import { OrderDetailScreen } from "@/components/order/OrderDetailScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleOrderDetailPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[]; orderId: string }>;
}) {
  const { businessModule, orderId } = await params;
  requireOrgScope(businessModule);
  return <OrderDetailScreen orderId={orderId} />;
}
