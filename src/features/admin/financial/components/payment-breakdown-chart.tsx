"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { getPaymentMethodBreakdown } from "@/features/admin/dashboard/lib/aggregate";
import { PAYMENT_METHOD_CHART_COLORS, PAYMENT_METHOD_LABELS } from "@/features/admin/shared/lib/order-status";
import { formatBRL } from "@/lib/format";

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { label: string; total: number; count: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{point.label}</p>
      <p className="text-muted-foreground">{formatBRL(point.total)}</p>
      <p className="text-muted-foreground">{point.count} pedido{point.count === 1 ? "" : "s"}</p>
    </div>
  );
}

export function PaymentBreakdownChart() {
  const { orders, ordersLoading } = useAdminData();

  const data = useMemo(() => {
    return getPaymentMethodBreakdown(orders, 30).map((point) => ({
      label: PAYMENT_METHOD_LABELS[point.method],
      total: point.total,
      count: point.count,
      color: PAYMENT_METHOD_CHART_COLORS[point.method],
    }));
  }, [orders]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita por forma de pagamento</CardTitle>
        <CardDescription>Últimos 30 dias</CardDescription>
      </CardHeader>
      <CardContent>
        {ordersLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(value) => formatBRL(value).replace(",00", "")}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
