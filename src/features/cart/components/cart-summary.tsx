import { formatBRL } from "@/lib/format";

export function CartSummary({
  subtotal,
  deliveryFee,
  total,
}: {
  subtotal: number;
  deliveryFee: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>Subtotal</span>
        <span className="font-medium text-foreground">{formatBRL(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-muted-foreground">
        <span>Entrega</span>
        <span className="font-medium text-foreground">
          {deliveryFee === 0 ? "Grátis" : formatBRL(deliveryFee)}
        </span>
      </div>
      <div className="my-1 h-px bg-border" />
      <div className="flex items-center justify-between text-base">
        <span className="font-semibold text-foreground">Total</span>
        <span className="font-heading text-lg font-semibold text-primary">{formatBRL(total)}</span>
      </div>
    </div>
  );
}
