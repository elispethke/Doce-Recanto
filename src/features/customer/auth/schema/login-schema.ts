import { z } from "zod";

export const customerLoginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type CustomerLoginSchema = z.infer<typeof customerLoginSchema>;
