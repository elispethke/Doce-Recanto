"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/firebase-models";

const steps: { label: string; statuses: OrderStatus[] }[] = [
  { label: "Pedido recebido", statuses: ["novo"] },
  { label: "Em preparação", statuses: ["em-producao", "pronto"] },
  { label: "Saiu para entrega", statuses: ["aguardando-motorista", "em-entrega"] },
  { label: "Entregue", statuses: ["finalizado"] },
];

export function OrderTrackingTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelado") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-destructive/5 p-5 text-destructive">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <X className="size-4.5" />
        </span>
        <div>
          <p className="text-sm font-semibold">Pedido cancelado</p>
          <p className="text-xs text-destructive/80">
            Se isso não era esperado, fale com a gente pelo chat abaixo.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((step) => step.statuses.includes(status));

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === steps.length - 1;
        return (
          <div key={step.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isDone ? "var(--primary)" : "var(--secondary)",
                  scale: isDone ? 1 : 0.9,
                }}
                transition={{ duration: 0.4 }}
                className="flex size-8 shrink-0 items-center justify-center rounded-full"
              >
                {isDone ? (
                  <Check className="size-4 text-primary-foreground" />
                ) : (
                  <span className="size-2 rounded-full bg-muted-foreground/50" />
                )}
              </motion.div>
              {!isLast && (
                <div
                  className={cn(
                    "my-1 w-0.5 flex-1 transition-colors duration-500",
                    index < currentIndex ? "bg-primary" : "bg-border"
                  )}
                  style={{ minHeight: 32 }}
                />
              )}
            </div>
            <div className={cn("pb-8 text-sm", isDone ? "text-foreground" : "text-muted-foreground")}>
              <p className={cn("font-medium", isDone && "text-foreground")}>{step.label}</p>
              {index === currentIndex && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-0.5 text-xs text-primary"
                >
                  Status atual
                </motion.p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
