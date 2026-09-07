import { NextResponse } from 'next/server';

async function lookupAirport(iata, apiKey) {
  if (!iata) return null;
  const url = `http://api.aviationstack.com/v1/airports?access_key=${apiKey}&iata_code=${encodeURIComponent(iata)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const json = await res.json();
  if (json.error || !json.data || json.data.length === 0) return null;
  const a = json.data[0];
  return {
    lat: parseFloat(a.latitude),
    lng: parseFloat(a.longitude),
    name: a.airport_name,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dep = searchParams.get('dep');
  const arr = searchParams.get('arr');

  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: 'Flight status service is not configured' }, { status: 500 });
  }

  try {
    const [depData, arrData] = await Promise.all([
      lookupAirport(dep, apiKey),
      lookupAirport(arr, apiKey),
    ]);

    if (!depData && !arrData) {
      return NextResponse.json({ message: 'Airport coordinates are not available on the current plan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, departure: depData, arrival: arrData });
  } catch (err) {
    console.error('Airport coords error:', err);
    return NextResponse.json({ message: 'Failed to fetch airport coordinates' }, { status: 500 });
  }
}