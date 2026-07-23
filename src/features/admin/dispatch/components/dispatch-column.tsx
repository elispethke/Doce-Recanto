"use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DispatchOrderCard } from "@/features/admin/dispatch/components/dispatch-order-card";
import type { OrderDoc } from "@/types/firebase-models";

export function DispatchColumn({
  id,
  title,
  headerAction,
  badge,
  orders,
  emptyLabel,
}: {
  id: string;
  title: string;
  headerAction?: ReactNode;
  badge?: ReactNode;
  orders: OrderDoc[];
  emptyLabel: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex w-72 shrink-0 flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          {badge}
        </div>
        {headerAction}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-40 flex-1 flex-col gap-2 rounded-2xl border border-dashed border-border bg-muted/30 p-2.5 transition-colors",
          isOver && "border-primary/50 bg-primary/5"
        )}
      >
        <AnimatePresence initial={false}>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
            >
              <DispatchOrderCard order={order} />
            </motion.div>
          ))}
        </AnimatePresence>
        {orders.length === 0 && (
          <p className="flex flex-1 items-center justify-center px-2 py-6 text-center text-xs text-muted-foreground">
            {emptyLabel}
          </p>
        )}
      </div>
    </div>
  );
}
