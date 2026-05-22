import { GlobalCustomerDetailScreen } from "@/components/customer/GlobalCustomerDetailScreen";

export default async function ModelCustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  return <GlobalCustomerDetailScreen globalId={customerId} />;
}
