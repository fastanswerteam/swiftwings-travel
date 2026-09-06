'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BookingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(async (res) => {
        if (res.status === 401) { router.push('/admin/login'); return; }
        const data = await res.json();
        if (res.ok) setBooking(data.data);
        else setError(data.message || 'Booking not found');
        setLoading(false);
      });
  }, [id]);

  const fmtCurrency = (amount, currency) => {
    const symbols = { USD: '$', NGN: '₦', EUR: '€', GBP: '£' };
    return `${symbols[currency] || currency}${parseFloat(amount).toLocaleString()}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const b = booking;
  const paxCount = b.adults + b.children;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F4FF' }}>
      <div style={{ backgroundColor: '#2B5CE6' }} className="py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/admin/dashboard" className="text-white font-bold">← Back to Dashboard</a>
          <a href={`/api/pdf/${b.id}`} target="_blank"
            style={{ backgroundColor: '#FFD700' }}
            className="px-4 py-2 rounded-lg font-bold text-gray-900 text-sm">
            ⬇ Download PDF
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-4 pb-10 pt-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Total Amount Paid</p>
              <p className="text-3xl font-bold" style={{ color: '#2B5CE6' }}>{fmtCurrency(b.totalAmount, b.currency)}</p>
            </div>
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">✓ {b.status.toUpperCase()}</span>
          </div>

          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">✈ Flight Itinerary</h3>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{b.departureTime}</p>
                <p className="text-xl font-bold" style={{ color: '#2B5CE6' }}>{b.fromCode}</p>
                <p className="text-xs text-gray-500">{b.fromCity}</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-400 mb-1">{b.duration}</p>
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-px bg-gray-300"></div><span>✈</span><div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{b.stops}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{b.arrivalTime}</p>
                <p className="text-xl font-bold" style={{ color: '#2B5CE6' }}>{b.toCode}</p>
                <p className="text-xs text-gray-500">{b.toCity}</p>
              </div>
            </div>
            <div className="mt-4 bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-400">Departure</p><p className="text-sm font-semibold text-gray-800">{new Date(b.departureDate).toDateString()}</p></div>
              <div><p className="text-xs text-gray-400">Arrival</p><p className="text-sm font-semibold text-gray-800">{new Date(b.arrivalDate).toDateString()}</p></div>
              <div><p className="text-xs text-gray-400">Flight Number</p><p className="text-sm font-semibold text-gray-800">{b.flightNumber}</p></div>
              <div><p className="text-xs text-gray-400">Airline</p><p className="text-sm font-semibold text-gray-800">{b.airline}</p></div>
              <div><p className="text-xs text-gray-400">Cabin Class</p><p className="text-sm font-semibold text-gray-800">{b.cabinClass}</p></div>
              <div><p className="text-xs text-gray-400">Passengers</p><p className="text-sm font-semibold text-gray-800">{b.adults} Adult(s){b.children > 0 ? `, ${b.children} Child` : ''}</p></div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">👤 Passenger & Contact Info</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="font-bold text-gray-900 text-lg">{b.passengerTitle}. {b.firstName.toUpperCase()} {b.lastName.toUpperCase()}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-semibold text-gray-800">{b.email}</p></div>
              <div><p className="text-xs text-gray-400">Phone</p><p className="text-sm font-semibold text-gray-800">{b.phone}</p></div>
              {b.passportNumber && <div><p className="text-xs text-gray-400">Passport/ID</p><p className="text-sm font-semibold text-gray-800">{b.passportNumber}</p></div>}
              {b.nationality && <div><p className="text-xs text-gray-400">Nationality</p><p className="text-sm font-semibold text-gray-800">{b.nationality}</p></div>}
            </div>
          </div>

          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">🧳 Baggage Allowance</h3>
            {[
              ['👜 Personal Item', b.personalItem, true],
              ['🧳 Carry-on', b.carryOn, true],
              ['📦 Checked Baggage', b.checkedBaggage, !b.checkedBaggage.toLowerCase().includes('no free')],
            ].map(([label, value, included]) => (
              <div key={label} className="flex justify-between items-start py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-500 mt-1">{value}</p>
                </div>
                {included
                  ? <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">✓ Included</span>
                  : <span className="text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded-full">⚠ Not Included</span>}
              </div>
            ))}
          </div>

          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">💳 Price Details</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Ticket Fare × {paxCount}</span>
                <span className="text-sm font-semibold text-gray-900">{fmtCurrency(b.ticketFare, b.currency)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Taxes & Fees</span>
                <span className="text-sm font-semibold text-gray-900">{fmtCurrency(b.taxesFees, b.currency)}</span>
              </div>
              {b.promoCode && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-green-600">Promo ({b.promoCode})</span>
                  <span className="text-sm font-semibold text-green-600">-{fmtCurrency(b.promoDiscount, b.currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 mt-1">
                <span className="font-bold text-gray-900">Booking Total</span>
                <span className="text-xl font-bold" style={{ color: '#2B5CE6' }}>{fmtCurrency(b.totalAmount, b.currency)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Booked on {new Date(b.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 text-center">
            <p className="text-sm text-gray-500 mb-2">Booking Reference</p>
            <p className="text-2xl font-bold tracking-widest" style={{ color: '#2B5CE6' }}>{b.trackingCode}</p>
          </div>

        </div>
      </div>
    </div>
  );
}