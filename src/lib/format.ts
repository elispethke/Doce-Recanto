export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatOrderId(id: string): string {
  return `#${id.toUpperCase()}`;
}
