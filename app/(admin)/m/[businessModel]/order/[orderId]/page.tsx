import { OrderDetailScreen } from "@/components/order/OrderDetailScreen";

export default async function ModelOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderDetailScreen orderId={orderId} />;
}
