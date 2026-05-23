import { CustomerListScreen } from "@/components/customer/CustomerListScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleCustomerPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[] }>;
}) {
  const { businessModule } = await params;
  requireOrgScope(businessModule);
  return <CustomerListScreen />;
}
