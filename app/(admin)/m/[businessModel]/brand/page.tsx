import { notFound } from "next/navigation";
import { BrandMarketingOverviewScreen } from "@/components/brand-marketing/BrandMarketingOverviewScreen";
import { isBusinessModelSlug, isBrandMarketingModel } from "@/libs/business-models/config";

export default async function ModelBrandOverviewPage({
  params,
}: {
  params: Promise<{ businessModel: string }>;
}) {
  const { businessModel } = await params;
  if (!isBusinessModelSlug(businessModel) || !isBrandMarketingModel(businessModel)) {
    notFound();
  }
  return <BrandMarketingOverviewScreen />;
}
