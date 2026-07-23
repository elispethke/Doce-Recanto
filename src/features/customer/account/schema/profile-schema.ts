import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo"),
  phone: z
    .string()
    .trim()
    .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, "Telefone inválido. Ex: (11) 91234-5678"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
