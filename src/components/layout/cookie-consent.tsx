"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "doce-encanto:cookie-consent";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (!stored) setOpen(true);
    });
  }, []);

  function decide(choice: "accepted" | "declined") {
    window.localStorage.setItem(CONSENT_KEY, choice);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Cookie className="size-5" />
          </div>
          <DialogTitle>Nós usamos cookies</DialogTitle>
          <DialogDescription>
            Usamos cookies para melhorar sua experiência, lembrar seu carrinho e entender como
            você usa o site. Você pode aceitar todos os cookies ou recusar os não essenciais a
            qualquer momento.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button variant="outline" className="rounded-full" onClick={() => decide("declined")}>
            Recusar
          </Button>
          <Button className="rounded-full" onClick={() => decide("accepted")}>
            Aceitar todos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
