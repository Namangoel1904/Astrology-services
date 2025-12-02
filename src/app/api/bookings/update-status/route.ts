import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getBookingById, updateBookingStatus } from "@/lib/bookings-store";

const VALID_STATUS = ["pending", "confirmed", "completed", "cancelled"] as const;

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookingId, status } = await req.json();
    if (!bookingId || !status || !VALID_STATUS.includes(status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (session.role !== "admin" && booking.astrologerId !== session.astrologerId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const updated = await updateBookingStatus(bookingId, status);
    return NextResponse.json({ booking: updated });
  } catch (error: any) {
    console.error("update status error", error);
    return NextResponse.json({ error: "Unable to update booking" }, { status: 500 });
  }
}

