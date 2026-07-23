"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/features/admin/shared/components/status-badge";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { CalendarEventDialog } from "@/features/admin/calendar/components/calendar-event-dialog";
import { useAdminData } from "@/features/admin/shared/context/admin-data-context";
import { subscribeToCalendarEvents, removeCalendarEvent } from "@/services/firestore/calendar-events.service";
import { cn } from "@/lib/utils";
import { formatBRL, formatOrderId } from "@/lib/format";
import type { CalendarEventDoc } from "@/types/firebase-models";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function AdminCalendar() {
  const { orders } = useAdminData();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEventDoc[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => subscribeToCalendarEvents(setEvents), []);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  function ordersOnDay(day: Date) {
    return orders.filter((order) => {
      const date = order.createdAt?.toDate?.();
      return date && isSameDay(date, day);
    });
  }

  function eventsOnDay(day: Date) {
    return events.filter((event) => event.date === format(day, "yyyy-MM-dd"));
  }

  const selectedOrders = ordersOnDay(selectedDay);
  const selectedEvents = eventsOnDay(selectedDay);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-heading text-lg font-semibold text-foreground capitalize">
              {format(month, "MMMM yyyy", { locale: ptBR })}
            </p>
            <div className="flex gap-1.5">
              <Button variant="outline" size="icon-sm" onClick={() => setMonth((m) => subMonths(m, 1))} aria-label="Mês anterior">
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>
                Hoje
              </Button>
              <Button variant="outline" size="icon-sm" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Próximo mês">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1.5">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayOrders = ordersOnDay(day);
              const dayEvents = eventsOnDay(day);
              const inMonth = isSameMonth(day, month);
              const selected = isSameDay(day, selectedDay);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-start gap-1 rounded-lg p-1.5 text-sm transition-colors hover:bg-accent",
                    !inMonth && "text-muted-foreground/40",
                    selected && "bg-primary text-primary-foreground hover:bg-primary",
                    !selected && isToday(day) && "font-semibold text-primary"
                  )}
                >
                  <span>{format(day, "d")}</span>
                  <div className="flex items-center gap-0.5">
                    {dayOrders.length > 0 && (
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          selected ? "bg-primary-foreground" : "bg-blue-500"
                        )}
                      />
                    )}
                    {dayEvents.length > 0 && (
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          selected ? "bg-primary-foreground" : "bg-amber-500"
                        )}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground capitalize">
              {format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}
            </p>
            <Button size="icon-sm" variant="outline" onClick={() => setDialogOpen(true)} aria-label="Adicionar data importante">
              <Plus className="size-4" />
            </Button>
          </div>

          {selectedEvents.length > 0 && (
            <div className="flex flex-col gap-2">
              {selectedEvents.map((event) => (
                <div key={event.id} className="flex items-start justify-between gap-2 rounded-lg bg-amber-50 p-2.5 text-xs dark:bg-amber-500/10">
                  <div className="flex items-start gap-1.5">
                    <Star className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      {event.notes && <p className="mt-0.5 text-muted-foreground">{event.notes}</p>}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await removeCalendarEvent(event.id);
                      } catch {
                        toast.error("Não foi possível remover.");
                      }
                    }}
                    aria-label="Remover"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedOrders.length === 0 ? (
            <EmptyState icon={Plus} title="Sem pedidos nesse dia" className="border-none py-8" />
          ) : (
            <div className="flex flex-col gap-2">
              {selectedOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-xs">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{formatOrderId(order.id)}</p>
                    <p className="truncate text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-medium text-foreground">{formatBRL(order.total)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CalendarEventDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultDate={format(selectedDay, "yyyy-MM-dd")} />
    </div>
  );
}
