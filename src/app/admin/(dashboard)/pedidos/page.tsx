"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersFilters } from "@/features/admin/orders/components/orders-filters";
import { OrdersTable } from "@/features/admin/orders/components/orders-table";
import { DispatchBoard } from "@/features/admin/dispatch/components/dispatch-board";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { useOrdersFilters } from "@/features/admin/orders/hooks/use-orders-filters";

export default function AdminOrdersPage() {
  const { orders, ordersLoading } = useAdminData();
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("pedido");
  const initialOrder = orders.find((o) => o.id === initialOrderId) ?? null;
  const initialTab = searchParams.get("aba") === "chat" ? "chat" : "detalhes";

  const {
    search,
    setSearch,
    status,
    setStatus,
    paymentMethod,
    setPaymentMethod,
    page,
    setPage,
    totalPages,
    filteredCount,
    paginated,
  } = useOrdersFilters(orders);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          {ordersLoading ? "Carregando pedidos..." : `${filteredCount} pedido${filteredCount === 1 ? "" : "s"}`}
        </p>
      </div>

      <Tabs defaultValue="lista">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="atribuicao">Atribuição</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-4 flex flex-col gap-4">
          <OrdersFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
          <OrdersTable
            orders={paginated}
            loading={ordersLoading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            initialOrder={initialOrder}
            initialTab={initialTab}
          />
        </TabsContent>

        <TabsContent value="atribuicao" className="mt-4">
          <DispatchBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
