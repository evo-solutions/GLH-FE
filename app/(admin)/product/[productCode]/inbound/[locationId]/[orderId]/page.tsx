import { redirect } from "next/navigation";
import { getLocationBusinessModel } from "@/lib/businessModelLocationMap";
import { modelProductInboundOrderPath } from "@/lib/businessModelRoutes";

export default async function LegacyProductInboundOrderPage({
  params,
}: {
  params: Promise<{ productCode: string; locationId: string; orderId: string }>;
}) {
  const { productCode: rawCode, locationId, orderId } = await params;
  const productCode = decodeURIComponent(rawCode);
  const model = getLocationBusinessModel(locationId);
  redirect(modelProductInboundOrderPath(model, productCode, locationId, orderId));
}
