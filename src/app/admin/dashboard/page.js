'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings');
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    const data = await res.json();
    setBookings(data.data || []);
    setLoading(false);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const filtered = bookings.filter(b =>
    b.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
    b.firstName.toLowerCase().includes(search.toLowerCase()) ||
    b.lastName.toLowerCase().includes(search.toLowerCase()) ||
    b.fromCity.toLowerCase().includes(search.toLowerCase()) ||
    b.toCity.toLowerCase().includes(search.toLowerCase())
  );

  const fmtCurrency = (amount, currency) => {
    const symbols = { USD: '$', NGN: '₦', EUR: '€', GBP: '£' };
    return `${symbols[currency] || currency}${parseFloat(amount).toLocaleString()}`;
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: '🎫' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: '✅' },
    { label: 'This Month', value: bookings.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length, icon: '📅' },
    { label: 'Total Revenue', value: fmtCurrency(bookings.reduce((sum, b) => sum + parseFloat(b.totalAmount), 0), 'USD'), icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ backgroundColor: '#2B5CE6' }} className="py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">✈ SwiftAirline Admin</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/bookings/new"
              style={{ backgroundColor: '#FFD700' }}
              className="px-4 py-2 rounded-lg font-bold text-gray-900 text-sm">
              + New Booking
            </Link>
            <button onClick={logout} className="text-white opacity-70 hover:opacity-100 text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-bold text-gray-900">All Bookings</h2>
            <input
              type="text"
              placeholder="Search by name, code, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading bookings...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Tracking Code', 'Passenger', 'Route', 'Date', 'Class', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => (
                    <tr key={booking.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-bold" style={{ color: '#2B5CE6' }}>{booking.trackingCode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{booking.firstName} {booking.lastName}</p>
                        <p className="text-xs text-gray-400">{booking.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{booking.fromCode} → {booking.toCode}</p>
                        <p className="text-xs text-gray-400">{booking.fromCity} to {booking.toCity}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(booking.departureDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{booking.cabinClass}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-sm" style={{ color: '#2B5CE6' }}>{fmtCurrency(booking.totalAmount, booking.currency)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{booking.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/admin/bookings/${booking.id}`}
                            className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                            style={{ backgroundColor: '#2B5CE6' }}>
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}