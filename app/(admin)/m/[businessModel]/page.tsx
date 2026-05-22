import { redirect } from "next/navigation";
import { isBusinessModelSlug } from "@/libs/business-models/config";
import { modelDefaultModulePath } from "@/lib/businessModelRoutes";
import { notFound } from "next/navigation";

export default async function BusinessModelHubPage({
  params,
}: {
  params: Promise<{ businessModel: string }>;
}) {
  const { businessModel } = await params;
  if (!isBusinessModelSlug(businessModel)) notFound();
  redirect(modelDefaultModulePath(businessModel));
}
