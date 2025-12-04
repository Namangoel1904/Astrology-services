import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findAstrologer } from "@/lib/astrologers-data";
import { appendBooking, isSlotAlreadyBooked } from "@/lib/bookings-store";
import { sendBookingEmails } from "@/lib/mailer";

const { RAZORPAY_KEY_SECRET } = process.env;

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: HEADERS });
}

export async function POST(req: NextRequest) {
  if (!RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay secret missing" },
      { status: 500, headers: HEADERS }
    );
  }

  try {
    const body = await req.json();
    const {
      orderId,
      paymentId,
      signature,
      astrologerId,
      date,
      slot,
      client,
      amount,
      currency = "INR",
    } = body;

    if (
      !orderId ||
      !paymentId ||
      !signature ||
      !astrologerId ||
      !date ||
      !slot ||
      !client?.clientName ||
      !client?.email ||
      !client?.phone
    ) {
      return NextResponse.json(
        { error: "डेटा अधूरा है" },
        { status: 400, headers: HEADERS }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: "भुगतान सत्यापन विफल" },
        { status: 403, headers: HEADERS }
      );
    }

    const astrologer = findAstrologer(astrologerId);
    if (!astrologer) {
      return NextResponse.json(
        { error: "ज्योतिषी नहीं मिला" },
        { status: 404, headers: HEADERS }
      );
    }

    const taken = await isSlotAlreadyBooked(astrologer.id, date, slot);
    if (taken) {
      return NextResponse.json(
        { error: "यह स्लॉट अभी-अभी बुक हो गया" },
        { status: 409, headers: HEADERS }
      );
    }

    const booking = await appendBooking({
      astrologerId: astrologer.id,
      astrologerName: astrologer.name,
      clientName: client.clientName,
      email: client.email,
      phone: client.phone,
      dob: client.dob,
      tob: client.tob,
      topic: client.topic,
      birthplace: client.birthplace,
      appointmentDate: date,
      appointmentSlot: slot,
      durationMinutes: astrologer.sessionMinutes,
      amount: amount ?? astrologer.fee * 100,
      currency,
      paymentId,
      orderId,
    });

    try {
      await sendBookingEmails(booking);
    } catch (mailError) {
      console.error("Email dispatch failed", mailError);
      // Proceed without failing the booking so payment + booking stay confirmed.
    }

    return NextResponse.json({ booking }, { headers: HEADERS });
  } catch (error: any) {
    console.error("confirm booking error", error);
    return NextResponse.json(
      { error: "बुकिंग सेव करने में समस्या", details: error?.message },
      { status: 500, headers: HEADERS }
    );
  }
}

