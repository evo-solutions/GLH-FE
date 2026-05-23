import { LocationListScreen } from "@/components/location/LocationListScreen";
import { requireOrgScope } from "@/libs/org-scope/page-guards";

export default async function BusinessModuleLocationPage({
  params,
}: {
  params: Promise<{ businessModule: string | string[] }>;
}) {
  const { businessModule } = await params;
  requireOrgScope(businessModule, { requireLocation: true });
  return <LocationListScreen />;
}
