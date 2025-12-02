import type { AstrologerProfile } from "./astrologers-data";

function normalizeDate(date: Date | string) {
  return typeof date === "string" ? new Date(date) : date;
}

export function getSlotsForDate(astrologer: AstrologerProfile, date: Date | string) {
  const target = normalizeDate(date);
  const weekday = target.getDay();
  const template = astrologer.availabilityTemplate.find((slot) => slot.day === weekday);
  return template ? [...template.slots] : [];
}

export function getNextAvailableDates(days = 7) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function formatDateForInput(date: Date) {
  return date.toISOString().split("T")[0];
}

