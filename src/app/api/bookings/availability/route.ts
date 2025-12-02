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

    const slots = getSlotsForDate(astrologer, new Date(date));
    const filtered = [];
    for (const slot of slots) {
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

