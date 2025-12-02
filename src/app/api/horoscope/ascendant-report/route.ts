import { NextRequest, NextResponse } from 'next/server';

const API_KEY = '2892b990-0f07-5fea-809b-10e2886844c7';
const UPSTREAM_URL = 'https://api.vedicastroapi.com/v3-json/horoscope/ascendant-report';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { dob, tob, lat, lon, tz, lang = 'hi' } = body;
    if (dob && dob.includes('-')) {
      const [y, m, d] = dob.split('-');
      dob = `${d}/${m}/${y}`;
    }
    const params = { api_key: API_KEY, dob, tob, lat, lon, tz, lang };
    const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
    const url = `${UPSTREAM_URL}?${qs}`;
    let response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      // fallback to POST form-urlencoded
      const form = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
      response = await fetch(UPSTREAM_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form });
    }
    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ status: false, error: err }, { status: 502 });
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ status: false, error: e?.message || 'Unexpected Error' }, { status: 500 });
  }
}
