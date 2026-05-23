import { notFound } from "next/navigation";
import { BrandCampaignsScreen } from "@/components/brand-marketing/BrandCampaignsScreen";
import { isBusinessModelSlug, isBrandMarketingModel } from "@/libs/business-models/config";

export default async function ModelBrandCampaignsPage({
  params,
}: {
  params: Promise<{ businessModel: string }>;
}) {
  const { businessModel } = await params;
  if (!isBusinessModelSlug(businessModel) || !isBrandMarketingModel(businessModel)) {
    notFound();
  }
  return <BrandCampaignsScreen />;
}
