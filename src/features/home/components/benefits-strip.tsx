"use client";

import { motion } from "framer-motion";
import { Heart, Truck, ShieldCheck, BadgeCheck } from "lucide-react";

const benefits = [
  { icon: Heart, title: "Feito com amor", description: "Ingredientes selecionados" },
  { icon: Truck, title: "Entrega rápida", description: "Em toda a cidade e região" },
  { icon: ShieldCheck, title: "Pagamento seguro", description: "Seus dados protegidos" },
  { icon: BadgeCheck, title: "Qualidade garantida", description: "Satisfação ou reembolso" },
];

export function BenefitsStrip() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {benefits.map((benefit, index) => (
        <motion.div
          key={benefit.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/[0.06]"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <benefit.icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{benefit.title}</p>
            <p className="truncate text-xs text-muted-foreground">{benefit.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
