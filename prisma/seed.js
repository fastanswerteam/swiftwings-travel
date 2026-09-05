const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 12);

  await prisma.admin.upsert({
    where: { email: 'admin@swiftairline.com' },
    update: {},
    create: {
      email: 'admin@swiftairline.com',
      password,
      name: 'SwiftAirline Admin',
    },
  });

  await prisma.booking.upsert({
    where: { trackingCode: 'SA4147' },
    update: {},
    create: {
      trackingCode: 'SA4147',
      status: 'confirmed',
      passengerTitle: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+2348012345678',
      passportNumber: 'A12345678',
      nationality: 'Nigerian',
      fromCity: 'Lagos',
      fromCode: 'LOS',
      fromAirport: 'Murtala Muhammed International Airport',
      toCity: 'London',
      toCode: 'LHR',
      toAirport: 'London Heathrow Airport',
      departureDate: new Date('2026-09-15'),
      departureTime: '23:45',
      arrivalDate: new Date('2026-09-16'),
      arrivalTime: '06:30',
      flightNumber: 'SA4147',
      airline: 'SwiftAirline',
      duration: '6h 45m',
      cabinClass: 'Economy',
      stops: 'Direct',
      adults: 1,
      children: 0,
      infants: 0,
      personalItem: '1 personal item (40x30x15cm, max 5kg)',
      carryOn: '1 carry-on bag (55x40x20cm, max 10kg)',
      checkedBaggage: 'No free checked baggage',
      ticketFare: 780.00,
      taxesFees: 145.00,
      totalAmount: 925.00,
      currency: 'USD',
      bookedBy: 'Admin',
    },
  });

  console.log('Seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());