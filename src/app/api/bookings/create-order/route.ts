import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { findAstrologer } from "@/lib/astrologers-data";
import { isSlotAlreadyBooked } from "@/lib/bookings-store";

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const razorpay =
  RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      })
    : null;

export async function OPTIONS() {
  return NextResponse.json({}, { headers: HEADERS });
}

export async function POST(req: NextRequest) {
  if (!razorpay) {
    return NextResponse.json(
      { error: "Razorpay कॉन्फिगर नहीं है" },
      { status: 500, headers: HEADERS }
    );
  }

  try {
    const body = await req.json();
    const {
      astrologerId,
      date,
      slot,
      clientName,
      email,
      phone,
      dob,
      tob,
      topic,
    } = body;

    if (
      !astrologerId ||
      !date ||
      !slot ||
      !clientName ||
      !email ||
      !phone ||
      !dob ||
      !tob ||
      !topic
    ) {
      return NextResponse.json(
        { error: "सभी फ़ील्ड आवश्यक हैं" },
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

    const alreadyBooked = await isSlotAlreadyBooked(astrologer.id, date, slot);
    if (alreadyBooked) {
      return NextResponse.json(
        { error: "यह स्लॉट पहले से बुक है" },
        { status: 409, headers: HEADERS }
      );
    }

    const amount = astrologer.fee * 100;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ASTRO-${astrologer.id}-${Date.now()}`,
      notes: {
        astrologerId: astrologer.id,
        date,
        slot,
        clientName,
        email,
        phone,
        topic,
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        razorpayKey: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        appointment: {
          astrologerName: astrologer.name,
          date,
          slot,
        },
        client: {
          clientName,
          email,
          phone,
          dob,
          tob,
          topic,
        },
      },
      { headers: HEADERS }
    );
  } catch (error: any) {
    console.error("create-order error", error);
    return NextResponse.json(
      { error: "ऑर्डर बनाने में समस्या", details: error?.message },
      { status: 500, headers: HEADERS }
    );
  }
}

