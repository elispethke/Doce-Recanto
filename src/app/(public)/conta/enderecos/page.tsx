"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/features/customer/account/components/address-form";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { saveAddress, updateAddress, removeAddress } from "@/services/firestore/customers.service";
import type { AddressDoc } from "@/types/firebase-models";

export default function ContaEnderecosPage() {
  const { profile } = useCustomerAuth();
  const [editing, setEditing] = useState<AddressDoc | "new" | null>(null);

  if (!profile) return null;

  const addresses = profile.addresses;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">Endereços</h1>
        <Button size="sm" className="gap-1.5 rounded-full" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> Novo endereço
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center ring-1 ring-foreground/[0.06]">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <MapPin className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Você ainda não salvou nenhum endereço.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex flex-col gap-2 rounded-2xl bg-card p-5 ring-1 ring-foreground/[0.06]"
            >
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  {address.label}
                  {address.isDefault && <Star className="size-3.5 fill-gold text-gold" />}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(address)}
                    aria-label="Editar endereço"
                    className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => removeAddress(profile, address.id)}
                    aria-label="Remover endereço"
                    className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {address.street}, {address.number}
                {address.complement ? ` - ${address.complement}` : ""} — {address.city}
              </p>
              <p className="text-xs text-muted-foreground">CEP {address.zip}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Novo endereço" : "Editar endereço"}</DialogTitle>
          </DialogHeader>
          <AddressForm
            initialValue={editing && editing !== "new" ? editing : undefined}
            onCancel={() => setEditing(null)}
            onSubmit={async (data) => {
              if (editing === "new") {
                await saveAddress(profile, data);
              } else if (editing) {
                await updateAddress(profile, { ...data, id: editing.id });
              }
              setEditing(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
