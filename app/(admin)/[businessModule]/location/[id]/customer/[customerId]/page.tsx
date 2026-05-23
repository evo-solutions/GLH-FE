import { CustomerDetailScreen } from "@/components/location/CustomerDetailScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleCustomerDetailPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[]; id: string; customerId: string }>;
}) {
  const { businessModule, id, customerId } = await params;
  requireOrgScope(businessModule, { requireLocation: true });
  return (
    <CustomerDetailScreen locationId={id} customerId={customerId} />
  );
}
