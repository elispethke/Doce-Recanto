"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-3xl bg-linear-to-br from-secondary via-accent to-secondary">
      <div className="grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-2 lg:gap-6 lg:py-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary">
            FEITO COM AMOR <Heart className="size-3.5 fill-primary" />
          </span>
          <h1 className="font-heading text-4xl leading-[1.08] font-semibold text-foreground sm:text-5xl">
            Bolos que criam
            <br />
            <span className="font-script text-5xl leading-none text-primary sm:text-6xl">
              momentos especiais
            </span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Bolos artesanais feitos com ingredientes selecionados e muito carinho.
          </p>
          <div>
            <Button
              size="lg"
              nativeButton={false}
              className="h-12 rounded-full px-7 text-sm"
              render={<Link href="/loja" />}
            >
              Fazer pedido
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/20"
        >
          <Image
            src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80"
            alt="Bolo rosa decorado com granulado e casquinha"
            fill
            priority
            sizes="(min-width: 1024px) 420px, 90vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
