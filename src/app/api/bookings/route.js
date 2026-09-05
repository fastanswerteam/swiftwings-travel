import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTrackingCode } from '@/lib/trackingCode';
import { getAdminFromRequest } from '@/lib/jwt';

export async function GET(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: bookings });
}

export async function POST(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  let trackingCode;
  let exists = true;
  while (exists) {
    trackingCode = generateTrackingCode();
    exists = await prisma.booking.findUnique({ where: { trackingCode } });
  }

  const booking = await prisma.booking.create({
    data: {
      ...body,
      trackingCode,
      bookedBy: admin.email,
      adults: parseInt(body.adults) || 1,
      children: parseInt(body.children) || 0,
      infants: parseInt(body.infants) || 0,
      ticketFare: parseFloat(body.ticketFare),
      taxesFees: parseFloat(body.taxesFees),
      totalAmount: parseFloat(body.totalAmount),
      promoDiscount: parseFloat(body.promoDiscount) || 0,
      departureDate: new Date(body.departureDate),
      arrivalDate: new Date(body.arrivalDate),
    },
  });

  return NextResponse.json({ success: true, data: booking }, { status: 201 });
}