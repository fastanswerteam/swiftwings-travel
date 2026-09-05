-- CreateTable
CREATE TABLE "sw_admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sw_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sw_bookings" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "passengerTitle" TEXT NOT NULL DEFAULT 'Mr',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passportNumber" TEXT,
    "nationality" TEXT,
    "fromCity" TEXT NOT NULL,
    "fromCode" TEXT NOT NULL,
    "fromAirport" TEXT NOT NULL,
    "toCity" TEXT NOT NULL,
    "toCode" TEXT NOT NULL,
    "toAirport" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "departureTime" TEXT NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "cabinClass" TEXT NOT NULL DEFAULT 'Economy',
    "stops" TEXT NOT NULL DEFAULT 'Direct',
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "personalItem" TEXT NOT NULL DEFAULT '1 personal item (40x30x15cm)',
    "carryOn" TEXT NOT NULL DEFAULT '1 carry-on bag (55x40x20cm, max 10kg)',
    "checkedBaggage" TEXT NOT NULL DEFAULT 'No free checked baggage',
    "ticketFare" DECIMAL(10,2) NOT NULL,
    "taxesFees" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "promoCode" TEXT,
    "promoDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "specialRequests" TEXT,
    "mealPreference" TEXT,
    "seatPreference" TEXT,
    "bookedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sw_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sw_admins_email_key" ON "sw_admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sw_bookings_trackingCode_key" ON "sw_bookings"("trackingCode");
