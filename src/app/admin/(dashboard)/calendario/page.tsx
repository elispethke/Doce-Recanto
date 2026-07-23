"use client";

import { AdminCalendar } from "@/features/admin/calendar/components/admin-calendar";

export default function AdminCalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Calendário</h1>
        <p className="text-sm text-muted-foreground">Entregas, encomendas e datas importantes.</p>
      </div>

      <AdminCalendar />
    </div>
  );
}
