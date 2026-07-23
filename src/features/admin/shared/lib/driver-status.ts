import type { DriverStatus } from "@/types/firebase-models";

export const DRIVER_STATUS_META: Record<
  DriverStatus,
  { label: string; badgeClassName: string; dotClassName: string }
> = {
  disponivel: {
    label: "Disponível",
    badgeClassName: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dotClassName: "bg-emerald-500",
  },
  ocupado: {
    label: "Ocupado",
    badgeClassName: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dotClassName: "bg-amber-500",
  },
  offline: {
    label: "Offline",
    badgeClassName: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
    dotClassName: "bg-slate-400",
  },
  desligado: {
    label: "Desligado",
    badgeClassName: "bg-destructive/10 text-destructive",
    dotClassName: "bg-destructive",
  },
};

export const DRIVER_STATUS_OPTIONS: DriverStatus[] = ["disponivel", "ocupado", "offline", "desligado"];
