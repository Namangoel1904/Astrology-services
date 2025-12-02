import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function convertDateFormat(dateStr: string) {
  if (!dateStr) return dateStr;
  if (dateStr.includes('/')) return dateStr;
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dob, tob, lat, lon, lang } = body || {};
    if (!dob || !tob || !lat || !lon) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields: dob, tob, lat, lon' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const payload: Record<string, string> = {
      api_key: process.env.VEDIC_ASTRO_API_KEY || '2892b990-0f07-5fea-809b-10e2886844c7',
      dob: convertDateFormat(dob),
      tob,
      lat: String(lat),
      lon: String(lon),
      tz: '5.5',
      lang: lang || 'hi'
    };

    const url = `https://api.vedicastroapi.com/v3-json/horoscope/ashtakvarga?${new URLSearchParams(payload)}`;
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`API request failed: ${resp.status} ${errText}`);
    }
    const data = await resp.json();
    return new NextResponse(JSON.stringify(data), { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error?.message || 'Failed to fetch ashtakvarga' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}


