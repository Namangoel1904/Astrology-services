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
    const body = await request.json();
    console.log('Chart image request body:', body);

    const {
      dob,
      tob,
      lat,
      lon,
      tz,
      div = 'D1',
      style = 'north',
      color = '000000',
      lang = 'hi'
    } = body;

    // Validate required fields
    if (!dob || !tob) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields: dob and tob' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Convert date from YYYY-MM-DD to DD/MM/YYYY format if needed
    const convertDateFormat = (dateStr: string) => {
      // Check if it's already in DD/MM/YYYY format
      if (dateStr.includes('/')) {
        return dateStr;
      }
      // Convert from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    const dob_converted = convertDateFormat(dob);

    const apiKey = '6bff3246-afb9-5027-92c1-f2c6f1c182f5';
    
    // Prepare the request payload
    const payload = {
      dob: dob_converted,
      tob,
      lat: lat || "28.033709",
      lon: lon || "79.120544",
      tz: tz || 5.5,
      div,
      style,
      color,
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
    const url = `https://api.vedicastroapi.com/v3-json/horoscope/chart-image?${queryString}`;
    
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

      response = await fetch('https://api.vedicastroapi.com/v3-json/horoscope/chart-image', {
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
      return new NextResponse(
        JSON.stringify({ error: `API request failed: ${response.status}`, body: errorText }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // The API returns SVG content directly
    const svgContent = await response.text();
    console.log('API returned SVG content, length:', svgContent.length);

    // Return the SVG content
    return new NextResponse(JSON.stringify({ svg: svgContent }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (error) {
    console.error('Chart image API error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch chart image' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}

