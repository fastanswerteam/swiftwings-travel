'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import {
  Building2, Plane, TrainFront, Car, Compass, Layers,
  ArrowLeftRight, Loader2, Search, Headphones, Users, UsersRound,
  Map, Lightbulb, MapPin, Star, ShieldCheck, Zap, Ticket, FileDown,
  Globe, MessageCircle, Send, Apple, PlayCircle
} from 'lucide-react';
import SiteSidebar from '@/components/SiteSidebar';
import AppDownloadPopup from '@/components/AppDownloadPopup';

const SUPPORT_EMAIL = ['support', 'swiftairline.com'].join('@');
const SUPPORT_LINK = 'mailto:' + SUPPORT_EMAIL;

const widgetTabs = [
  { key: 'hotels', label: 'Hotels & Homes', icon: Building2 },
  { key: 'flights', label: 'Flights', icon: Plane },
  { key: 'trains', label: 'Trains', icon: TrainFront },
  { key: 'cars', label: 'Cars', icon: Car },
  { key: 'attractions', label: 'Attractions & Tours', icon: Compass },
  { key: 'bundle', label: 'Flight + Hotel', icon: Layers },
];

const mobileIcons = [
  { key: 'hotels', label: 'Hotels & Homes', icon: Building2 },
  { key: 'flights', label: 'Flights', icon: Plane },
  { key: 'bundle', label: 'Flight + Hotel', icon: Layers },
  { key: 'trains', label: 'Trains', icon: TrainFront },
  { key: 'cars', label: 'Cars', icon: Car },
  { key: 'attractions', label: 'Attractions & Tours', icon: Compass },
  { key: 'private', label: 'Private Tours', icon: Users },
  { key: 'inspiration', label: 'Travel Inspiration', icon: Lightbulb },
];

const perks = [
  { title: 'New members save more', cta: 'Sign in for perks', highlight: true },
  { title: '10% off Economy fares', cta: 'Claim now' },
  { title: '5% off Seat Upgrades', cta: 'Claim now' },
  { title: '10% off Airport Transfers', cta: 'Claim now' },
];

const promoBanners = [
  { title: 'GLOBAL FARE SALE', subtitle: 'Up to 40% off select international routes', badge: 'LIMITED TIME', overlay: 'linear-gradient(120deg, rgba(15,23,42,0.55), rgba(43,92,230,0.75))', image: 'https://images.pexels.com/photos/18459049/pexels-photo-18459049.jpeg?auto=compress&cs=tinysrgb&w=1000' },
  { title: 'EXPLORE ASIA', subtitle: 'Special fares to Tokyo, Singapore & beyond', badge: 'SUPER SALE', overlay: 'linear-gradient(120deg, rgba(124,45,18,0.6), rgba(217,119,6,0.75))', image: 'https://images.pexels.com/photos/731217/pexels-photo-731217.jpeg?auto=compress&cs=tinysrgb&w=1000' },
];

const destinations = [
  { id: 'paris', name: 'Paris', tag: 'Short haul', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'tokyo', name: 'Tokyo', tag: 'Medium haul', image: 'https://images.pexels.com/photos/30435802/pexels-photo-30435802.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'dubai', name: 'Dubai', tag: 'Medium haul', image: 'https://images.pexels.com/photos/30441929/pexels-photo-30441929.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'newyork', name: 'New York', tag: 'Long haul', image: 'https://images.pexels.com/photos/29073682/pexels-photo-29073682.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'singapore', name: 'Singapore', tag: 'Long haul', image: 'https://images.pexels.com/photos/32499418/pexels-photo-32499418.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'london', name: 'London', tag: 'Long haul', image: 'https://images.pexels.com/photos/17646452/pexels-photo-17646452.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const sightsByDestination = {
  paris: [
    { name: 'Eiffel Tower', rating: '4.8', reviews: '52,340', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Louvre Museum', rating: '4.7', reviews: '38,210', image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Notre-Dame Cathedral', rating: '4.6', reviews: '29,870', image: 'https://images.pexels.com/photos/17108606/pexels-photo-17108606.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Champs-Élysées', rating: '4.5', reviews: '21,050', image: 'https://images.pexels.com/photos/17176462/pexels-photo-17176462.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ],
  tokyo: [
    { name: 'Shibuya Crossing', rating: '4.7', reviews: '41,900', image: 'https://images.pexels.com/photos/32679764/pexels-photo-32679764.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Senso-ji Temple', rating: '4.8', reviews: '35,600', image: 'https://images.pexels.com/photos/29185658/pexels-photo-29185658.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Tokyo Skytree', rating: '4.6', reviews: '27,340', image: 'https://images.pexels.com/photos/18358668/pexels-photo-18358668.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Meiji Shrine', rating: '4.7', reviews: '19,880', image: 'https://images.pexels.com/photos/31203208/pexels-photo-31203208.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ],
  dubai: [
    { name: 'Burj Khalifa', rating: '4.8', reviews: '61,200', image: 'https://images.pexels.com/photos/30441929/pexels-photo-30441929.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Dubai Mall', rating: '4.6', reviews: '44,730', image: 'https://images.pexels.com/photos/16619091/pexels-photo-16619091.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Palm Jumeirah', rating: '4.7', reviews: '25,410', image: 'https://images.pexels.com/photos/10593605/pexels-photo-10593605.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Dubai Marina', rating: '4.6', reviews: '18,960', image: 'https://images.pexels.com/photos/4624570/pexels-photo-4624570.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ],
  newyork: [
    { name: 'Statue of Liberty', rating: '4.7', reviews: '58,300', image: 'https://images.pexels.com/photos/5857663/pexels-photo-5857663.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Central Park', rating: '4.8', reviews: '49,120', image: 'https://images.pexels.com/photos/14426200/pexels-photo-14426200.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Times Square', rating: '4.5', reviews: '46,870', image: 'https://images.pexels.com/photos/34934277/pexels-photo-34934277.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Empire State Building', rating: '4.7', reviews: '33,540', image: 'https://images.pexels.com/photos/34103768/pexels-photo-34103768.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ],
  singapore: [
    { name: 'Gardens by the Bay', rating: '4.8', reviews: '39,700', image: 'https://images.pexels.com/photos/5987044/pexels-photo-5987044.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Marina Bay Sands', rating: '4.7', reviews: '36,220', image: 'https://images.pexels.com/photos/32499418/pexels-photo-32499418.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Sentosa Island', rating: '4.6', reviews: '28,410', image: 'https://images.pexels.com/photos/11527352/pexels-photo-11527352.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Merlion Park', rating: '4.5', reviews: '17,690', image: 'https://images.pexels.com/photos/1561863/pexels-photo-1561863.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ],
  london: [
    { name: 'Tower of London', rating: '4.7', reviews: '44,560', image: 'https://images.pexels.com/photos/18729270/pexels-photo-18729270.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Tower Bridge', rating: '4.8', reviews: '41,330', image: 'https://images.pexels.com/photos/16169341/pexels-photo-16169341.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'London Eye', rating: '4.6', reviews: '37,210', image: 'https://images.pexels.com/photos/17340759/pexels-photo-17340759.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Buckingham Palace', rating: '4.6', reviews: '29,880', image: 'https://images.pexels.com/photos/16333184/pexels-photo-16333184.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ],
};

const itineraries = [
  { title: '3 Days in Paris', subtitle: 'Under $500 excluding flights', overlay: 'linear-gradient(160deg, rgba(76,29,149,0.35), rgba(76,29,149,0.85))', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: '5 Days in Tokyo', subtitle: 'The perfect first-timer route', overlay: 'linear-gradient(160deg, rgba(127,29,29,0.35), rgba(127,29,29,0.85))', image: 'https://images.pexels.com/photos/32679764/pexels-photo-32679764.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Weekend in Dubai', subtitle: 'Luxury on a budget', overlay: 'linear-gradient(160deg, rgba(146,64,14,0.35), rgba(146,64,14,0.85))', image: 'https://images.pexels.com/photos/30441929/pexels-photo-30441929.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: '4 Days in Singapore', subtitle: 'Food, gardens & skyline', overlay: 'linear-gradient(160deg, rgba(20,83,45,0.35), rgba(20,83,45,0.85))', image: 'https://images.pexels.com/photos/32499418/pexels-photo-32499418.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const routes = [
  { from: 'CDG', to: 'JFK', fromCity: 'Paris', toCity: 'New York', overlay: 'linear-gradient(160deg, rgba(30,58,138,0.4), rgba(15,23,42,0.85))', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { from: 'NRT', to: 'LHR', fromCity: 'Tokyo', toCity: 'London', overlay: 'linear-gradient(160deg, rgba(146,64,14,0.4), rgba(124,45,18,0.85))', image: 'https://images.pexels.com/photos/32679764/pexels-photo-32679764.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { from: 'DXB', to: 'SIN', fromCity: 'Dubai', toCity: 'Singapore', overlay: 'linear-gradient(160deg, rgba(15,23,42,0.4), rgba(51,65,85,0.85))', image: 'https://images.pexels.com/photos/30441929/pexels-photo-30441929.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { from: 'LHR', to: 'JFK', fromCity: 'London', toCity: 'New York', overlay: 'linear-gradient(160deg, rgba(20,83,45,0.4), rgba(21,128,61,0.85))', image: 'https://images.pexels.com/photos/17646452/pexels-photo-17646452.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { from: 'CDG', to: 'NRT', fromCity: 'Paris', toCity: 'Tokyo', overlay: 'linear-gradient(160deg, rgba(76,29,149,0.4), rgba(76,29,149,0.85))', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { from: 'SIN', to: 'DXB', fromCity: 'Singapore', toCity: 'Dubai', overlay: 'linear-gradient(160deg, rgba(127,29,29,0.4), rgba(127,29,29,0.85))', image: 'https://images.pexels.com/photos/32499418/pexels-photo-32499418.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const trust = [
  { icon: ShieldCheck, label: 'Best Fare Guarantee' },
  { icon: Headphones, label: '24/7 Customer Support' },
  { icon: Zap, label: 'Instant Confirmation' },
  { icon: Ticket, label: 'Official PDF Documents' },
];

const seoTabs = {
  'Popular Flight Routes': ['Flights to Paris', 'Flights to Tokyo', 'Flights to Dubai', 'Flights to New York', 'Flights to Singapore', 'Flights to London', 'Flights to Rome', 'Flights to Sydney', 'Flights to Toronto', 'Flights to Cape Town', 'Flights to Bangkok', 'Flights to Istanbul'],
  'Popular Destinations': ['Paris Travel Guide', 'Tokyo Travel Guide', 'Dubai Travel Guide', 'New York Travel Guide', 'Singapore Travel Guide', 'London Travel Guide', 'Rome Travel Guide', 'Sydney Travel Guide'],
  'Airport Guides': ['Charles de Gaulle Airport (CDG)', 'Narita Airport (NRT)', 'Dubai International (DXB)', 'JFK Airport (JFK)', 'Changi Airport (SIN)', 'Heathrow Airport (LHR)'],
  'Travel Guides': ['First-time Flyer Tips', 'Baggage Allowance Explained', 'How to Track Your Booking', 'Choosing the Right Cabin Class', 'International Travel Checklist'],
};

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Home() {
  const router = useRouter();
  const qrRef = useRef(null);
  const destRowRef = useRef(null);
  const sightsRowRef = useRef(null);

  const scrollRow = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTrackPopover, setShowTrackPopover] = useState(false);
  const [trackCode, setTrackCode] = useState('');
  const [trackError, setTrackError] = useState('');

  const [tripType, setTripType] = useState('round');
  const [nonstop, setNonstop] = useState(false);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [searching, setSearching] = useState(false);

  const [activeDestination, setActiveDestination] = useState('paris');
  const [activeSeoTab, setActiveSeoTab] = useState('Popular Flight Routes');

  useEffect(() => {
    if (qrRef.current) {
      QRCode.toCanvas(qrRef.current, window.location.origin, {
        width: 140,
        margin: 1,
        color: { dark: '#2B5CE6', light: '#FFFFFF' },
      }).catch(() => {});
    }
  }, []);

  const handleTabClick = (key) => {
    if (key !== 'flights') router.push('/');
  };

  const swapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackCode.trim()) {
      setTrackError('Enter your booking reference');
      return;
    }
    router.push(`/track/${trackCode.trim().toUpperCase()}`);
  };

  const handleSearchFlights = (e) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      router.push('/');
    }, 1400);
  };

  const inputClass = "px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const activeDestObj = destinations.find((d) => d.id === activeDestination);

  return (
    <div className="flex bg-white">
      <SiteSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 min-w-0">

        {/* TOP NAV */}
        <nav className="absolute top-0 left-0 right-0 z-20 py-5 px-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              SwiftAirline
            </span>

            <div className="flex items-center gap-4 sm:gap-6 relative">
              <a href="#app" className="text-white/80 hover:text-white text-sm hidden sm:inline transition-colors">
                App
              </a>
              <span className="text-white/60 text-sm hidden sm:inline">USD</span>
              <a href={SUPPORT_LINK} className="text-white/80 hover:text-white text-sm hidden md:inline-flex items-center gap-1 transition-colors">
                <Headphones size={15} /> Support
              </a>

              <div className="relative">
                <button
                  onClick={() => setShowTrackPopover(!showTrackPopover)}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Find bookings
                </button>
                <AnimatePresence>
                  {showTrackPopover && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-20 sm:top-auto sm:mt-3 bg-white rounded-xl shadow-xl p-4 sm:w-72 z-50"
                    >
                      <form onSubmit={handleTrackSubmit}>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Enter your booking reference</p>
                        <input
                          value={trackCode}
                          onChange={(e) => { setTrackCode(e.target.value); setTrackError(''); }}
                          placeholder="e.g. SA4147"
                          className={`w-full mb-2 ${inputClass}`}
                        />
                        {trackError && <p className="text-red-500 text-xs mb-2">{trackError}</p>}
                        <button
                          type="submit"
                          style={{ backgroundColor: '#2B5CE6' }}
                          className="w-full py-2 rounded-lg text-white text-sm font-bold"
                        >
                          Track Booking
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a
                href="/admin/login"
                style={{ backgroundColor: '#FFD700' }}
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-gray-900 hover:opacity-90 transition-opacity"
              >
                Staff Login
              </a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 50%, #2B5CE6 100%)' }}>
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1200 700" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M -100 500 Q 400 200 1300 350" stroke="#FFD700" strokeWidth="2" strokeDasharray="8 10" fill="none" />
            <circle cx="750" cy="290" r="4" fill="#FFD700" />
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto px-6 pt-28 pb-6 text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Your next take-off awaits
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Join thousands of travelers · Fly to 100+ destinations · Award-worthy service
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative max-w-4xl mx-auto px-6 pb-12 pt-6"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

              <div className="flex overflow-x-auto border-b border-gray-100">
                {widgetTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className="flex flex-col items-center gap-1 px-6 py-4 text-xs font-semibold whitespace-nowrap transition-colors"
                    style={tab.key === 'flights'
                      ? { color: '#2B5CE6', borderBottom: '3px solid #2B5CE6' }
                      : { color: '#9CA3AF' }}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearchFlights} className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                  {['round', 'one-way', 'multi-city'].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={tripType === type}
                        onChange={() => setTripType(type)}
                        className="accent-blue-600"
                      />
                      {type === 'round' ? 'Round-trip' : type === 'one-way' ? 'One-way' : 'Multi-city'}
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-gray-700 cursor-pointer sm:ml-auto">
                    <input
                      type="checkbox"
                      checked={nonstop}
                      onChange={(e) => setNonstop(e.target.checked)}
                      className="accent-blue-600"
                    />
                    Nonstop
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-2 relative">
                  <input
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="Leaving from"
                    required
                    className={`flex-1 ${inputClass}`}
                  />
                  <motion.button
                    type="button"
                    onClick={swapCities}
                    whileTap={{ rotate: 180 }}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 mx-auto sm:mx-0 self-center transition-colors"
                  >
                    <ArrowLeftRight size={16} />
                  </motion.button>
                  <input
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="Going to"
                    required
                    className={`flex-1 ${inputClass}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    required
                    className={inputClass}
                  />
                  {tripType === 'round' && (
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                      className={inputClass}
                    />
                  )}
                  <div className={`flex ${tripType === 'round' ? '' : 'sm:col-span-2'} gap-2`}>
                    <input
                      type="number"
                      min="1"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className={`w-1/2 ${inputClass}`}
                    />
                    <select
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value)}
                      className={`w-1/2 ${inputClass}`}
                    >
                      <option>Economy</option>
                      <option>Business</option>
                      <option>First Class</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={searching}
                  style={{ backgroundColor: '#2B5CE6' }}
                  className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {searching ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Searching...
                    </>
                  ) : (
                    <>
                      <Search size={18} /> Search Flights
                    </>
                  )}
                </button>

                <a href="/flights/status" className="block text-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Already flying? Track live flight status →
                </a>
              </form>
            </div>

            <div className="md:hidden grid grid-cols-4 gap-4 mt-6">
              {mobileIcons.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleTabClick(item.key)}
                  className="flex flex-col items-center gap-2 text-white"
                >
                  <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center">
                    <item.icon size={18} />
                  </div>
                  <span className="text-[10px] text-center leading-tight opacity-90">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* TRUST STRIP */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={gridContainer}
          className="py-12 px-6"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {trust.map((t) => (
              <motion.div key={t.label} variants={gridItem} className="flex flex-col items-center text-center gap-2">
                <t.icon size={24} style={{ color: '#2B5CE6' }} />
                <p className="text-xs sm:text-sm font-medium text-gray-700">{t.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PERKS */}
        <section className="py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Member perks
            </h2>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={gridContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {perks.map((p) => (
                <motion.button
                  key={p.title}
                  variants={gridItem}
                  onClick={() => router.push('/')}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="text-left p-4 rounded-xl border hover:shadow-lg transition-shadow"
                  style={p.highlight
                    ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#F3F4F6' }}
                >
                  <p className="text-sm font-semibold text-gray-900 mb-3">{p.title}</p>
                  <span
                    style={{ backgroundColor: '#2B5CE6' }}
                    className="inline-block text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                  >
                    {p.cta}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* PROMO BANNERS */}
        <section className="pb-10 px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={gridContainer}
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {promoBanners.map((b) => (
              <motion.div
                key={b.title}
                variants={gridItem}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => router.push('/')}
                className="cursor-pointer rounded-2xl text-white relative overflow-hidden hover:shadow-2xl transition-shadow flex flex-col justify-between"
                style={{
                  backgroundImage: `${b.overlay}, url(${b.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '240px',
                  padding: '28px',
                }}
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold opacity-80">SwiftAirline</p>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#FFD700', color: '#111827' }}>
                    {b.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{b.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{b.subtitle}</p>
                  <span
                    style={{ backgroundColor: '#FFD700', color: '#111827' }}
                    className="inline-block text-sm font-bold px-5 py-2 rounded-lg"
                  >
                    Book Now
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* DESTINATIONS */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Get inspired for your next trip
            </h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">Explore top destinations around the world</p>

            <div className="relative">
              <div
                ref={destRowRef}
                className="flex gap-4 overflow-x-auto pb-3 mb-8 scroll-smooth snap-x snap-mandatory no-scrollbar"
              >
                {destinations.map((d) => (
                  <motion.button
                    key={d.id}
                    onClick={() => setActiveDestination(d.id)}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 snap-start w-44 sm:w-56 h-32 sm:h-40 rounded-2xl relative overflow-hidden text-white text-left shadow-md hover:shadow-xl transition-shadow"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${d.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      outline: activeDestination === d.id ? '3px solid #2B5CE6' : 'none',
                      outlineOffset: '3px',
                    }}
                  >
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <span className="self-start text-[10px] font-bold px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                        {d.tag}
                      </span>
                      <span className="text-lg sm:text-xl font-bold">{d.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => scrollRow(destRowRef, -1)}
                className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md items-center justify-center text-gray-600 hover:text-blue-600 z-10"
              >
                ‹
              </button>
              <button
                onClick={() => scrollRow(destRowRef, 1)}
                className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md items-center justify-center text-gray-600 hover:text-blue-600 z-10"
              >
                ›
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Top sights in {activeDestObj?.name}
            </h3>
            <div className="relative">
              <motion.div
                key={activeDestination}
                ref={sightsRowRef}
                initial="hidden"
                animate="show"
                variants={gridContainer}
                className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
              >
                {(sightsByDestination[activeDestination] || []).map((s) => (
                  <motion.div
                    key={s.name}
                    variants={gridItem}
                    whileHover={{ scale: 1.05, y: -6 }}
                    onClick={() => router.push('/')}
                    className="flex-shrink-0 snap-start w-60 sm:w-72 cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  >
                    <div
                      className="h-40 sm:h-48"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.25)), url(${s.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="p-4">
                      <p className="text-base font-semibold text-gray-900 mb-1 truncate">{s.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star size={13} fill="#FFD700" color="#FFD700" />
                        {s.rating} · {s.reviews} reviews
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <button
                onClick={() => scrollRow(sightsRowRef, -1)}
                className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md items-center justify-center text-gray-600 hover:text-blue-600 z-10"
              >
                ‹
              </button>
              <button
                onClick={() => scrollRow(sightsRowRef, 1)}
                className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md items-center justify-center text-gray-600 hover:text-blue-600 z-10"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* ITINERARIES */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Plan the perfect trip
            </h2>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={gridContainer}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {itineraries.map((it) => (
                <motion.div
                  key={it.title}
                  variants={gridItem}
                  whileHover={{ scale: 1.05, y: -6 }}
                  onClick={() => router.push('/')}
                  className="cursor-pointer rounded-xl p-5 text-white hover:shadow-xl transition-shadow flex flex-col justify-end"
                  style={{
                    backgroundImage: `${it.overlay}, url(${it.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '160px',
                  }}
                >
                  <h3 className="font-bold mb-2">{it.title}</h3>
                  <p className="text-xs opacity-90">{it.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ROUTES */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Popular routes
            </h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">Frequently traveled connections on our network</p>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={gridContainer}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {routes.map((r) => (
                <motion.div
                  key={r.from + r.to}
                  variants={gridItem}
                  whileHover={{ scale: 1.05, y: -6 }}
                  onClick={() => router.push('/')}
                  className="cursor-pointer rounded-2xl p-5 text-white relative overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-end"
                  style={{
                    backgroundImage: `${r.overlay}, url(${r.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '150px',
                  }}
                >
                  <Plane className="absolute right-3 top-3 opacity-70" size={22} />
                  <div className="relative flex items-center gap-2 text-lg sm:text-xl font-bold">
                    <span>{r.from}</span>
                    <span className="opacity-70 text-sm">→</span>
                    <span>{r.to}</span>
                  </div>
                  <p className="relative text-xs opacity-90 mt-1">{r.fromCity} to {r.toCity}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* APP BANNER */}
        <section id="app" className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #2B5CE6, #0F172A)' }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-white text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                Your all-in-one flight companion
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                <div>
                  <p className="text-2xl font-bold">50K+</p>
                  <p className="text-xs text-blue-100">Happy Flyers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">100+</p>
                  <p className="text-xs text-blue-100">Destinations</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-blue-100">Average Rating</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-sm">
                  <Apple size={18} /> iOS — Coming Soon
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-sm">
                  <PlayCircle size={18} /> Android — Coming Soon
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center">
              <canvas ref={qrRef} className="mx-auto" />
              <p className="text-xs text-gray-500 mt-2">Scan to visit SwiftAirline</p>
            </div>
          </div>
        </section>

        {/* SEO LINK HUB */}
        <section className="py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              SwiftAirline recommendations
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(seoTabs).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSeoTab(tab)}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  style={activeSeoTab === tab
                    ? { backgroundColor: '#0F172A', color: '#FFFFFF' }
                    : { backgroundColor: '#F3F4F6', color: '#374151' }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 bg-gray-50 rounded-xl p-6">
              {seoTabs[activeSeoTab].map((link) => (
                <a
                  key={link}
                  href="/"
                  className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ backgroundColor: '#0F172A' }} className="pt-14 pb-8 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 text-sm">
            <div>
              <h4 className="text-white font-bold mb-3">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href={SUPPORT_LINK} className="hover:text-white transition-colors">Customer Support</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Service Guarantee</a></li>
                <li><a href="/" className="hover:text-white transition-colors">More Service Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">About SwiftAirline</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Privacy Statement</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Other Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Rewards Program</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Affiliate Program</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <a href="/" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <Globe size={16} />
                </a>
                <a href="/" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <MessageCircle size={16} />
                </a>
                <a href="/" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <Send size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-white font-bold" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              SwiftAirline
            </span>
            <p className="text-gray-500 text-xs sm:text-sm text-center">© 2026 SwiftAirline. All rights reserved.</p>
          </div>
        </footer>

      </div>
      <AppDownloadPopup />
    </div>
  );
}