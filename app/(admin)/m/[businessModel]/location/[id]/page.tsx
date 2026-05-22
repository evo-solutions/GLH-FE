import { LocationDetailScreen } from "@/components/location/LocationDetailScreen";

export default async function ModelLocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LocationDetailScreen locationId={id} />;
}
