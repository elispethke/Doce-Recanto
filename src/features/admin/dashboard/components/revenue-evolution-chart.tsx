"use client";

import { useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { getSalesByMonth } from "@/features/admin/dashboard/lib/aggregate";
import { formatBRL } from "@/lib/format";

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md capitalize">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-primary">{formatBRL(payload[0].value)}</p>
    </div>
  );
}

export function RevenueEvolutionChart() {
  const { orders, ordersLoading } = useAdminData();

  const data = useMemo(() => getSalesByMonth(orders, 6), [orders]);
  const growth = useMemo(() => {
    if (data.length < 2) return 0;
    const previous = data[data.length - 2].total;
    const current = data[data.length - 1].total;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>Evolução do faturamento</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </div>
        {!ordersLoading && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              growth >= 0
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {growth >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}%
          </span>
        )}
      </CardHeader>
      <CardContent>
        {ordersLoading ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                className="capitalize"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(value) => formatBRL(value).replace(",00", "")}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)" }} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--chart-2)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
