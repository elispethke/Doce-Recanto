import { cn } from "@/lib/utils";
import { ORDER_STATUS_META } from "@/features/admin/shared/lib/order-status";
import { DRIVER_STATUS_META } from "@/features/admin/shared/lib/driver-status";
import type { DriverStatus, OrderStatus } from "@/types/firebase-models";

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        meta.badgeClassName,
        className
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", meta.dotClassName)} />
      {meta.label}
    </span>
  );
}

export function DriverStatusBadge({ status, className }: { status: DriverStatus; className?: string }) {
  const meta = DRIVER_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        meta.badgeClassName,
        className
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", meta.dotClassName)} />
      {meta.label}
    </span>
  );
}
