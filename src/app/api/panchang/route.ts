import { NextRequest, NextResponse } from "next/server";

const API_KEY = "6bff3246-afb9-5027-92c1-f2c6f1c182f5";
const UPSTREAM_URL = "https://api.vedicastroapi.com/v3-json/panchang/panchang";

export async function POST(req: NextRequest) {
  try {
    const clientData = await req.json();

    // Validate input
    if (!clientData.date || !clientData.lat || !clientData.lon || !clientData.tz) {
      return NextResponse.json(
        { message: "Missing required fields: date, lat, lon, tz" },
        { status: 400 }
      );
    }

    // Ensure date is in DD/MM/YYYY format for the upstream API
    let formattedDate = clientData.date;
    if (formattedDate && formattedDate.includes('-')) {
      const [year, month, day] = formattedDate.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    // Validate lat/lon are numeric
    const lat = parseFloat(clientData.lat);
    const lon = parseFloat(clientData.lon);
    const tz = parseFloat(clientData.tz);

    if (isNaN(lat) || isNaN(lon) || isNaN(tz)) {
      return NextResponse.json(
        { message: "lat, lon, and tz must be valid numbers" },
        { status: 400 }
      );
    }

    const params = {
      api_key: API_KEY,
      date: formattedDate,
      lat: String(lat),
      lon: String(lon),
      tz: tz,
      lang: clientData.lang || "mr",
    };

    // Use GET with query string (the working method)
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const upstreamUrl = `${UPSTREAM_URL}?${queryString}`;

    const upstreamResponse = await fetch(upstreamUrl, { method: "GET" });
    const upstreamData = await upstreamResponse.json();

    if (upstreamResponse.status !== 200) {
      return NextResponse.json(
        { message: "Upstream API error", error: upstreamData },
        { status: upstreamResponse.status }
      );
    }

    return NextResponse.json(upstreamData, { status: 200 });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}