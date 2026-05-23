import { LocationDetailScreen } from "@/components/location/LocationDetailScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleLocationDetailPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[]; id: string }>;
}) {
  const { businessModule, id } = await params;
  requireOrgScope(businessModule, { requireLocation: true });
  return <LocationDetailScreen locationId={id} />;
}
