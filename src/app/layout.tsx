import type { Metadata } from "next";
import { Fraunces, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/features/cart/context/cart-context";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${greatVibes.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
