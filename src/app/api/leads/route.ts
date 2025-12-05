import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, intent } = await req.json();

    if (!email || !intent) {
      return NextResponse.json(
        { error: "Email and intent are required" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Sheet webhook URL is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        intent,
        source: "landing-lead-modal",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Failed to push to Google Sheet", details: text },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error while submitting lead" },
      { status: 500 }
    );
  }
}

