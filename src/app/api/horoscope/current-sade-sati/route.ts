import { NextRequest, NextResponse } from "next/server";

const API_KEY = "2892b990-0f07-5fea-809b-10e2886844c7";
const UPSTREAM_URL =
  "https://api.vedicastroapi.com/v3-json/extended-horoscope/current-sade-sati";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function formatDate(date: string) {
  if (!date) return date;
  if (date.includes("/")) return date;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { dob, tob, lat, lon, tz = 5.5, lang = "hi" } = body || {};

    if (!dob || !tob || !lat || !lon) {
      return NextResponse.json(
        { status: 400, error: "Missing required fields: dob, tob, lat, lon" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    dob = formatDate(dob);

    const params: Record<string, string> = {
      api_key: API_KEY,
      dob,
      tob,
      lat: String(lat),
      lon: String(lon),
      tz: String(tz),
      lang,
    };

    const query = new URLSearchParams(params).toString();
    const upstream = await fetch(`${UPSTREAM_URL}?${query}`, { method: "GET" });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => "");
      console.error("Current Sade Sati upstream error:", upstream.status, errorText);
      return NextResponse.json(
        { status: upstream.status, error: errorText || "Upstream error" },
        { status: upstream.status, headers: CORS_HEADERS }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (error: any) {
    console.error("Current Sade Sati API error:", error);
    return NextResponse.json(
      { status: 500, error: error?.message || "Unexpected error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}



