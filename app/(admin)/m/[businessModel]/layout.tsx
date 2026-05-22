import { notFound } from "next/navigation";
import { BusinessModelSubNav } from "@/components/layout/BusinessModelSubNav";
import { BusinessModelProvider } from "@/libs/business-models/BusinessModelContext";
import { isBusinessModelSlug } from "@/libs/business-models/config";

export default async function BusinessModelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ businessModel: string }>;
}) {
  const { businessModel } = await params;
  if (!isBusinessModelSlug(businessModel)) {
    notFound();
  }

  return (
    <BusinessModelProvider slug={businessModel}>
      <BusinessModelSubNav />
      {children}
    </BusinessModelProvider>
  );
}
