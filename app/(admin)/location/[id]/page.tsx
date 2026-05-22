import { redirect } from "next/navigation";
import { getLocationBusinessModel } from "@/lib/businessModelLocationMap";
import { modelLocationDetailPath } from "@/lib/businessModelRoutes";

export default async function LegacyLocationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const model = getLocationBusinessModel(id);
  redirect(modelLocationDetailPath(model, id, tab));
}
