import { NextRequest, NextResponse } from 'next/server';

const API_KEY = '2892b990-0f07-5fea-809b-10e2886844c7';
const UPSTREAM_URL = 'https://api.vedicastroapi.com/v3-json/horoscope/planet-details';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}

// Test endpoint to verify route is working
export async function GET() {
  return NextResponse.json(
    { message: 'Planet details API route is working', timestamp: new Date().toISOString() },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { dob, tob, lat, lon, tz, lang = 'hi', house_type = 'whole-sign', zodiac_type = 'sidereal' } = body;
    // Convert date format if needed (YYYY-MM-DD -> DD/MM/YYYY)
    if (dob && dob.includes('-')) {
      const [y, m, d] = dob.split('-');
      dob = `${d}/${m}/${y}`;
    }

    const params = {
      api_key: API_KEY,
      dob,
      tob,
      lat,
      lon,
      tz,
      lang,
      house_type,
      zodiac_type,
    };
    // Construct query string for GET (as seen in other proxies)
    const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
    const url = `${UPSTREAM_URL}?${qs}`;
    let response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      // fallback to POST form-urlencoded
      const form = new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v)])).toString();
      response = await fetch(UPSTREAM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form
      });
    }
    if (!response.ok) {
      const err = await response.text();
      console.error('VedicAstroAPI error:', response.status, err);
      return NextResponse.json(
        { status: false, error: err }, 
        { status: 502, headers: CORS_HEADERS }
      );
    }
    const data = await response.json();

    
    // Check if API returned an error status (like 402 for out of calls)
    if (data.status && data.status !== 200) {
      console.error('VedicAstroAPI returned error status:', data.status, data.response || data);
      return NextResponse.json(data, { 
        status: data.status || 400, 
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } 
      });
    }
    
    return NextResponse.json(data, { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } 
    });
  } catch (e: any) {
    console.error('Planet details API error:', e);
    return NextResponse.json(
      { status: false, error: e?.message||'Unexpected Error' }, 
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
