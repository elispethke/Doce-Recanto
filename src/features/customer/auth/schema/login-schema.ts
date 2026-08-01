import { z } from "zod";

export const customerLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail")
    .max(254, "E-mail muito longo")
    .email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha").min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type CustomerLoginSchema = z.infer<typeof customerLoginSchema>;
