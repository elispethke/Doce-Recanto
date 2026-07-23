"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomersTable, type CustomerRow } from "@/features/admin/customers/components/customers-table";
import { CustomerDetailSheet } from "@/features/admin/customers/components/customer-detail-sheet";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";

export default function AdminCustomersPage() {
  const { customers, customersLoading, orders } = useAdminData();
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<CustomerRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const rows = useMemo<CustomerRow[]>(() => {
    const term = search.trim().toLowerCase();
    return customers
      .filter((customer) => !term || customer.name.toLowerCase().includes(term) || customer.email.toLowerCase().includes(term))
      .map((customer) => {
        const customerOrders = orders.filter((order) => order.customerId === customer.id && order.status !== "cancelado");
        const lastPurchase = customerOrders.reduce<Date | null>((latest, order) => {
          const date = order.createdAt?.toDate?.();
          if (!date) return latest;
          return !latest || date > latest ? date : latest;
        }, null);
        return {
          customer,
          orderCount: customerOrders.length,
          totalSpent: customerOrders.reduce((sum, order) => sum + order.total, 0),
          lastPurchase,
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [customers, orders, search]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          {customersLoading ? "Carregando..." : `${customers.length} cliente${customers.length === 1 ? "" : "s"} cadastrado${customers.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou e-mail..." className="h-9 pl-8" />
      </div>

      <CustomersTable
        rows={rows}
        loading={customersLoading}
        onSelect={(row) => {
          setSelectedRow(row);
          setDetailOpen(true);
        }}
      />

      <CustomerDetailSheet row={selectedRow} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
