import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Horoscope API called");
    const body = await request.json();
    console.log("Received body:", body);
    
    const { date, zodiac, split = false, type = "big", lang = "mr" } = body;

    const api_key = "6bff3246-afb9-5027-92c1-f2c6f1c182f5";

    const payload = {
      api_key,
      date,
      zodiac,
      split,
      type,
      lang
    };

    console.log("Sending to upstream API:", payload);

    // Try different approaches for the API call
    let response;
    
    // Method 1: Direct parameters in URL
    const urlParams = new URLSearchParams({
      api_key,
      date,
      zodiac: zodiac.toString(),
      split: split.toString(),
      type,
      lang
    });
    
    console.log("Trying GET method with URL params:", urlParams.toString());
    
    response = await fetch(`https://api.vedicastroapi.com/v3-json/prediction/daily-sun?${urlParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log("GET method response status:", response.status);
    
    if (response.status === 404) {
      // Method 2: POST with form data
      console.log("Trying POST with form data");
      const formData = new URLSearchParams();
      formData.append('api_key', api_key);
      formData.append('date', date);
      formData.append('zodiac', zodiac.toString());
      formData.append('split', split.toString());
      formData.append('type', type);
      formData.append('lang', lang);
      
      response = await fetch("https://api.vedicastroapi.com/v3-json/prediction/daily-sun", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      
      console.log("Form data method response status:", response.status);
    }
    
    if (response.status === 404) {
      // Method 3: POST with JSON (original method)
      console.log("Trying POST with JSON");
      response = await fetch("https://api.vedicastroapi.com/v3-json/prediction/daily-sun", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      console.log("JSON method response status:", response.status);
    }
    
    if (response.status === 404) {
      // Method 4: Try different endpoint format
      console.log("Trying alternative endpoint format");
      response = await fetch("https://api.vedicastroapi.com/v3-json/prediction/daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Alternative endpoint response status:", response.status);
    }

    console.log("Upstream response status:", response.status);
    const data = await response.json();
    console.log("Upstream response data:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Horoscope API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch horoscope data" },
      { status: 500 }
    );
  }
}
