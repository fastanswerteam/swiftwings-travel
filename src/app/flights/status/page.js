'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plane, Clock, MapPin, Loader2 } from 'lucide-react';
import SiteSidebar from '@/components/SiteSidebar';
import AppDownloadPopup from '@/components/AppDownloadPopup';

const statusStyles = {
  scheduled: { label: 'Scheduled', bg: '#EFF6FF', color: '#2B5CE6' },
  active: { label: 'In the Air', bg: '#DCFCE7', color: '#16A34A' },
  landed: { label: 'Landed', bg: '#F3F4F6', color: '#374151' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', color: '#DC2626' },
  incident: { label: 'Incident', bg: '#FEE2E2', color: '#DC2626' },
  diverted: { label: 'Diverted', bg: '#FEF3C7', color: '#D97706' },
};

function formatTime(iso) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toDateString();
}

function getDuration(dep, arr) {
  if (!dep || !arr) return '—';
  const diffMs = new Date(arr) - new Date(dep);
  if (isNaN(diffMs) || diffMs <= 0) return '—';
  const h = Math.floor(diffMs / 3600000);
  const m = Math.round((diffMs % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function FlightStatusPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flight, setFlight] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!flightNumber.trim()) {
      setError('Enter a flight number to search');
      return;
    }
    setLoading(true);
    setError('');
    setFlight(null);

    try {
      const res = await fetch(`/api/flight-status?flight=${encodeURIComponent(flightNumber.trim())}`);
      const json = await res.json();
      if (res.ok) {
        setFlight(json.data);
      } else {
        setError(json.message || 'Flight not found');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const status = flight ? (statusStyles[flight.flight_status] || statusStyles.scheduled) : null;

  return (
    <div className="flex bg-white min-h-screen">
      <SiteSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 min-w-0">
        <div style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 50%, #2B5CE6 100%)' }} className="px-6 pt-10 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Live Flight Status</h1>
            <p className="text-blue-100 text-sm sm:text-base mb-8">
              Track any airline flight in real time by flight number
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
              <input
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="e.g. LH4147"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#2B5CE6' }}
                className="px-8 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                Track
              </button>
            </form>
            <p className="text-xs text-blue-200 mt-3">
              Try a real airline flight number, e.g. LH4147 or BA117
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 -mt-6 pb-16">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="text-4xl mb-3">✈️</div>
                <h2 className="font-bold text-gray-900 mb-1">No results</h2>
                <p className="text-gray-500 text-sm">{error}</p>
              </motion.div>
            )}

            {flight && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6 flex items-center justify-between border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">{flight.airline?.name || 'Unknown Airline'}</p>
                    <p className="text-2xl font-bold text-gray-900">{flight.flight?.iata || flightNumber.toUpperCase()}</p>
                  </div>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-bold"
                    style={{ backgroundColor: status.bg, color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-2xl font-bold text-gray-900">{formatTime(flight.departure?.scheduled)}</p>
                      <p className="text-lg font-bold" style={{ color: '#2B5CE6' }}>{flight.departure?.iata || '---'}</p>
                      <p className="text-xs text-gray-500 mt-1">{flight.departure?.airport || 'Unknown Airport'}</p>
                    </div>
                    <div className="flex-1 text-center px-4">
                      <p className="text-xs text-gray-400 mb-1">
                        {getDuration(flight.departure?.scheduled, flight.arrival?.scheduled)}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-px bg-gray-300" />
                        <Plane size={14} style={{ color: '#2B5CE6' }} />
                        <div className="flex-1 h-px bg-gray-300" />
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-2xl font-bold text-gray-900">{formatTime(flight.arrival?.scheduled)}</p>
                      <p className="text-lg font-bold" style={{ color: '#2B5CE6' }}>{flight.arrival?.iata || '---'}</p>
                      <p className="text-xs text-gray-500 mt-1">{flight.arrival?.airport || 'Unknown Airport'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Flight Date</p>
                      <p className="text-sm font-semibold text-gray-800">{formatDate(flight.flight_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Terminal / Gate</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {flight.departure?.terminal || '—'} / {flight.departure?.gate || '—'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Aircraft</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {flight.aircraft?.registration || 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Delay</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {flight.departure?.delay ? `${flight.departure.delay} min` : 'On time'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AppDownloadPopup />
    </div>
  );
}