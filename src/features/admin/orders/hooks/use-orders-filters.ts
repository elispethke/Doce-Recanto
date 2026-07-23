import { useMemo, useState } from "react";
import type { OrderDoc, OrderPaymentMethod, OrderStatus } from "@/types/firebase-models";

const PAGE_SIZE = 10;

export function useOrdersFilters(orders: OrderDoc[]) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "todos">("todos");
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod | "todos">("todos");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "todos" && order.status !== status) return false;
      if (paymentMethod !== "todos" && order.paymentMethod !== paymentMethod) return false;
      if (!term) return true;
      return (
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerPhone.toLowerCase().includes(term)
      );
    });
  }, [orders, search, status, paymentMethod]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value: OrderStatus | "todos") {
    setStatus(value);
    setPage(1);
  }

  function updatePaymentMethod(value: OrderPaymentMethod | "todos") {
    setPaymentMethod(value);
    setPage(1);
  }

  return {
    search,
    setSearch: updateSearch,
    status,
    setStatus: updateStatus,
    paymentMethod,
    setPaymentMethod: updatePaymentMethod,
    page: safePage,
    setPage,
    totalPages,
    filteredCount: filtered.length,
    paginated,
  };
}
