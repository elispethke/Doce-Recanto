"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBRL, formatOrderId } from "@/lib/format";
import { fetchOrder } from "@/services/orders.service";
import type { Order } from "@/types/order";

const paymentLabel = { pix: "PIX", credito: "Cartão de crédito", debito: "Cartão de débito" };

export function OrderConfirmation({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    fetchOrder(orderId).then((result) => setOrder(result ?? null));
  }, [orderId]);

  if (order === undefined) {
    return <div className="py-24 text-center text-sm text-muted-foreground">Carregando pedido...</div>;
  }

  if (order === null) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">Não encontramos esse pedido.</p>
        <Button nativeButton={false} render={<Link href="/loja" />}>Voltar à loja</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-10 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex size-20 items-center justify-center rounded-full bg-accent text-primary"
      >
        <CheckCircle2 className="size-10" />
      </motion.div>

      <div>
        <p className="text-sm font-medium text-primary">Pedido recebido</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground">
          Obrigado pelo seu pedido!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pedido {formatOrderId(order.id)} · realizado com muito carinho
        </p>
      </div>

      <div className="w-full rounded-2xl bg-card p-6 text-left ring-1 ring-foreground/[0.06]">
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-muted-foreground">Qtd: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatBRL(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="my-4 h-px bg-border" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="text-foreground">{formatBRL(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Entrega</span>
            <span className="text-foreground">
              {order.deliveryFee === 0 ? "Grátis" : formatBRL(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold text-foreground">
            <span>Total</span>
            <span className="text-primary">{formatBRL(order.total)}</span>
          </div>
        </div>

        <div className="my-4 h-px bg-border" />

        <div className="flex flex-col gap-2.5 text-sm text-foreground/80">
          <p className="flex items-center gap-2">
            <CreditCard className="size-4 text-primary" /> {paymentLabel[order.paymentMethod]}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            {order.customer.endereco}, {order.customer.numero} — {order.customer.cidade}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="size-4 text-primary" /> Previsão de entrega às {order.estimatedDelivery}
          </p>
        </div>
      </div>

      <Button
        size="lg"
        nativeButton={false}
        className="h-12 w-full max-w-xs rounded-full text-sm"
        render={<Link href={`/pedido/${order.id}/acompanhar`} />}
      >
        Acompanhar Pedido
      </Button>
    </div>
  );
}
