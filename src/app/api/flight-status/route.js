import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get('flight');

  if (!flightNumber) {
    return NextResponse.json({ message: 'Flight number is required' }, { status: 400 });
  }

  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: 'Flight status service is not configured' }, { status: 500 });
  }

  try {
    const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${encodeURIComponent(flightNumber.trim().toUpperCase())}`;
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();

    if (json.error) {
      return NextResponse.json({ message: json.error.message || 'Flight lookup failed' }, { status: 502 });
    }

    if (!json.data || json.data.length === 0) {
      return NextResponse.json({ message: 'No live data found for this flight number' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: json.data[0] });
  } catch (err) {
    console.error('Flight status error:', err);
    return NextResponse.json({ message: 'Failed to fetch flight status' }, { status: 500 });
  }
}