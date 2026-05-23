import { GlobalCustomerDetailScreen } from "@/components/customer/GlobalCustomerDetailScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleGlobalCustomerDetailPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[]; customerId: string }>;
}) {
  const { businessModule, customerId } = await params;
  requireOrgScope(businessModule);
  return <GlobalCustomerDetailScreen globalId={customerId} />;
}
