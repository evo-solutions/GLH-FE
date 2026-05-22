import { CustomerDetailScreen } from "@/components/location/CustomerDetailScreen";

export default async function ModelLocationCustomerPage({
  params,
}: {
  params: Promise<{ id: string; customerId: string }>;
}) {
  const { id, customerId } = await params;
  return <CustomerDetailScreen locationId={id} customerId={customerId} />;
}
