import { NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}

// Simple geocoding proxy to OpenStreetMap Nominatim
// Docs: https://nominatim.org/release-docs/latest/api/Search/
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const limit = searchParams.get("limit") || "8";
    const countrycodes = searchParams.get("countrycodes") || "in"; // default India; can be overridden

    if (!q) {
      return NextResponse.json({ message: "Missing query param 'q'" }, { status: 400 });
    }

    const upstreamUrl = new URL("https://nominatim.openstreetmap.org/search");
    upstreamUrl.searchParams.set("q", q);
    upstreamUrl.searchParams.set("format", "json"); // Use standard json format
    upstreamUrl.searchParams.set("limit", limit);
    upstreamUrl.searchParams.set("addressdetails", "1");
    upstreamUrl.searchParams.set("countrycodes", countrycodes);
    upstreamUrl.searchParams.set("extratags", "0");
    upstreamUrl.searchParams.set("namedetails", "0");

    // Get origin from request for better Referer
    const origin = req.headers.get("origin") || req.headers.get("referer") || "https://localhost:3000";

    // Create timeout controller for better compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let upstream: Response;
    try {
      upstream = await fetch(upstreamUrl.toString(), {
        method: "GET",
        headers: {
          // Nominatim requires an identifying User-Agent
          "User-Agent": "AstrologyConsultancyApp/1.0 (https://localhost:3000)",
          "Accept": "application/json",
          "Accept-Language": "en-IN,en;q=0.9",
          "Referer": origin,
        },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { message: "Request timeout - geocoding service took too long", items: [] },
          { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
        );
      }
      throw fetchError; // Re-throw other errors to outer catch
    }

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error(`Nominatim API error: ${upstream.status} - ${text}`);
      // Return a more helpful error
      return NextResponse.json(
        { 
          message: "Geocoding service temporarily unavailable", 
          status: upstream.status,
          items: [] // Return empty array so UI doesn't break
        },
        { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    let results: any[] = [];
    try {
      results = await upstream.json();
      if (!Array.isArray(results)) {
        results = [];
      }
    } catch (parseError) {
      console.error("Failed to parse Nominatim response:", parseError);
      return NextResponse.json(
        { message: "Invalid response from geocoding service", items: [] },
        { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    // Normalize to a concise structure
    // Standard JSON format returns: place_id, display_name, lat, lon, type, class, address
    const items = results.map((r: any) => ({
      id: r.place_id || r.osm_id || String(Math.random()),
      name: r.display_name || r.name || "",
      lat: String(r.lat || r.latitude || ""),
      lon: String(r.lon || r.longitude || ""),
      type: r.type || "",
      class: r.class || "",
      address: r.address || {},
    })).filter((item) => item.lat && item.lon); // Only include items with valid coordinates

    return new NextResponse(JSON.stringify({ items }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({ message: e?.message || "Unexpected error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }
}


