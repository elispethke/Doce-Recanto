export type PaymentMethod = "pix" | "credito" | "debito";

export interface CheckoutFormValues {
  nome: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento?: string;
  cidade: string;
  cep: string;
  observacoes?: string;
  formaPagamento: PaymentMethod;
}
