import { AppShell } from "@/components/layout/app-shell";
import { OrderTrackingView } from "@/features/order/components/order-tracking-view";

export default async function AcompanharPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell showCartPanel={false}>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <OrderTrackingView orderId={id} />
      </div>
    </AppShell>
  );
}
