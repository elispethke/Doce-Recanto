import { AppShell } from "@/components/layout/app-shell";
import { OrderConfirmation } from "@/features/order/components/order-confirmation";

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AppShell showCartPanel={false}>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <OrderConfirmation orderId={id} />
      </div>
    </AppShell>
  );
}
