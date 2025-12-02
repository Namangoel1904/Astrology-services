import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, date, lang } = body;

    // Validate required fields
    if (!name || !date) {
      return NextResponse.json(
        { error: 'Name and date are required' },
        { status: 400 }
      );
    }

    // Convert date format from YYYY-MM-DD to DD/MM/YYYY
    const formattedDate = date.split('-').reverse().join('/');

    const apiKey = '6bff3246-afb9-5027-92c1-f2c6f1c182f5';
    
    const params = {
      api_key: apiKey,
      name: name,
      date: formattedDate,
      lang: lang || 'hi'
    };

    console.log('Numerology API called with params:', params);

    // Try different request formats
    let response;
    let modeTried = '';

    try {
      // Method 1: GET with URL parameters
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        urlParams.append(key, value.toString());
      });
      
      const url = `https://api.vedicastroapi.com/v3-json/prediction/numerology?${urlParams.toString()}`;
      console.log('Trying GET with URL params:', url);
      
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      modeTried = 'get_url_params';
      
      if (response.ok) {
        const data = await response.json();
        console.log('GET URL params successful:', data);
        return NextResponse.json({
          status: 200,
          response: data.response,
          remaining_api_calls: data.remaining_api_calls
        });
      }
    } catch (error) {
      console.log('GET URL params failed:', error);
    }

    try {
      // Method 2: POST with form data
      const formData = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      console.log('Trying POST with form data');
      
      response = await fetch('https://api.vedicastroapi.com/v3-json/prediction/numerology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: formData.toString()
      });
      
      modeTried = 'post_form_data';
      
      if (response.ok) {
        const data = await response.json();
        console.log('POST form data successful:', data);
        return NextResponse.json({
          status: 200,
          response: data.response,
          remaining_api_calls: data.remaining_api_calls
        });
      }
    } catch (error) {
      console.log('POST form data failed:', error);
    }

    try {
      // Method 3: POST with JSON
      console.log('Trying POST with JSON');
      
      response = await fetch('https://api.vedicastroapi.com/v3-json/prediction/numerology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify(params)
      });
      
      modeTried = 'post_json';
      
      if (response.ok) {
        const data = await response.json();
        console.log('POST JSON successful:', data);
        return NextResponse.json({
          status: 200,
          response: data.response,
          remaining_api_calls: data.remaining_api_calls
        });
      }
    } catch (error) {
      console.log('POST JSON failed:', error);
    }

    // If all methods fail, return error
    const errorText = await response?.text();
    console.log('All methods failed. Last response:', response?.status, errorText);
    
    return NextResponse.json({
      error: 'Failed to fetch numerology data',
      modeTried,
      upstreamStatus: response?.status,
      upstreamResponse: errorText
    }, { status: 500 });

  } catch (error) {
    console.error('Numerology API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
