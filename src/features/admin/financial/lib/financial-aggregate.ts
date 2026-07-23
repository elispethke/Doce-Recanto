import { isWithinInterval, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";
import type { OrderDoc } from "@/types/firebase-models";

function toDate(value: OrderDoc["createdAt"]): Date | null {
  return value?.toDate?.() ?? null;
}

function sumInRange(orders: OrderDoc[], start: Date, end: Date): number {
  return orders.reduce((sum, order) => {
    if (order.status === "cancelado") return sum;
    const date = toDate(order.createdAt);
    if (!date || !isWithinInterval(date, { start, end })) return sum;
    return sum + order.total;
  }, 0);
}

export interface FinancialSummary {
  receitaDiaria: number;
  receitaSemanal: number;
  receitaMensal: number;
  receitaTotal: number;
}

export function computeFinancialSummary(orders: OrderDoc[]): FinancialSummary {
  const now = new Date();
  const validOrders = orders.filter((order) => order.status !== "cancelado");
  return {
    receitaDiaria: sumInRange(orders, startOfDay(now), now),
    receitaSemanal: sumInRange(orders, startOfWeek(now, { weekStartsOn: 1 }), now),
    receitaMensal: sumInRange(orders, startOfMonth(now), now),
    receitaTotal: validOrders.reduce((sum, order) => sum + order.total, 0),
  };
}

export function computeGrowth(orders: OrderDoc[], days = 30): number {
  const now = new Date();
  const currentStart = subDays(now, days);
  const previousStart = subDays(now, days * 2);

  const current = sumInRange(orders, currentStart, now);
  const previous = sumInRange(orders, previousStart, currentStart);

  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
