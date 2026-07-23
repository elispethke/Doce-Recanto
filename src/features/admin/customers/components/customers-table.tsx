"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { formatBRL } from "@/lib/format";
import type { CustomerDoc } from "@/types/firebase-models";

export interface CustomerRow {
  customer: CustomerDoc;
  orderCount: number;
  totalSpent: number;
  lastPurchase: Date | null;
}

export function CustomersTable({
  rows,
  loading,
  onSelect,
}: {
  rows: CustomerRow[];
  loading: boolean;
  onSelect: (row: CustomerRow) => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return <EmptyState icon={Users} title="Nenhum cliente encontrado" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Pedidos</TableHead>
            <TableHead>Total gasto</TableHead>
            <TableHead>Última compra</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.customer.id} className="cursor-pointer" onClick={() => onSelect(row)}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {row.customer.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{row.customer.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <p>{row.customer.email}</p>
                <p className="text-xs">{row.customer.phone}</p>
              </TableCell>
              <TableCell className="text-foreground">{row.orderCount}</TableCell>
              <TableCell className="font-medium text-foreground">{formatBRL(row.totalSpent)}</TableCell>
              <TableCell className="text-muted-foreground">
                {row.lastPurchase ? format(row.lastPurchase, "dd/MM/yyyy", { locale: ptBR }) : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
