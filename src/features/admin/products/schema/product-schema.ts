import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do produto"),
  category: z.string().min(1, "Selecione uma categoria"),
  price: z
    .string()
    .min(1, "Informe um preço")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, "Informe um preço válido"),
  available: z.boolean(),
  imageUrl: z.string().trim().url("Informe uma URL de imagem válida"),
  description: z.string().trim().optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;
