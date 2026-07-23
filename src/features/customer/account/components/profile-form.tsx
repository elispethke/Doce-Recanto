"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { updateCustomerProfile } from "@/services/firestore/customers.service";
import { profileSchema, type ProfileSchema } from "@/features/customer/account/schema/profile-schema";

export function ProfileForm() {
  const { profile, signOutUser } = useCustomerAuth();
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchema>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (profile) reset({ name: profile.name, phone: profile.phone });
  }, [profile, reset]);

  async function onSubmit(data: ProfileSchema) {
    if (!profile) return;
    setSubmitting(true);
    try {
      await updateCustomerProfile(profile.id, data);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-md flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/[0.06]"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" placeholder="(11) 91234-5678" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>E-mail</Label>
          <Input value={profile?.email ?? ""} disabled />
        </div>
        <Button type="submit" disabled={submitting} className="mt-1 w-fit rounded-full px-6">
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : saved ? (
            <span className="flex items-center gap-2">
              <Check className="size-4" /> Salvo
            </span>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </form>

      <Button
        variant="outline"
        className="w-fit gap-1.5 rounded-full"
        onClick={() => signOutUser()}
      >
        <LogOut className="size-4" /> Sair da conta
      </Button>
    </div>
  );
}
