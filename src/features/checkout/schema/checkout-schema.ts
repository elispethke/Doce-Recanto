import { z } from "zod";

export const checkoutSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo"),
  telefone: z
    .string()
    .trim()
    .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, "Telefone inválido. Ex: (11) 91234-5678"),
  endereco: z.string().trim().min(3, "Informe o endereço"),
  numero: z.string().trim().min(1, "Informe o número"),
  complemento: z.string().trim().optional(),
  cidade: z.string().trim().min(2, "Informe a cidade"),
  cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, "CEP inválido. Ex: 01310-100"),
  observacoes: z.string().trim().optional(),
  formaPagamento: z.enum(["pix", "credito", "debito"]),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
