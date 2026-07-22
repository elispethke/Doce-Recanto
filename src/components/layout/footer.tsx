import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { storeInfo } from "@/data/store-info";
import { categories } from "@/data/categories";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
      <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.5l.5-4H13V8a1 1 0 0 1 1-1h2z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-secondary/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <span className="font-script text-3xl text-primary">Doce Encanto</span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bolos e doces artesanais feitos com ingredientes selecionados e muito carinho, para
            transformar momentos simples em lembranças especiais.
          </p>
          <div className="mt-1 flex items-center gap-2">
            <a
              href="#"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">Categorias</h3>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/loja?categoria=${category.slug}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">Institucional</h3>
          <Link href="/loja" className="text-sm text-muted-foreground hover:text-primary">
            Sobre nós
          </Link>
          <Link href="/loja" className="text-sm text-muted-foreground hover:text-primary">
            Perguntas frequentes
          </Link>
          <Link href="/loja" className="text-sm text-muted-foreground hover:text-primary">
            Política de trocas
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">Contato</h3>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4 text-primary" /> {storeInfo.phone}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" /> Entregamos em {storeInfo.deliveryCity}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 text-primary" /> {storeInfo.hours}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 border-t border-border/70 px-6 py-5 text-center text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Doce Encanto. Todos os direitos reservados.</span>
        <span>
          Desenvolvido por{" "}
          <a
            href="https://www.eproxstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground/80 hover:text-primary"
          >
            Eprox Studio
          </a>
        </span>
      </div>
    </footer>
  );
}
