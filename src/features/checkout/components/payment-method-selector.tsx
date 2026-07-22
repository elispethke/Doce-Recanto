"use client";

import { motion } from "framer-motion";
import { QrCode, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/checkout";

const methods: { value: PaymentMethod; label: string; description: string; icon: typeof QrCode }[] = [
  { value: "pix", label: "PIX", description: "Aprovação imediata", icon: QrCode },
  { value: "credito", label: "Cartão de crédito", description: "Em até 3x sem juros", icon: CreditCard },
  { value: "debito", label: "Cartão de débito", description: "Débito à vista", icon: Wallet },
];

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {methods.map((method) => {
        const isActive = value === method.value;
        return (
          <button
            key={method.value}
            type="button"
            onClick={() => onChange(method.value)}
            className={cn(
              "relative flex flex-col items-start gap-2 overflow-hidden rounded-2xl border-2 p-4 text-left transition-colors",
              isActive ? "border-primary bg-accent" : "border-border bg-card hover:border-primary/30"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="payment-highlight"
                className="absolute inset-0 -z-10 bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"
              )}
            >
              <method.icon className="size-4.5" />
            </span>
            <span className="text-sm font-semibold text-foreground">{method.label}</span>
            <span className="text-xs text-muted-foreground">{method.description}</span>
          </button>
        );
      })}
    </div>
  );
}
