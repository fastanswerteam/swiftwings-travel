'use client';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Building2, Plane, TrainFront, Car, Compass, Layers, Users, UsersRound, Map, Lightbulb, MapPin } from 'lucide-react';

const primaryItems = [
  { key: 'hotels', label: 'Hotels & Homes', icon: Building2 },
  { key: 'flights', label: 'Flights', icon: Plane },
  { key: 'trains', label: 'Trains', icon: TrainFront },
  { key: 'cars', label: 'Cars', icon: Car },
  { key: 'attractions', label: 'Attractions & Tours', icon: Compass },
  { key: 'bundle', label: 'Flight + Hotel', icon: Layers },
];

const secondaryItems = [
  { key: 'private', label: 'Private Tours', icon: Users },
  { key: 'group', label: 'Group Tours', icon: UsersRound },
  { key: 'planner', label: 'Trip Planner', icon: Map, badge: 'New' },
  { key: 'inspiration', label: 'Travel Inspiration', icon: Lightbulb },
  { key: 'map', label: 'Map', icon: MapPin },
];

export default function SiteSidebar({ open, onToggle }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (key) => {
    if (key === 'flights' && pathname === '/') return;
    router.push('/');
  };

  return (
    <motion.aside
      animate={{ width: open ? 220 : 72 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="hidden md:flex flex-col bg-white border-r border-gray-100 h-screen sticky top-0 py-4 overflow-hidden z-30 flex-shrink-0"
    >
      <button
        onClick={onToggle}
        aria-label={open ? 'Collapse menu' : 'Expand menu'}
        className="flex items-center gap-3 px-5 py-3 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Menu size={20} />
      </button>

      <nav className="flex-1 flex flex-col gap-1 mt-2">
        {primaryItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleClick(item.key)}
            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            style={item.key === 'flights' ? { color: '#2B5CE6' } : {}}
          >
            <item.icon size={20} />
            <AnimatePresence>
              {open && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}

        <div className="my-3 border-t border-gray-100 mx-5" />

        {secondaryItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleClick(item.key)}
            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <item.icon size={20} />
            <AnimatePresence>
              {open && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  {item.label}
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                      {item.badge}
                    </span>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}