// /src/app/api/search/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`, {
      headers: {
        'User-Agent': 'JourneyApp/1.0 (dev@journey.app)' // Nominatim requires a User-Agent
      }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Nominatim search API error:', errorText);
        return NextResponse.json({ error: 'Failed to fetch suggestions from Nominatim' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Search geocoding failed:', err);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
