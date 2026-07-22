"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-border px-1.5 py-1.5">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        aria-label="Diminuir quantidade"
        className="flex size-8 items-center justify-center rounded-full text-foreground hover:bg-accent"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-5 text-center text-sm font-semibold tabular-nums">{quantity}</span>
      <button
        onClick={() => onChange(quantity + 1)}
        aria-label="Aumentar quantidade"
        className="flex size-8 items-center justify-center rounded-full text-foreground hover:bg-accent"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
