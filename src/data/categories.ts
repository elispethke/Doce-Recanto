export interface Category {
  id: string;
  slug: "bolos" | "doces" | "kits" | "personalizados" | "promocoes";
  name: string;
  icon: "cake" | "cookie" | "gift" | "sparkles" | "percent";
}

export const categories: Category[] = [
  { id: "cat-1", slug: "bolos", name: "Bolos", icon: "cake" },
  { id: "cat-2", slug: "doces", name: "Doces", icon: "cookie" },
  { id: "cat-3", slug: "kits", name: "Kits & Presentes", icon: "gift" },
  { id: "cat-4", slug: "personalizados", name: "Personalizados", icon: "sparkles" },
  { id: "cat-5", slug: "promocoes", name: "Promoções", icon: "percent" },
];
