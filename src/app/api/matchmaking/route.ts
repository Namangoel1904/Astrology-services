import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Matchmaking API called');
    const body = await request.json();
    console.log('Matchmaking request body:', body);

    const {
      boy_dob,
      boy_tob,
      boy_tz,
      boy_lat,
      boy_lon,
      girl_dob,
      girl_tob,
      girl_tz,
      girl_lat,
      girl_lon,
      lang = 'hi'
    } = body;

    // Validate required fields
    if (!boy_dob || !boy_tob || !girl_dob || !girl_tob) {
      console.error('Missing required fields:', { boy_dob, boy_tob, girl_dob, girl_tob });
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Convert date from YYYY-MM-DD to DD/MM/YYYY format
    const convertDateFormat = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    const boy_dob_converted = convertDateFormat(boy_dob);
    const girl_dob_converted = convertDateFormat(girl_dob);

    // Ensure timezone is a number (not string)
    const boy_tz_num = typeof boy_tz === 'number' ? boy_tz : parseFloat(boy_tz || '5.5');
    const girl_tz_num = typeof girl_tz === 'number' ? girl_tz : parseFloat(girl_tz || '5.5');

    const apiKey = '6bff3246-afb9-5027-92c1-f2c6f1c182f5';
    
    // Prepare the request payload
    const payload = {
      boy_dob: boy_dob_converted,
      boy_tob,
      boy_tz: boy_tz_num,
      boy_lat: boy_lat || "28.033709",
      boy_lon: boy_lon || "79.120544",
      girl_dob: girl_dob_converted,
      girl_tob,
      girl_tz: girl_tz_num,
      girl_lat: girl_lat || "28.679079",
      girl_lon: girl_lon || "77.069710",
      lang,
      api_key: apiKey
    };

    console.log('Sending request to VedicAstroAPI:', payload);

    // Try GET with query params (like Panchang API)
    const queryString = new URLSearchParams(
      Object.entries(payload).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const url = `https://api.vedicastroapi.com/v3-json/matching/dashakoot-with-astro-details?${queryString}`;
    
    console.log('GET URL:', url);
    
    let response = await fetch(url, { method: 'GET' });
    
    console.log('GET request response status:', response.status);
    
    // If GET fails, try POST with form-urlencoded
    if (!response.ok) {
      console.log('GET failed, trying POST with form-urlencoded...');
      const formData = new URLSearchParams(
        Object.entries(payload).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      );

      console.log('Form data string:', formData.toString());

      response = await fetch('https://api.vedicastroapi.com/v3-json/matching/dashakoot-with-astro-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      console.log('POST request response status:', response.status);
    }

    console.log('Final API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);

    return new NextResponse(JSON.stringify(data), { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  } catch (error) {
    console.error('Matchmaking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return new NextResponse(
      JSON.stringify({ error: `Failed to fetch matchmaking data: ${errorMessage}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}

