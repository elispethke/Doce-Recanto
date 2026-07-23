import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { OrderDoc, OrderPaymentMethod } from "@/types/firebase-models";

function toDate(value: OrderDoc["createdAt"]): Date | null {
  return value?.toDate?.() ?? null;
}

export interface DashboardStats {
  pedidosHoje: number;
  emProducao: number;
  aguardandoMotorista: number;
  emEntrega: number;
  concluidosHoje: number;
  receitaHoje: number;
  ticketMedio: number;
  clientesCadastrados: number;
}

export function computeDashboardStats(orders: OrderDoc[], totalCustomers: number): DashboardStats {
  const now = new Date();
  const todayOrders = orders.filter((order) => {
    const date = toDate(order.createdAt);
    return date && isSameDay(date, now);
  });

  const validTodayOrders = todayOrders.filter((order) => order.status !== "cancelado");
  const receitaHoje = validTodayOrders.reduce((sum, order) => sum + order.total, 0);

  return {
    pedidosHoje: todayOrders.length,
    emProducao: orders.filter((order) => order.status === "em-producao").length,
    aguardandoMotorista: orders.filter((order) => order.status === "aguardando-motorista").length,
    emEntrega: orders.filter((order) => order.status === "em-entrega").length,
    concluidosHoje: orders.filter((order) => {
      const date = toDate(order.updatedAt);
      return order.status === "finalizado" && date && isSameDay(date, now);
    }).length,
    receitaHoje,
    ticketMedio: validTodayOrders.length > 0 ? receitaHoje / validTodayOrders.length : 0,
    clientesCadastrados: totalCustomers,
  };
}

export interface SalesPoint {
  key: string;
  label: string;
  total: number;
}

function revenueOf(orders: OrderDoc[], interval: { start: Date; end: Date }): number {
  return orders.reduce((sum, order) => {
    if (order.status === "cancelado") return sum;
    const date = toDate(order.createdAt);
    if (!date || !isWithinInterval(date, interval)) return sum;
    return sum + order.total;
  }, 0);
}

export function getSalesByDay(orders: OrderDoc[], days = 14): SalesPoint[] {
  const now = new Date();
  const range = eachDayOfInterval({ start: subDays(now, days - 1), end: now });
  return range.map((day) => ({
    key: format(day, "yyyy-MM-dd"),
    label: format(day, "dd/MM"),
    total: revenueOf(orders, { start: startOfDay(day), end: startOfDay(addDays(day, 1)) }),
  }));
}

export function getSalesByWeek(orders: OrderDoc[], weeks = 8): SalesPoint[] {
  const now = new Date();
  const range = eachWeekOfInterval(
    { start: subWeeks(now, weeks - 1), end: now },
    { weekStartsOn: 1 }
  );
  return range.map((weekStart) => {
    const start = startOfWeek(weekStart, { weekStartsOn: 1 });
    const end = endOfWeek(weekStart, { weekStartsOn: 1 });
    return {
      key: format(start, "yyyy-MM-dd"),
      label: `${format(start, "dd/MM")}`,
      total: revenueOf(orders, { start, end }),
    };
  });
}

export function getSalesByMonth(orders: OrderDoc[], months = 6): SalesPoint[] {
  const now = new Date();
  const range = eachMonthOfInterval({ start: subMonths(now, months - 1), end: now });
  return range.map((monthStart) => {
    const start = startOfMonth(monthStart);
    const end = startOfMonth(addMonths(monthStart, 1));
    return {
      key: format(start, "yyyy-MM"),
      label: format(start, "MMM", { locale: ptBR }),
      total: revenueOf(orders, { start, end }),
    };
  });
}

export interface PaymentMethodPoint {
  method: OrderPaymentMethod;
  total: number;
  count: number;
}

export function getPaymentMethodBreakdown(orders: OrderDoc[], days = 30): PaymentMethodPoint[] {
  const since = subDays(new Date(), days);
  const methods: OrderPaymentMethod[] = ["pix", "cartao", "paypal", "dinheiro"];
  const relevant = orders.filter((order) => {
    if (order.status === "cancelado") return false;
    const date = toDate(order.createdAt);
    return date && date >= since;
  });

  return methods.map((method) => {
    const matches = relevant.filter((order) => order.paymentMethod === method);
    return {
      method,
      total: matches.reduce((sum, order) => sum + order.total, 0),
      count: matches.length,
    };
  });
}
