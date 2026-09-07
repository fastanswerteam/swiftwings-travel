'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Search, Plane, Clock, MapPin, Loader2, ArrowRight } from 'lucide-react';
import SiteSidebar from '@/components/SiteSidebar';
import AppDownloadPopup from '@/components/AppDownloadPopup';

const RouteMap = dynamic(() => import('@/components/RouteMap'), { ssr: false });

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
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function toDateParam(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

function getDuration(dep, arr) {
  if (!dep || !arr) return null;
  const diffMs = new Date(arr) - new Date(dep);
  if (isNaN(diffMs) || diffMs <= 0) return null;
  const h = Math.floor(diffMs / 3600000);
  const m = Math.round((diffMs % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function FlightStatusPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [flightNumber, setFlightNumber] = useState('');
  const [searchedFlight, setSearchedFlight] = useState('');
  const [dayOffset, setDayOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flight, setFlight] = useState(null);
  const [coords, setCoords] = useState(null);

  const runSearch = async (flightNo, offset) => {
    if (!flightNo.trim()) {
      setError('Enter a flight number to search');
      return;
    }

    if (offset !== 0) {
      setFlight(null);
      setError('Historical and future flight data requires a premium plan on our data provider. Showing live data is only available for today — check back on the day of travel for the most accurate status.');
      return;
    }

    setLoading(true);
    setError('');
    setFlight(null);
    setCoords(null);

    try {
      const res = await fetch(`/api/flight-status?flight=${encodeURIComponent(flightNo.trim())}`);
      const json = await res.json();
      if (res.ok) {
        setFlight(json.data);
        const depIata = json.data.departure?.iata;
        const arrIata = json.data.arrival?.iata;
        if (depIata && arrIata) {
          fetch(`/api/airport-coords?dep=${depIata}&arr=${arrIata}`)
            .then((r) => r.json())
            .then((c) => { if (c.success) setCoords(c); })
            .catch(() => {});
        }
      } else {
        setError(json.message || 'Flight not found');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedFlight(flightNumber);
    setDayOffset(0);
    runSearch(flightNumber, 0);
  };

  const handleDayChange = (offset) => {
    setDayOffset(offset);
    if (searchedFlight) runSearch(searchedFlight, offset);
  };

  const status = flight ? (statusStyles[flight.flight_status] || statusStyles.scheduled) : null;
  const duration = flight ? getDuration(flight.departure?.scheduled, flight.arrival?.scheduled) : null;
  const depCode = flight?.departure?.iata || '---';
  const arrCode = flight?.arrival?.iata || '---';
  const depCity = flight?.departure?.airport || 'the departure city';
  const arrCity = flight?.arrival?.airport || 'the arrival city';
  const airlineName = flight?.airline?.name || 'the airline';
  const flightCode = flight?.flight?.iata || searchedFlight.toUpperCase();

  const faqs = flight ? [
    {
      q: `What is the current status of flight ${flightCode}?`,
      a: `Flight ${flightCode} is currently ${status.label.toLowerCase()}. Scheduled departure is ${formatTime(flight.departure?.scheduled)} from ${depCode}, arriving ${formatTime(flight.arrival?.scheduled)} at ${arrCode}.`,
    },
    {
      q: `What route does flight ${flightCode} fly?`,
      a: `Flight ${flightCode} is operated by ${airlineName} from ${depCity} (${depCode}) to ${arrCity} (${arrCode}).${duration ? ` Typical flight time is about ${duration}.` : ''}`,
    },
    {
      q: `What gate does flight ${flightCode} depart from?`,
      a: flight.departure?.gate
        ? `Flight ${flightCode} is scheduled to depart from gate ${flight.departure.gate}${flight.departure?.terminal ? `, terminal ${flight.departure.terminal}` : ''}. Always confirm with airport screens before heading to your gate.`
        : `Gate information for flight ${flightCode} has not been published yet. Check airport screens closer to departure.`,
    },
  ] : [];

  const inputClass = "px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

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
                className={`flex-1 ${inputClass}`}
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

          {searchedFlight && (
            <div className="bg-white rounded-2xl shadow-lg p-2 flex mb-4 gap-2">
              {[-1, 0, 1].map((offset) => (
                <button
                  key={offset}
                  onClick={() => handleDayChange(offset)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
                  style={dayOffset === offset
                    ? { backgroundColor: '#2B5CE6', color: '#FFFFFF' }
                    : { backgroundColor: 'transparent', color: '#6B7280' }}
                >
                  {offset === 0 ? 'Today' : offset === -1 ? 'Yesterday' : 'Tomorrow'}
                  <br />
                  <span className="text-xs font-normal opacity-80">{formatDateLabel(offset)}</span>
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-12 text-center"
              >
                <Loader2 size={28} className="animate-spin mx-auto text-blue-600" />
              </motion.div>
            )}

            {!loading && error && (
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

            {!loading && flight && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">{airlineName}</p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{flightCode} Flight Status</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Based on real-time data, flight {flightCode} operated by {airlineName} is scheduled to fly
                      from {depCity} ({depCode}) to {arrCity} ({arrCode}). The flight is expected to depart at{' '}
                      {formatTime(flight.departure?.scheduled)} and land at {formatTime(flight.arrival?.scheduled)}.
                    </p>
                  </div>

                  <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">Flight Status</span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>

                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-2xl font-bold text-gray-900">{formatTime(flight.departure?.scheduled)}</p>
                        <p className="text-lg font-bold" style={{ color: '#2B5CE6' }}>{depCode}</p>
                        <p className="text-xs text-gray-500 mt-1">{depCity}</p>
                      </div>
                      <div className="flex-1 text-center px-4">
                        {duration && <p className="text-xs text-gray-400 mb-1">{duration}</p>}
                        <div className="flex items-center gap-1">
                          <div className="flex-1 h-px bg-gray-300" />
                          <Plane size={14} style={{ color: '#2B5CE6' }} />
                          <div className="flex-1 h-px bg-gray-300" />
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-2xl font-bold text-gray-900">{formatTime(flight.arrival?.scheduled)}</p>
                        <p className="text-lg font-bold" style={{ color: '#2B5CE6' }}>{arrCode}</p>
                        <p className="text-xs text-gray-500 mt-1">{arrCity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-2 gap-5 bg-gray-50">
                    <div>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={13} /> Terminal</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{flight.departure?.terminal || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={13} /> Boarding Gate</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{flight.departure?.gate || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Arrival Gate</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{flight.arrival?.gate || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Baggage Claim</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{flight.arrival?.baggage || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Departure Delay</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {flight.departure?.delay ? `${flight.departure.delay} min` : 'On time'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Aircraft Registration</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{flight.aircraft?.registration || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                {coords && (coords.departure || coords.arrival) && (
                  <RouteMap departure={coords.departure} arrival={coords.arrival} />
                )}

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqs.map((f) => (
                      <div key={f.q} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <p className="text-sm font-semibold text-gray-800 mb-1">{f.q}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="/"
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors py-2"
                >
                  Search flights on SwiftAirline <ArrowRight size={14} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AppDownloadPopup />
    </div>
  );
}