import { OrdersList } from "@/features/customer/account/components/orders-list";

export default function ContaPedidosPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">Meus pedidos</h1>
      <OrdersList />
    </div>
  );
}
