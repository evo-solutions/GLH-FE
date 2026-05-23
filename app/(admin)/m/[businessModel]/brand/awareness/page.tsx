import { notFound } from "next/navigation";
import { BrandAwarenessScreen } from "@/components/brand-marketing/BrandAwarenessScreen";
import { isBusinessModelSlug, isBrandMarketingModel } from "@/libs/business-models/config";

export default async function ModelBrandAwarenessPage({
  params,
}: {
  params: Promise<{ businessModel: string }>;
}) {
  const { businessModel } = await params;
  if (!isBusinessModelSlug(businessModel) || !isBrandMarketingModel(businessModel)) {
    notFound();
  }
  return <BrandAwarenessScreen />;
}
