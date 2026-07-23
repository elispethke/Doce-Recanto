"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUS_FLOW, ORDER_STATUS_META, PAYMENT_METHOD_LABELS } from "@/features/admin/shared/lib/order-status";
import type { OrderPaymentMethod, OrderStatus } from "@/types/firebase-models";

export function OrdersFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  paymentMethod,
  onPaymentMethodChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  status: OrderStatus | "todos";
  onStatusChange: (value: OrderStatus | "todos") => void;
  paymentMethod: OrderPaymentMethod | "todos";
  onPaymentMethodChange: (value: OrderPaymentMethod | "todos") => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por número, cliente ou telefone..."
          className="h-9 pl-8"
        />
      </div>

      <Select value={status} onValueChange={(value) => onStatusChange(value as OrderStatus | "todos")}>
        <SelectTrigger className="h-9 w-full sm:w-48">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os status</SelectItem>
          {ORDER_STATUS_FLOW.map((s) => (
            <SelectItem key={s} value={s}>
              {ORDER_STATUS_META[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={paymentMethod}
        onValueChange={(value) => onPaymentMethodChange(value as OrderPaymentMethod | "todos")}
      >
        <SelectTrigger className="h-9 w-full sm:w-44">
          <SelectValue placeholder="Pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas as formas</SelectItem>
          {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
