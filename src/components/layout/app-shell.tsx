import { Suspense, type ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { CartPanel } from "@/components/layout/cart-panel";
import { Footer } from "@/components/layout/footer";
import { WhatsappButton } from "@/components/layout/whatsapp-button";
import { CookieConsent } from "@/components/layout/cookie-consent";

export function AppShell({
  children,
  showCartPanel = true,
}: {
  children: ReactNode;
  showCartPanel?: boolean;
}) {
  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen flex-col bg-background lg:flex-row">
        <aside className="hidden shrink-0 border-r border-border/70 bg-sidebar lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64">
          <SidebarNav />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <SiteHeader showCartTrigger={showCartPanel} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        {showCartPanel && (
          <aside className="hidden shrink-0 border-l border-border/70 bg-sidebar xl:sticky xl:top-0 xl:block xl:h-screen xl:w-80">
            <CartPanel />
          </aside>
        )}

        <WhatsappButton />
        <CookieConsent />
      </div>
    </Suspense>
  );
}
