"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PaymentMethodSelector } from "@/features/checkout/components/payment-method-selector";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { checkoutSchema, type CheckoutSchema } from "@/features/checkout/schema/checkout-schema";
import { useCart } from "@/features/cart/context/cart-context";
import { createOrder } from "@/services/orders.service";
import { formatBRL } from "@/lib/format";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { formaPagamento: "pix" },
  });

  const formaPagamento = watch("formaPagamento");

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-12 text-center ring-1 ring-foreground/[0.06]">
        <p className="text-sm text-muted-foreground">
          Seu carrinho está vazio. Adicione produtos antes de finalizar um pedido.
        </p>
        <Button size="lg" nativeButton={false} className="rounded-full px-8" render={<Link href="/loja" />}>
          Ver produtos
        </Button>
      </div>
    );
  }

  async function onSubmit(data: CheckoutSchema) {
    setSubmitting(true);
    const order = await createOrder({
      items,
      subtotal,
      deliveryFee,
      total,
      customer: data,
    });
    clear();
    router.push(`/pedido/${order.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/[0.06]">
          <h2 className="font-heading text-lg font-semibold text-foreground">Dados de contato</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" placeholder="Seu nome completo" {...register("nome")} />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" placeholder="(11) 91234-5678" {...register("telefone")} />
              {errors.telefone && <p className="text-xs text-destructive">{errors.telefone.message}</p>}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/[0.06]">
          <h2 className="font-heading text-lg font-semibold text-foreground">Endereço de entrega</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" placeholder="Rua, avenida..." {...register("endereco")} />
              {errors.endereco && <p className="text-xs text-destructive">{errors.endereco.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" placeholder="123" {...register("numero")} />
              {errors.numero && <p className="text-xs text-destructive">{errors.numero.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="complemento">Complemento (opcional)</Label>
              <Input id="complemento" placeholder="Apto, bloco..." {...register("complemento")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" placeholder="São Paulo" {...register("cidade")} />
              {errors.cidade && <p className="text-xs text-destructive">{errors.cidade.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" placeholder="01310-100" {...register("cep")} />
              {errors.cep && <p className="text-xs text-destructive">{errors.cep.message}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Ponto de referência, instruções para entrega..."
              {...register("observacoes")}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/[0.06]">
          <h2 className="font-heading text-lg font-semibold text-foreground">Forma de pagamento</h2>
          <PaymentMethodSelector
            value={formaPagamento}
            onChange={(value) => setValue("formaPagamento", value, { shouldValidate: true })}
          />
        </section>
      </div>

      <aside className="flex h-fit flex-col gap-5 rounded-2xl bg-card p-6 ring-1 ring-foreground/[0.06] lg:sticky lg:top-24">
        <h2 className="font-heading text-lg font-semibold text-foreground">Resumo do pedido</h2>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span className="text-foreground/80">
                {item.quantity}× {item.name}
              </span>
              <span className="font-medium text-foreground">{formatBRL(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="h-px bg-border" />
        <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
        <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full rounded-full text-sm">
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Finalizando...
            </span>
          ) : (
            "Finalizar Pedido"
          )}
        </Button>
      </aside>
    </form>
  );
}
