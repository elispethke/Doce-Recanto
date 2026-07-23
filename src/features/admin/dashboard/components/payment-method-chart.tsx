"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { getPaymentMethodBreakdown } from "@/features/admin/dashboard/lib/aggregate";
import { PAYMENT_METHOD_CHART_COLORS, PAYMENT_METHOD_LABELS } from "@/features/admin/shared/lib/order-status";
import { formatBRL } from "@/lib/format";
import { PieChart as PieChartIcon } from "lucide-react";

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{formatBRL(payload[0].value)}</p>
    </div>
  );
}

export function PaymentMethodChart() {
  const { orders, ordersLoading } = useAdminData();

  const data = useMemo(() => {
    return getPaymentMethodBreakdown(orders, 30)
      .filter((point) => point.total > 0)
      .map((point) => ({
        name: PAYMENT_METHOD_LABELS[point.method],
        value: point.total,
        color: PAYMENT_METHOD_CHART_COLORS[point.method],
      }));
  }, [orders]);

  const total = data.reduce((sum, point) => sum + point.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formas de pagamento</CardTitle>
        <CardDescription>Últimos 30 dias</CardDescription>
      </CardHeader>
      <CardContent>
        {ordersLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : data.length === 0 ? (
          <EmptyState icon={PieChartIcon} title="Sem vendas no período" className="border-none py-10" />
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={2}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-heading text-lg font-semibold text-foreground">{formatBRL(total)}</p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {data.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
