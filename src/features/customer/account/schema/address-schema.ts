import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().trim().min(2, "Dê um nome para o endereço (ex: Casa, Trabalho)"),
  street: z.string().trim().min(3, "Informe o endereço"),
  number: z.string().trim().min(1, "Informe o número"),
  complement: z.string().trim().optional(),
  city: z.string().trim().min(2, "Informe a cidade"),
  zip: z.string().trim().regex(/^\d{5}-?\d{3}$/, "CEP inválido. Ex: 01310-100"),
  isDefault: z.boolean().optional(),
});

export type AddressSchema = z.infer<typeof addressSchema>;
