import { notFound } from "next/navigation";
import { SupplySourceScreen } from "@/components/supply/SupplySourceScreen";
import { isBusinessModelSlug, isHoldingB2B } from "@/libs/business-models/config";

export default async function ModelSupplyPage({
  params,
}: {
  params: Promise<{ businessModel: string }>;
}) {
  const { businessModel } = await params;
  if (!isBusinessModelSlug(businessModel) || !isHoldingB2B(businessModel)) {
    notFound();
  }
  return <SupplySourceScreen />;
}
