import { z } from "zod";

export const customerSignupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Informe seu nome")
      .min(3, "Informe seu nome completo")
      .max(100, "Nome muito longo")
      .refine((value) => value.trim().includes(" "), "Informe nome e sobrenome"),
    email: z
      .string()
      .trim()
      .min(1, "Informe seu e-mail")
      .max(254, "E-mail muito longo")
      .email("Informe um e-mail válido"),
    phone: z
      .string()
      .trim()
      .min(1, "Informe seu telefone")
      .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, "Telefone inválido. Ex: (11) 91234-5678"),
    password: z.string().min(1, "Informe uma senha").min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CustomerSignupSchema = z.infer<typeof customerSignupSchema>;
