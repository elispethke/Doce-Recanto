"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, LockKeyhole, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { loginSchema, type LoginSchema } from "@/features/admin/auth/schema/login-schema";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.27a12 12 0 0 0 0 10.76l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.87 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { status, authError, signInWithEmail, signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState<"email" | "google" | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/dashboard");
    }
  }, [status, router]);

  async function onSubmit(data: LoginSchema) {
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
      className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
    >
      <div className="mb-7 flex flex-col items-center gap-2 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <LockKeyhole className="size-5" />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Doce Encanto</h1>
        <p className="text-sm text-muted-foreground">Entre no painel administrativo</p>
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
          <Input id="email" type="email" placeholder="voce@doceencanto.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={submitting !== null} className="mt-1 h-10 w-full">
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
        className="h-10 w-full gap-2.5"
      >
        {submitting === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
        Continuar com Google
      </Button>
    </motion.div>
  );
}
