import type { Metadata } from "next";
import { Fraunces, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doce Encanto — Bolos & Doces Artesanais",
  description:
    "E-commerce premium de bolos, doces e kits presente artesanais. Feito com amor, entregue com carinho.",
};

// Layout raiz: só fontes e reset global. Nenhum provider de auth/carrinho
// aqui de propósito — cada área (site público em (public)/layout.tsx,
// admin em admin/layout.tsx) tem sua própria árvore de providers, sem
// vazamento de sessão/estado entre elas.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${greatVibes.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
