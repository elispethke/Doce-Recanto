"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ClipboardList, MessageCircle, MoreHorizontal, Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { OrderStatusBadge } from "@/features/admin/shared/components/status-badge";
import { OrderDetailSheet } from "@/features/admin/orders/components/order-detail-sheet";
import { AssignDriverDialog } from "@/features/admin/orders/components/assign-driver-dialog";
import { PAYMENT_METHOD_LABELS } from "@/features/admin/shared/lib/order-status";
import { formatBRL, formatOrderId } from "@/lib/format";
import type { OrderDoc } from "@/types/firebase-models";

export function OrdersTable({
  orders,
  loading,
  page,
  totalPages,
  onPageChange,
  initialOrder,
  initialTab = "detalhes",
}: {
  orders: OrderDoc[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  initialOrder?: OrderDoc | null;
  initialTab?: "detalhes" | "chat";
}) {
  const [detailOrder, setDetailOrder] = useState<OrderDoc | null>(initialOrder ?? null);
  const [detailOpen, setDetailOpen] = useState(Boolean(initialOrder));
  const [detailTab, setDetailTab] = useState<"detalhes" | "chat">(initialTab);
  const [assignOrder, setAssignOrder] = useState<OrderDoc | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  function openDetail(order: OrderDoc, tab: "detalhes" | "chat" = "detalhes") {
    setDetailOrder(order);
    setDetailTab(tab);
    setDetailOpen(true);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyState icon={ClipboardList} title="Nenhum pedido encontrado" description="Ajuste os filtros ou aguarde novos pedidos chegarem." />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="cursor-pointer" onClick={() => openDetail(order)}>
                <TableCell className="font-medium text-foreground">{formatOrderId(order.id)}</TableCell>
                <TableCell>
                  <p className="text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.createdAt?.toDate?.() ? format(order.createdAt.toDate(), "dd/MM HH:mm", { locale: ptBR }) : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</TableCell>
                <TableCell className="font-medium text-foreground">{formatBRL(order.total)}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDetail(order)}>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDetail(order, "chat")}>
                        <MessageCircle className="size-4" /> Abrir chat
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setAssignOrder(order);
                          setAssignOpen(true);
                        }}
                      >
                        <Truck className="size-4" /> Atribuir motorista
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Próxima página"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <OrderDetailSheet order={detailOrder} open={detailOpen} onOpenChange={setDetailOpen} initialTab={detailTab} />
      <AssignDriverDialog order={assignOrder} open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  );
}
