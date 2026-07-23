import type { OrderStatus } from "@/types/firebase-models";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "novo",
  "em-producao",
  "pronto",
  "aguardando-motorista",
  "em-entrega",
  "finalizado",
  "cancelado",
];

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badgeClassName: string; dotClassName: string }
> = {
  novo: {
    label: "Novo",
    badgeClassName: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    dotClassName: "bg-blue-500",
  },
  "em-producao": {
    label: "Em produção",
    badgeClassName: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dotClassName: "bg-amber-500",
  },
  pronto: {
    label: "Pronto",
    badgeClassName: "bg-primary/10 text-primary",
    dotClassName: "bg-primary",
  },
  "aguardando-motorista": {
    label: "Aguardando motorista",
    badgeClassName: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
    dotClassName: "bg-slate-500",
  },
  "em-entrega": {
    label: "Em entrega",
    badgeClassName: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    dotClassName: "bg-violet-500",
  },
  finalizado: {
    label: "Finalizado",
    badgeClassName: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dotClassName: "bg-emerald-500",
  },
  cancelado: {
    label: "Cancelado",
    badgeClassName: "bg-destructive/10 text-destructive",
    dotClassName: "bg-destructive",
  },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: "PIX",
  cartao: "Cartão",
  paypal: "PayPal",
  dinheiro: "Dinheiro",
};

export const PAYMENT_METHOD_CHART_COLORS: Record<string, string> = {
  pix: "var(--chart-4)",
  cartao: "var(--chart-2)",
  paypal: "var(--chart-1)",
  dinheiro: "var(--chart-3)",
};
