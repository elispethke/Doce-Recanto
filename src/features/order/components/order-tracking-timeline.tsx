"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const steps: { key: OrderStatus; label: string }[] = [
  { key: "recebido", label: "Pedido recebido" },
  { key: "preparando", label: "Em preparação" },
  { key: "saiu-para-entrega", label: "Saiu para entrega" },
  { key: "entregue", label: "Entregue" },
];

export function OrderTrackingTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === steps.length - 1;
        return (
          <div key={step.key} className="flex gap-4">
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
