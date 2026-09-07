'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Apple, PlayCircle } from 'lucide-react';

export default function AppDownloadPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-2xl shadow-2xl p-5 z-50 border border-gray-100"
        >
          <button
            onClick={() => setShow(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          >
            <X size={18} />
          </button>
          <p className="text-xs font-bold text-blue-600 mb-1">SwiftAirline App</p>
          <h4 className="font-bold text-gray-900 mb-2">Track flights on the go</h4>
          <p className="text-xs text-gray-500 mb-4">
            Real-time status updates, easy booking management, and exclusive app-only offers.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-1 bg-gray-900 text-white text-xs font-medium py-2 rounded-lg">
              <Apple size={14} /> iOS App
            </div>
            <div className="flex-1 flex items-center justify-center gap-1 bg-gray-900 text-white text-xs font-medium py-2 rounded-lg">
              <PlayCircle size={14} /> Android App
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}