import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface BookingRecord {
  id: string;
  astrologerId: string;
  astrologerName: string;
  clientName: string;
  email: string;
  phone: string;
  dob: string;
  tob: string;
  topic: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentSlot: string; // HH:mm
  durationMinutes: number;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf8");
  }
}

export async function readBookings(): Promise<BookingRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf8");
  return JSON.parse(raw) as BookingRecord[];
}

async function writeBookings(records: BookingRecord[]) {
  await ensureStore();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(records, null, 2), "utf8");
}

export async function appendBooking(
  record: Omit<BookingRecord, "id" | "createdAt" | "status"> & {
    status?: BookingStatus;
  }
) {
  const bookings = await readBookings();
  const newRecord: BookingRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: record.status ?? "confirmed",
  };
  bookings.push(newRecord);
  await writeBookings(bookings);
  return newRecord;
}

export async function isSlotAlreadyBooked(astrologerId: string, date: string, slot: string) {
  const bookings = await readBookings();
  return bookings.some(
    (b) =>
      b.astrologerId === astrologerId &&
      b.appointmentDate === date &&
      b.appointmentSlot === slot &&
      b.status !== "cancelled"
  );
}

export async function getBookingsForAstrologer(astrologerId: string) {
  const bookings = await readBookings();
  return bookings.filter((b) => b.astrologerId === astrologerId);
}

export async function getAllBookings() {
  return readBookings();
}

export async function getBookingById(id: string) {
  const bookings = await readBookings();
  return bookings.find((b) => b.id === id) || null;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const bookings = await readBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;
  bookings[index].status = status;
  await writeBookings(bookings);
  return bookings[index];
}

