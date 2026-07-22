export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t-01",
    name: "Marina Costa",
    role: "Cliente desde 2023",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote:
      "O bolo de morango foi o ponto alto da festa da minha filha. Chegou lindo, fresquinho e o sabor superou qualquer expectativa.",
  },
  {
    id: "t-02",
    name: "Camila Rezende",
    role: "Cliente fiel",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote:
      "Peço a caixa presente dourada sempre que preciso agradar alguém especial. Embalagem impecável e doces deliciosos.",
  },
  {
    id: "t-03",
    name: "Rafael Andrade",
    role: "Cliente corporativo",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote:
      "Contratamos os kits de degustação para um evento da empresa e todo mundo perguntou de onde eram os doces. Impecáveis.",
  },
];
