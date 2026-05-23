import { notFound } from "next/navigation";
import { TradeMarketingDetailScreen } from "@/components/business-module/TradeMarketingDetailScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleTradeMarketingPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[] }>;
}) {
  const { businessModule } = await params;
  const scope = requireOrgScope(businessModule, { requireTradeMarketing: true });

  return (
    <TradeMarketingDetailScreen
      moduleId={scope.id}
      moduleNavLabelKey={scope.navLabelKey}
    />
  );
}
