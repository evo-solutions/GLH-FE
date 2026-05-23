import { notFound } from "next/navigation";
import { InsightsDetailScreen } from "@/components/business-module/InsightsDetailScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleInsightsPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[] }>;
}) {
  const { businessModule } = await params;
  const scope = requireOrgScope(businessModule);

  return (
    <InsightsDetailScreen moduleId={scope.id} />
  );
}
