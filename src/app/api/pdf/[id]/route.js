import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import { BookingPDF } from '@/components/BookingPDF';
import QRCode from 'qrcode';
import React from 'react';

export async function GET(request, { params }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track/${booking.trackingCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, {
      width: 220,
      margin: 2,
      color: { dark: '#2B5CE6', light: '#FFFFFF' },
    });

    const pdfBuffer = await renderToBuffer(
      React.createElement(BookingPDF, { booking, qrCodeDataUrl })
    );

    const safeFirstName = booking.firstName.replace(/[^a-zA-Z0-9]/g, '');
    const safeLastName = booking.lastName.replace(/[^a-zA-Z0-9]/g, '');
    const filename = `${safeFirstName}_${safeLastName}_FLIGHT_BOOKING_CONFIRMED.pdf`.toUpperCase();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ message: 'Failed to generate PDF' }, { status: 500 });
  }
}