import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const code = params.code.toUpperCase();

  const booking = await prisma.booking.findUnique({
    where: { trackingCode: code },
  });

  if (!booking) {
    return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: booking });
}