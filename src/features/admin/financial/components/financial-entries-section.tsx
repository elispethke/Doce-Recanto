"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDownCircle, ArrowUpCircle, Plus, Trash2, Wallet2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { FinancialEntryDialog } from "@/features/admin/financial/components/financial-entry-dialog";
import { subscribeToFinancialEntries, removeFinancialEntry } from "@/services/firestore/financial-entries.service";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FinancialEntryDoc, FinancialEntryType } from "@/types/firebase-models";

export function FinancialEntriesSection() {
  const [entries, setEntries] = useState<FinancialEntryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<FinancialEntryType>("entrada");

  useEffect(() => {
    return subscribeToFinancialEntries(
      (data) => {
        setEntries(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const totals = useMemo(() => {
    const entradas = entries.filter((e) => e.type === "entrada").reduce((sum, e) => sum + e.amount, 0);
    const saidas = entries.filter((e) => e.type === "saida").reduce((sum, e) => sum + e.amount, 0);
    return { entradas, saidas, saldo: entradas - saidas };
  }, [entries]);

  function openDialog(type: FinancialEntryType) {
    setDialogType(type);
    setDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Fluxo de caixa</CardTitle>
          <p className="text-sm text-muted-foreground">Entradas e saídas manuais, separadas da receita de pedidos.</p>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openDialog("entrada")}>
            <Plus className="size-3.5" /> Entrada
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openDialog("saida")}>
            <Plus className="size-3.5" /> Saída
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-50 p-3.5 text-center dark:bg-emerald-500/10">
            <p className="font-heading text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              {formatBRL(totals.entradas)}
            </p>
            <p className="text-xs text-muted-foreground">Entradas</p>
          </div>
          <div className="rounded-xl bg-destructive/10 p-3.5 text-center">
            <p className="font-heading text-lg font-semibold text-destructive">{formatBRL(totals.saidas)}</p>
            <p className="text-xs text-muted-foreground">Saídas</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3.5 text-center">
            <p className={cn("font-heading text-lg font-semibold", totals.saldo >= 0 ? "text-foreground" : "text-destructive")}>
              {formatBRL(totals.saldo)}
            </p>
            <p className="text-xs text-muted-foreground">Saldo</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState icon={Wallet2} title="Nenhum lançamento ainda" className="border-none py-8" />
        ) : (
          <div className="flex flex-col gap-1.5">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50">
                {entry.type === "entrada" ? (
                  <ArrowUpCircle className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownCircle className="size-4 shrink-0 text-destructive" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(`${entry.date}T00:00:00`), "dd/MM/yyyy", { locale: ptBR })}
                    {entry.category ? ` · ${entry.category}` : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-sm font-semibold",
                    entry.type === "entrada" ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"
                  )}
                >
                  {entry.type === "entrada" ? "+" : "-"} {formatBRL(entry.amount)}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await removeFinancialEntry(entry.id);
                    } catch {
                      toast.error("Não foi possível remover.");
                    }
                  }}
                  aria-label="Remover lançamento"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <FinancialEntryDialog key={dialogType} open={dialogOpen} onOpenChange={setDialogOpen} defaultType={dialogType} />
    </Card>
  );
}
