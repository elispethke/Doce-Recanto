import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/firebase-models";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  novo: { label: "Novo", className: "bg-accent text-accent-foreground" },
  "em-producao": { label: "Em produção", className: "bg-accent text-accent-foreground" },
  pronto: { label: "Pronto", className: "bg-accent text-accent-foreground" },
  "aguardando-motorista": { label: "Aguardando motorista", className: "bg-accent text-accent-foreground" },
  "em-entrega": { label: "Em entrega", className: "bg-primary/10 text-primary" },
  finalizado: { label: "Finalizado", className: "bg-emerald-500/10 text-emerald-600" },
  cancelado: { label: "Cancelado", className: "bg-destructive/10 text-destructive" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
