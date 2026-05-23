import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleOverviewPage({
  params,
}: {
  params: Promise<{ businessModule: string }>;
}) {
  const { businessModule } = await params;
  requireOrgScope(businessModule);
  return <DashboardScreen />;
}
