'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBooking() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [fare, setFare] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [currency, setCurrency] = useState('USD');

  const total = (parseFloat(fare) || 0) + (parseFloat(taxes) || 0) - (parseFloat(discount) || 0);

  const fmtCurrency = (amount, curr) => {
    const symbols = { USD: '$', NGN: '₦', EUR: '€', GBP: '£' };
    return `${symbols[curr] || curr}${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    data.totalAmount = total;

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (res.ok) {
      setResult(json.data);
      form.reset();
      setFare(0); setTaxes(0); setDiscount(0);
    } else {
      setError(json.message || 'Failed to create booking');
    }
    setSubmitting(false);
  };

  const inputClass = "border border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ backgroundColor: '#2B5CE6' }} className="py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">✈ New Booking</h1>
          <a href="/admin/dashboard" className="text-white opacity-80 hover:opacity-100 text-sm">← Back to Dashboard</a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">👤 Passenger Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="passengerTitle" className={inputClass}>
                <option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option>
              </select>
              <input name="firstName" placeholder="First Name" required className={inputClass} />
              <input name="lastName" placeholder="Last Name" required className={inputClass} />
              <input name="email" type="email" placeholder="Email" required className={inputClass} />
              <input name="phone" placeholder="Phone" required className={inputClass} />
              <input name="passportNumber" placeholder="Passport / ID (optional)" className={inputClass} />
              <input name="nationality" placeholder="Nationality (optional)" className={inputClass} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">✈ Flight Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="fromCity" placeholder="From City" required className={inputClass} />
              <input name="fromCode" placeholder="From Code (e.g. LOS)" required className={`${inputClass} uppercase`} />
              <input name="fromAirport" placeholder="From Airport Name" required className={inputClass} />
              <input name="toCity" placeholder="To City" required className={inputClass} />
              <input name="toCode" placeholder="To Code (e.g. LHR)" required className={`${inputClass} uppercase`} />
              <input name="toAirport" placeholder="To Airport Name" required className={inputClass} />
              <div><label className="text-xs text-gray-500">Departure Date</label><input name="departureDate" type="date" required className={`w-full ${inputClass}`} /></div>
              <div><label className="text-xs text-gray-500">Departure Time</label><input name="departureTime" type="time" required className={`w-full ${inputClass}`} /></div>
              <div><label className="text-xs text-gray-500">Arrival Date</label><input name="arrivalDate" type="date" required className={`w-full ${inputClass}`} /></div>
              <div><label className="text-xs text-gray-500">Arrival Time</label><input name="arrivalTime" type="time" required className={`w-full ${inputClass}`} /></div>
              <input name="flightNumber" placeholder="Flight Number" required className={inputClass} />
              <input name="airline" placeholder="Airline" defaultValue="SwiftAirline" required className={inputClass} />
              <input name="duration" placeholder="Duration (e.g. 6h 45m)" required className={inputClass} />
              <select name="cabinClass" className={inputClass}>
                <option>Economy</option><option>Business</option><option>First Class</option>
              </select>
              <select name="stops" className={inputClass}>
                <option>Direct</option><option>1 Stop</option><option>2 Stops</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">👥 Passengers</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-xs text-gray-500">Adults</label><input name="adults" type="number" min="1" defaultValue="1" className={`w-full ${inputClass}`} /></div>
              <div><label className="text-xs text-gray-500">Children</label><input name="children" type="number" min="0" defaultValue="0" className={`w-full ${inputClass}`} /></div>
              <div><label className="text-xs text-gray-500">Infants</label><input name="infants" type="number" min="0" defaultValue="0" className={`w-full ${inputClass}`} /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">🧳 Baggage</h3>
            <div className="grid grid-cols-1 gap-3">
              <input name="personalItem" defaultValue="1 personal item (40x30x15cm, max 5kg)" className={inputClass} />
              <input name="carryOn" defaultValue="1 carry-on bag (55x40x20cm, max 10kg)" className={inputClass} />
              <input name="checkedBaggage" defaultValue="No free checked baggage" className={inputClass} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">💳 Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
                <option>USD</option><option>NGN</option><option>EUR</option><option>GBP</option>
              </select>
              <div>
                <label className="text-xs text-gray-500">Ticket Fare</label>
                <input name="ticketFare" type="number" step="0.01" value={fare} onChange={(e) => setFare(e.target.value)} required className={`w-full ${inputClass}`} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Taxes & Fees</label>
                <input name="taxesFees" type="number" step="0.01" value={taxes} onChange={(e) => setTaxes(e.target.value)} required className={`w-full ${inputClass}`} />
              </div>
              <input name="promoCode" placeholder="Promo Code (optional)" className={inputClass} />
              <div>
                <label className="text-xs text-gray-500">Promo Discount</label>
                <input name="promoDiscount" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} className={`w-full ${inputClass}`} />
              </div>
              <div className="flex flex-col justify-end">
                <label className="text-xs text-gray-500">Total Amount</label>
                <div className="text-xl font-bold py-2" style={{ color: '#2B5CE6' }}>{fmtCurrency(total, currency)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">📝 Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input name="mealPreference" placeholder="Meal Preference (optional)" className={inputClass} />
              <select name="seatPreference" className={inputClass}>
                <option value="">Seat: No Preference</option><option>Window</option><option>Aisle</option>
              </select>
            </div>
            <textarea name="specialRequests" placeholder="Special Requests (optional)" rows="3" className={`w-full ${inputClass}`} />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <button type="submit" disabled={submitting}
            style={{ backgroundColor: '#2B5CE6' }}
            className="w-full py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Booking'}
          </button>
        </form>

        {result && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 mb-4">Tracking Code</p>
              <p className="text-2xl font-bold tracking-widest mb-6" style={{ color: '#2B5CE6' }}>{result.trackingCode}</p>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => navigator.clipboard.writeText(result.trackingCode)}
                  className="py-2 rounded-lg border border-gray-200 font-medium text-sm text-gray-700">
                  📋 Copy Tracking Code
                </button>
                <button onClick={() => router.push(`/admin/bookings/${result.id}`)}
                  style={{ backgroundColor: '#2B5CE6' }}
                  className="py-2 rounded-lg text-white font-medium text-sm">
                  View Booking
                </button>
                <button onClick={() => setResult(null)} className="py-2 rounded-lg text-sm text-gray-500">
                  + Create Another Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}