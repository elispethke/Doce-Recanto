"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL, formatOrderId } from "@/lib/format";
import type { OrderDoc } from "@/types/firebase-models";

export function DispatchOrderCard({
  order,
  overlay = false,
}: {
  order: OrderDoc;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
    data: { order },
  });

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={!overlay && transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      {...(overlay ? {} : { ...listeners, ...attributes })}
      className={cn(
        "group flex touch-none items-start gap-2 rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-shadow",
        !overlay && "cursor-grab active:cursor-grabbing hover:shadow-md",
        isDragging && !overlay && "opacity-30",
        overlay && "rotate-2 shadow-xl ring-2 ring-primary/30"
      )}
    >
      <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{formatOrderId(order.id)}</p>
          <p className="text-xs font-medium text-foreground">{formatBRL(order.total)}</p>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{order.customerName}</p>
        <div className="mt-1 flex items-start gap-1 text-xs text-muted-foreground/80">
          <MapPin className="mt-0.5 size-3 shrink-0" />
          <span className="line-clamp-1">{order.address}</span>
        </div>
      </div>
    </div>
  );
}
