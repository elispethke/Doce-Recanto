import { z } from "zod";

export const customerSignupSchema = z
  .object({
    name: z.string().trim().min(3, "Informe seu nome completo"),
    email: z.string().trim().email("Informe um e-mail válido"),
    phone: z
      .string()
      .trim()
      .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, "Telefone inválido. Ex: (11) 91234-5678"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CustomerSignupSchema = z.infer<typeof customerSignupSchema>;
