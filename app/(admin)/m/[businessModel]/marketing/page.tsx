import { notFound } from "next/navigation";
import { MarketingScreen } from "@/components/marketing/MarketingScreen";
import {
  getBusinessModelConfig,
  isBusinessModelSlug,
} from "@/libs/business-models/config";

export default async function ModelMarketingPage({
  params,
}: {
  params: Promise<{ businessModel: string }>;
}) {
  const { businessModel } = await params;
  if (!isBusinessModelSlug(businessModel)) notFound();

  const config = getBusinessModelConfig(businessModel);
  if (!config.modules.includes("marketing")) notFound();

  return <MarketingScreen />;
}
