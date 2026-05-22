import { redirect } from "next/navigation";
import { getLocationBusinessModel } from "@/lib/businessModelLocationMap";
import { modelLocationCustomerPath } from "@/lib/businessModelRoutes";

export default async function LegacyLocationCustomerPage({
  params,
}: {
  params: Promise<{ id: string; customerId: string }>;
}) {
  const { id, customerId } = await params;
  const model = getLocationBusinessModel(id);
  redirect(modelLocationCustomerPath(model, id, customerId));
}
