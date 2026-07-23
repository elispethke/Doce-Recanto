"use client";

import Link from "next/link";
import { Package, Heart, MapPin } from "lucide-react";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { OrdersList } from "@/features/customer/account/components/orders-list";

export default function ContaPage() {
  const { profile } = useCustomerAuth();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Olá, {profile?.name?.split(" ")[0] ?? "!"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Bem-vindo(a) de volta à Doce Encanto.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/conta/pedidos"
          className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/[0.06] hover:shadow-md"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Package className="size-4.5" />
          </span>
          <span className="text-sm font-medium text-foreground">Meus pedidos</span>
        </Link>
        <Link
          href="/conta/favoritos"
          className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/[0.06] hover:shadow-md"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Heart className="size-4.5" />
          </span>
          <span className="text-sm font-medium text-foreground">Favoritos</span>
        </Link>
        <Link
          href="/conta/enderecos"
          className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/[0.06] hover:shadow-md"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <MapPin className="size-4.5" />
          </span>
          <span className="text-sm font-medium text-foreground">Endereços</span>
        </Link>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">Pedidos recentes</h2>
        <OrdersList limit={3} />
      </div>
    </div>
  );
}
