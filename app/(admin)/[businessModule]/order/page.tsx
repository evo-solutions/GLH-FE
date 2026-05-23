import { OrderListScreen } from "@/components/order/OrderListScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleOrderPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[] }>;
}) {
  const { businessModule } = await params;
  requireOrgScope(businessModule);
  return <OrderListScreen />;
}
