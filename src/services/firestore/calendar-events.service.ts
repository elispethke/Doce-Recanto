import { orderBy, type Timestamp } from "firebase/firestore";
import { createRepository, serverTimestamp } from "@/repositories/firestore-repository";
import { adminDb } from "@/lib/firebase/admin/firestore";
import type { CalendarEventDoc, CalendarEventType } from "@/types/firebase-models";

const eventsRepo = createRepository<CalendarEventDoc>("calendarEvents", adminDb);

export function subscribeToCalendarEvents(
  onChange: (events: CalendarEventDoc[]) => void,
  onError?: (error: Error) => void
): () => void {
  return eventsRepo.subscribe(onChange, [orderBy("date", "asc")], onError);
}

export interface CalendarEventInput {
  title: string;
  type: CalendarEventType;
  date: string;
  notes?: string;
}

export async function createCalendarEvent(input: CalendarEventInput): Promise<string> {
  return eventsRepo.create({ ...input, createdAt: serverTimestamp() as unknown as Timestamp });
}

export async function removeCalendarEvent(id: string): Promise<void> {
  await eventsRepo.remove(id);
}
