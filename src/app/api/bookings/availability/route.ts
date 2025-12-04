import { NextRequest, NextResponse } from "next/server";
import { findAstrologer } from "@/lib/astrologers-data";
import { getSlotsForDate } from "@/lib/availability";
import { isSlotAlreadyBooked } from "@/lib/bookings-store";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const { astrologerId, date } = await req.json();
    if (!astrologerId || !date) {
      return NextResponse.json(
        { error: "astrologerId और date आवश्यक हैं" },
        { status: 400, headers: HEADERS }
      );
    }

    const astrologer = findAstrologer(astrologerId);
    if (!astrologer) {
      return NextResponse.json(
        { error: "ज्योतिषी नहीं मिला" },
        { status: 404, headers: HEADERS }
      );
    }

    const targetDate = new Date(date);

    // Get current time in IST (UTC + 5.5 hours)
    const nowUtc = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const today = new Date(nowUtc.getTime() + istOffset);

    // Compare YYYY-MM-DD strings to determine if the requested date is today
    const todayStr = today.toISOString().split("T")[0];
    const isToday = date === todayStr;

    const slots = getSlotsForDate(astrologer, targetDate);
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    // Current time in minutes since midnight, IST
    const nowMinutes = today.getUTCHours() * 60 + today.getUTCMinutes();

    const filtered: string[] = [];
    for (const slot of slots) {
      // Hide past slots for today's date
      if (isToday && toMinutes(slot) <= nowMinutes) continue;

      const taken = await isSlotAlreadyBooked(astrologer.id, date, slot);
      if (!taken) filtered.push(slot);
    }

    return NextResponse.json({ slots: filtered }, { headers: HEADERS });
  } catch (error: any) {
    console.error("availability error", error);
    return NextResponse.json(
      { error: "उपलब्धता लोड करने में समस्या" },
      { status: 500, headers: HEADERS }
    );
  }
}

