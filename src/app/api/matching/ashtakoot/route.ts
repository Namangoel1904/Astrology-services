import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Hardcoded per user request
    const apiKey = "6bff3246-afb9-5027-92c1-f2c6f1c182f5";

    const body = await req.json();
    const payload = {
      api_key: apiKey,
      boy_dob: body.boy_dob,
      boy_tob: body.boy_tob,
      boy_tz: body.boy_tz,
      boy_lat: body.boy_lat,
      boy_lon: body.boy_lon,
      girl_dob: body.girl_dob,
      girl_tob: body.girl_tob,
      girl_tz: body.girl_tz,
      girl_lat: body.girl_lat,
      girl_lon: body.girl_lon,
      lang: body.lang || "en",
    };

    // Try with trailing slash to avoid upstream 404s
    const upstreamUrl = "https://api.vedicastroapi.com/v3-json/matching/ashtakoot/";
    const res = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Avoid Next caching for dynamic data
      cache: "no-store",
    });

    let json: any = null;
    try {
      json = await res.json();
    } catch (_) {
      json = { message: "Upstream did not return JSON" };
    }
    const status = res.ok && (json?.status !== false);
    // Always return 200 to let the client surface upstream errors gracefully
    return NextResponse.json({ status, upstreamStatus: res.status, ...json }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { status: false, message: e?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}


