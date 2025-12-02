import { NextRequest, NextResponse } from 'next/server';

const API_KEY = '2892b990-0f07-5fea-809b-10e2886844c7';
const UPSTREAM_URL = 'https://api.vedicastroapi.com/v3-json/horoscope/chart-image';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { dob, tob, lat, lon, tz, lang = 'hi', div = 'D1', api_key = API_KEY, style = 'north', color = '000000' } = body;
    // Convert YYYY-MM-DD to DD/MM/YYYY if needed
    if (dob && dob.includes('-')) {
      const [y, m, d] = dob.split('-');
      dob = `${d}/${m}/${y}`;
    }
    const params = { dob, tob, lat, lon, tz, lang, div, api_key, style, color };
    // GET attempt
    const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
    let response = await fetch(`${UPSTREAM_URL}?${qs}`, { method: 'GET' });
    let svg = await response.text();
    if (!response.ok || svg[0] !== '<') {
      // fallback POST urlencoded
      const form = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
      const postResponse = await fetch(UPSTREAM_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form });
      svg = await postResponse.text();
      if (!postResponse.ok || svg[0] !== '<') {
        return NextResponse.json({ error: 'SVG chart not found or upstream error.' }, { status: 502 });
      }
    }
    return NextResponse.json({ svg }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected Error' }, { status: 500 });
  }
}
