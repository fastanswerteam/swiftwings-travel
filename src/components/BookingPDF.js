import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', fontFamily: 'Helvetica', padding: 40 },

  header: { backgroundColor: '#2B5CE6', margin: -40, marginBottom: 30, padding: 34 },
  companyName: { color: '#FFD700', fontSize: 15, fontFamily: 'Helvetica-Bold', marginBottom: 10 },
  headerTitle: { color: '#FFFFFF', fontSize: 26, fontFamily: 'Helvetica-Bold' },
  headerSubtitle: { color: '#FFFFFF', fontSize: 12, marginTop: 6, opacity: 0.85 },

  miniHeader: { backgroundColor: '#2B5CE6', margin: -40, marginBottom: 34, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniHeaderBrand: { color: '#FFD700', fontSize: 13, fontFamily: 'Helvetica-Bold' },
  miniHeaderCode: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },

  sectionTitle: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #2B5CE6' },

  totalSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, marginBottom: 26, borderBottom: '1px solid #E5E7EB' },
  totalLabel: { fontSize: 12, color: '#6B7280' },
  totalAmount: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#2B5CE6' },
  statusBadge: { backgroundColor: '#DCFCE7', color: '#16A34A', padding: '6 14', borderRadius: 20, fontSize: 11, fontFamily: 'Helvetica-Bold' },

  flightRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 14 },
  timeBlock: { width: 120 },
  timeText: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#111827' },
  codeText: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#2B5CE6', marginTop: 4 },
  airportName: { fontSize: 10, color: '#6B7280', marginTop: 4 },

  durationBlock: { flex: 1, alignItems: 'center', paddingHorizontal: 14, paddingTop: 10 },
  durationLine: { height: 1, backgroundColor: '#D1D5DB', width: '100%' },
  durationText: { fontSize: 10, color: '#6B7280', marginVertical: 6 },

  flightMeta: { backgroundColor: '#F9FAFB', padding: 18, borderRadius: 10, marginTop: 18 },
  flightMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  flightMetaLabel: { fontSize: 10, color: '#6B7280' },
  flightMetaValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#111827', marginTop: 4 },

  noteBox: { marginTop: 22, padding: 16, backgroundColor: '#EFF6FF', borderRadius: 8, borderLeft: '3px solid #2B5CE6' },
  noteTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1E40AF', marginBottom: 6 },
  noteText: { fontSize: 9, color: '#3B82F6', lineHeight: 1.5 },

  passengerRow: { padding: 18, backgroundColor: '#F9FAFB', borderRadius: 10, marginBottom: 20 },
  passengerName: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: '#111827' },

  infoRow: { flexDirection: 'row', marginBottom: 13, paddingBottom: 13, borderBottom: '1px solid #F3F4F6' },
  infoLabel: { fontSize: 11, color: '#6B7280', width: 160 },
  infoValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111827', flex: 1 },

  baggageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 18, backgroundColor: '#F9FAFB', borderRadius: 10, marginBottom: 14 },
  baggageLabel: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#374151' },
  baggageValue: { fontSize: 10, color: '#6B7280', marginTop: 6, maxWidth: 340, lineHeight: 1.4 },
  includedTag: { fontSize: 10, color: '#16A34A', fontFamily: 'Helvetica-Bold' },
  warningTag: { backgroundColor: '#FEF3C7', padding: '5 12', borderRadius: 4 },
  warningText: { fontSize: 9, color: '#D97706', fontFamily: 'Helvetica-Bold' },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, borderBottom: '1px solid #F3F4F6' },
  priceLabel: { fontSize: 11, color: '#6B7280' },
  priceValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111827' },
  priceTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, marginTop: 6 },
  priceTotalLabel: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#111827' },
  priceTotalValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#2B5CE6' },

  qrSection: { alignItems: 'center', padding: 30, backgroundColor: '#F9FAFB', borderRadius: 10, marginTop: 28 },
  trackingCode: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#2B5CE6', letterSpacing: 1, marginTop: 12 },
  trackingLabel: { fontSize: 10, color: '#6B7280', marginTop: 6 },

  lightFooter: { marginTop: 20, paddingTop: 12, borderTop: '1px solid #F3F4F6' },
  lightFooterText: { fontSize: 8, color: '#9CA3AF', textAlign: 'center' },

  fullFooter: { backgroundColor: '#2B5CE6', margin: -40, marginTop: 30, padding: 22, alignItems: 'center' },
  footerBrand: { color: '#FFD700', fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  footerText: { color: '#FFFFFF', fontSize: 9, textAlign: 'center', opacity: 0.85, marginTop: 3 },
  footerPageNum: { color: '#FFFFFF', fontSize: 8, textAlign: 'center', opacity: 0.6, marginTop: 10 },
});

const fmt = (amount, currency) => {
  const symbols = { USD: '$', NGN: '₦', EUR: '€', GBP: '£' };
  return `${symbols[currency] || currency}${parseFloat(amount).toLocaleString()}`;
};

const LightFooter = ({ page }) => (
  <View style={styles.lightFooter}>
    <Text style={styles.lightFooterText}>SwiftAirline — Booking Confirmation — Page {page} of 4</Text>
  </View>
);

export const BookingPDF = ({ booking: b, qrCodeDataUrl }) => (
  <Document>

    {/* PAGE 1: Itinerary */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.companyName}>SwiftAirline</Text>
        <Text style={styles.headerTitle}>BOOKING CONFIRMED</Text>
        <Text style={styles.headerSubtitle}>Your flight has been successfully booked</Text>
      </View>

      <View style={styles.totalSection}>
        <View>
          <Text style={styles.totalLabel}>Total Amount Paid</Text>
          <Text style={styles.totalAmount}>{fmt(b.totalAmount, b.currency)}</Text>
        </View>
        <Text style={styles.statusBadge}>CONFIRMED</Text>
      </View>

      <Text style={styles.sectionTitle}>Flight Itinerary</Text>
      <View style={styles.flightRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{b.departureTime}</Text>
          <Text style={styles.codeText}>{b.fromCode}</Text>
          <Text style={styles.airportName}>{b.fromAirport}</Text>
          <Text style={styles.airportName}>{b.fromCity}</Text>
        </View>
        <View style={styles.durationBlock}>
          <Text style={styles.durationText}>{b.duration}</Text>
          <View style={styles.durationLine} />
          <Text style={styles.durationText}>{b.stops}</Text>
        </View>
        <View style={[styles.timeBlock, { alignItems: 'flex-end' }]}>
          <Text style={styles.timeText}>{b.arrivalTime}</Text>
          <Text style={styles.codeText}>{b.toCode}</Text>
          <Text style={styles.airportName}>{b.toAirport}</Text>
          <Text style={styles.airportName}>{b.toCity}</Text>
        </View>
      </View>

      <View style={styles.flightMeta}>
        <View style={styles.flightMetaRow}>
          <View><Text style={styles.flightMetaLabel}>Departure Date</Text><Text style={styles.flightMetaValue}>{new Date(b.departureDate).toDateString()}</Text></View>
          <View><Text style={styles.flightMetaLabel}>Arrival Date</Text><Text style={styles.flightMetaValue}>{new Date(b.arrivalDate).toDateString()}</Text></View>
        </View>
        <View style={styles.flightMetaRow}>
          <View><Text style={styles.flightMetaLabel}>Flight Number</Text><Text style={styles.flightMetaValue}>{b.flightNumber}</Text></View>
          <View><Text style={styles.flightMetaLabel}>Airline</Text><Text style={styles.flightMetaValue}>{b.airline}</Text></View>
        </View>
        <View style={styles.flightMetaRow}>
          <View><Text style={styles.flightMetaLabel}>Cabin Class</Text><Text style={styles.flightMetaValue}>{b.cabinClass}</Text></View>
          <View><Text style={styles.flightMetaLabel}>Passengers</Text><Text style={styles.flightMetaValue}>{b.adults} Adult(s){b.children > 0 ? `, ${b.children} Child(ren)` : ''}{b.infants > 0 ? `, ${b.infants} Infant(s)` : ''}</Text></View>
        </View>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Before You Fly</Text>
        <Text style={styles.noteText}>Please arrive at the airport at least 3 hours before departure for international flights. Ensure your travel documents match the passenger details on this confirmation exactly. Check-in counters typically close 60 minutes before departure.</Text>
      </View>

      <LightFooter page={1} />
    </Page>

    {/* PAGE 2: Passenger Info */}
    <Page size="A4" style={styles.page}>
      <View style={styles.miniHeader}>
        <Text style={styles.miniHeaderBrand}>SwiftAirline</Text>
        <Text style={styles.miniHeaderCode}>{b.trackingCode}</Text>
      </View>

      <Text style={styles.sectionTitle}>Passenger & Contact Info</Text>
      <View style={styles.passengerRow}>
        <Text style={styles.passengerName}>{b.passengerTitle}. {b.firstName.toUpperCase()} {b.lastName.toUpperCase()}</Text>
      </View>

      <View style={styles.infoRow}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{b.email}</Text></View>
      <View style={styles.infoRow}><Text style={styles.infoLabel}>Phone</Text><Text style={styles.infoValue}>{b.phone}</Text></View>
      {b.passportNumber && <View style={styles.infoRow}><Text style={styles.infoLabel}>Passport / ID</Text><Text style={styles.infoValue}>{b.passportNumber}</Text></View>}
      {b.nationality && <View style={styles.infoRow}><Text style={styles.infoLabel}>Nationality</Text><Text style={styles.infoValue}>{b.nationality}</Text></View>}
      {b.mealPreference && <View style={styles.infoRow}><Text style={styles.infoLabel}>Meal Preference</Text><Text style={styles.infoValue}>{b.mealPreference}</Text></View>}
      {b.seatPreference && <View style={styles.infoRow}><Text style={styles.infoLabel}>Seat Preference</Text><Text style={styles.infoValue}>{b.seatPreference}</Text></View>}

      {b.specialRequests && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.sectionTitle, { fontSize: 14 }]}>Special Requests</Text>
          <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{b.specialRequests}</Text>
        </View>
      )}

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Passenger Identification</Text>
        <Text style={styles.noteText}>The name on this booking must match the name on the government-issued ID or passport used for travel. Any discrepancies should be corrected with SwiftAirline support prior to departure to avoid denied boarding.</Text>
      </View>

      <LightFooter page={2} />
    </Page>

    {/* PAGE 3: Baggage */}
    <Page size="A4" style={styles.page}>
      <View style={styles.miniHeader}>
        <Text style={styles.miniHeaderBrand}>SwiftAirline</Text>
        <Text style={styles.miniHeaderCode}>{b.trackingCode}</Text>
      </View>

      <Text style={styles.sectionTitle}>Baggage Allowance</Text>

      <View style={styles.baggageRow}>
        <View><Text style={styles.baggageLabel}>Personal Item</Text><Text style={styles.baggageValue}>{b.personalItem}</Text></View>
        <Text style={styles.includedTag}>Included</Text>
      </View>

      <View style={styles.baggageRow}>
        <View><Text style={styles.baggageLabel}>Carry-on Baggage</Text><Text style={styles.baggageValue}>{b.carryOn}</Text></View>
        <Text style={styles.includedTag}>Included</Text>
      </View>

      <View style={styles.baggageRow}>
        <View><Text style={styles.baggageLabel}>Checked Baggage</Text><Text style={styles.baggageValue}>{b.checkedBaggage}</Text></View>
        {b.checkedBaggage.toLowerCase().includes('no free')
          ? <View style={styles.warningTag}><Text style={styles.warningText}>Not Included</Text></View>
          : <Text style={styles.includedTag}>Included</Text>}
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Baggage Policy</Text>
        <Text style={styles.noteText}>Additional baggage allowance can be purchased at the airport counter or through SwiftAirline customer support prior to departure. Items exceeding size or weight limits may incur excess baggage fees, charged at the airport check-in desk.</Text>
      </View>

      <LightFooter page={3} />
    </Page>

    {/* PAGE 4: Price + QR + full brand footer */}
    <Page size="A4" style={styles.page}>
      <View style={styles.miniHeader}>
        <Text style={styles.miniHeaderBrand}>SwiftAirline</Text>
        <Text style={styles.miniHeaderCode}>{b.trackingCode}</Text>
      </View>

      <Text style={styles.sectionTitle}>Price Details</Text>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Ticket Fare × {b.adults + b.children}</Text>
        <Text style={styles.priceValue}>{fmt(b.ticketFare, b.currency)}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Taxes & Fees</Text>
        <Text style={styles.priceValue}>{fmt(b.taxesFees, b.currency)}</Text>
      </View>
      {b.promoCode && (
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: '#16A34A' }]}>Promo Code ({b.promoCode})</Text>
          <Text style={[styles.priceValue, { color: '#16A34A' }]}>-{fmt(b.promoDiscount, b.currency)}</Text>
        </View>
      )}
      <View style={styles.priceTotalRow}>
        <Text style={styles.priceTotalLabel}>Booking Total</Text>
        <Text style={styles.priceTotalValue}>{fmt(b.totalAmount, b.currency)}</Text>
      </View>
      <Text style={{ fontSize: 9, color: '#9CA3AF' }}>Booked on {new Date(b.createdAt).toLocaleString()}</Text>

      <View style={styles.qrSection}>
        <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>Scan to track your booking</Text>
        {qrCodeDataUrl && <Image src={qrCodeDataUrl} style={{ width: 110, height: 110 }} />}
        <Text style={styles.trackingCode}>{b.trackingCode}</Text>
        <Text style={styles.trackingLabel}>Booking Reference / Tracking Code</Text>
        <Text style={{ fontSize: 9, color: '#9CA3AF', marginTop: 8 }}>Visit swiftairline.com/track and enter this code to view your booking anytime</Text>
      </View>

      <View style={styles.fullFooter}>
        <Text style={styles.footerBrand}>SwiftAirline</Text>
        <Text style={styles.footerText}>For support contact: support@swiftairline.com</Text>
        <Text style={styles.footerText}>This is an official booking confirmation. Please present this document at check-in.</Text>
        <Text style={styles.footerPageNum}>Page 4 of 4</Text>
      </View>
    </Page>

  </Document>
);