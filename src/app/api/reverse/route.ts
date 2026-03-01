
// /src/app/api/reverse/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: {
        'User-Agent': 'JourneyMaps/1.0 (journey@example.com)' // <-- REQUIRED
      }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Nominatim API error:', errorText);
        return NextResponse.json({ error: 'Failed to fetch address from Nominatim' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}
