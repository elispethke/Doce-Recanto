"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import {
  customerLoginSchema,
  type CustomerLoginSchema,
} from "@/features/customer/auth/schema/login-schema";

export function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/conta";
  const { status, authError, signInWithEmail, signInWithGoogle } = useCustomerAuth();
  const [submitting, setSubmitting] = useState<"email" | "google" | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerLoginSchema>({ resolver: zodResolver(customerLoginSchema) });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  async function onSubmit(data: CustomerLoginSchema) {
    setFormError(null);
    setSubmitting("email");
    try {
      await signInWithEmail(data.email, data.password);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setSubmitting(null);
    }
  }

  async function handleGoogle() {
    setFormError(null);
    setSubmitting("google");
    try {
      await signInWithGoogle();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setSubmitting(null);
    }
  }

  const displayedError = formError ?? authError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-sm ring-1 ring-foreground/[0.06]"
    >
      <div className="mb-7 flex flex-col items-center gap-1 text-center">
        <span className="font-script text-4xl text-primary">Doce Encanto</span>
        <p className="text-sm text-muted-foreground">Entre na sua conta</p>
      </div>

      {displayedError && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{displayedError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@email.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={submitting !== null} className="mt-1 h-11 w-full rounded-full">
          {submitting === "email" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Entrando...
            </span>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={submitting !== null}
        onClick={handleGoogle}
        className="h-11 w-full gap-2.5 rounded-full"
      >
        {submitting === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
        Continuar com Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link
          href={`/cadastro${redirectTo !== "/conta" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
          className="font-medium text-primary hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </motion.div>
  );
}
