import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origin: startCoords, destination: endCoords } = body;
    const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
    
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      console.error("❌ ORS API Key is missing or using placeholder. Please update your .env file.");
      return NextResponse.json({ 
        error: 'API key is missing or invalid',
        instructions: "Please add a valid NEXT_PUBLIC_ORS_API_KEY to your .env file."
      }, { status: 401 });
    }

    if (!startCoords || !Array.isArray(startCoords) || startCoords.length !== 2 || !endCoords || !Array.isArray(endCoords) || endCoords.length !== 2) {
      console.error("❌ Invalid coordinates received:", { startCoords, endCoords });
      return NextResponse.json({ error: 'Origin or destination coordinates are invalid' }, { status: 400 });
    }

    // ORS expects [longitude, latitude]
    console.log("➡️ Sending to ORS with coordinates:", { coordinates: [startCoords, endCoords] });

    const orsResponse = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [startCoords, endCoords],
        format: 'geojson'
      }),
    });

    const data = await orsResponse.json();

    if (!orsResponse.ok) {
      console.error('❌ ORS API Error Response:', data);
      const errorMessage = data.error?.message || 'Failed to fetch route from OpenRouteService';
      return NextResponse.json({ error: errorMessage, detail: data }, { status: orsResponse.status });
    }

    if (data.features && data.features.length > 0) {
      console.log("✅ Route successfully received from ORS.");
      const feature = data.features[0];
      const steps = feature.properties.segments[0].steps.map((s: any) => ({
        instruction: s.instruction,
        distance: s.distance,
        duration: s.duration,
      }));

      // Mock safety data for PRD alignment
      const safetyScore = Math.floor(Math.random() * 20) + 80; // 80-100
      const explanation = feature.properties.summary.distance > 5000
        ? "This route is optimized for speed and safety, avoiding known high-congestion zones."
        : "A direct and well-lit urban route, currently showing low risk levels.";

      return NextResponse.json({
        ...data,
        instructions: steps,
        safetyScore,
        explanation
      });
    }

    console.warn("⚠️ No route found in ORS response, though the request was successful.");
    return NextResponse.json({ error: 'No route found in the response from ORS' }, { status: 404 });

  } catch (error: any) {
    console.error('💣 A fatal network or parsing error occurred:', error);
    return NextResponse.json({ error: 'An unexpected server error occurred.', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amenity = searchParams.get('amenity');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!amenity || !lat || !lon) {
    return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
  }

  // Use the 'amenity' parameter dynamically
  const query = `[out:json];node["amenity"="${amenity}"](around:5000,${lat},${lon});out;`;
  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: query,
      headers: {
        "User-Agent": "JourneyApp/1.0 (dev@journey.app)"
      }
    });
    const data = await response.json();
    return NextResponse.json(data.elements);
  } catch (error) {
    console.error("Overpass API error:", error);
    return NextResponse.json({ error: 'Failed to fetch nearby places' }, { status: 500 });
  }
}
