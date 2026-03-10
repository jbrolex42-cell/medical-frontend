import React from 'react';
import { motion } from 'framer-motion';
import { Ambulance, Heart, Activity, Clock } from 'lucide-react';

// Full Page Loader
export const FullPageLoader = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <div className="relative w-24 h-24 mx-auto mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border-4 border-red-200 border-t-red-600 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Ambulance className="text-red-600" size={32} />
        </div>
      </div>
      <p className="text-gray-600 font-medium animate-pulse">{message}</p>
    </motion.div>
  </div>
);

// Skeleton Loader for Cards
export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid gap-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl overflow-hidden">
    <div className="h-12 bg-gray-100" />
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-16 border-b border-gray-100 animate-pulse">
        <div className="flex items-center gap-4 h-full px-4">
          <div className="h-4 bg-gray-200 rounded w-1/6" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
        </div>
      </div>
    ))}
  </div>
);

// Button Loader
export const ButtonLoader = () => (
  <div className="flex items-center gap-2">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
    />
    <span>Processing...</span>
  </div>
);

// Stats Loader
export const StatsLoader = () => (
  <div className="grid grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
    ))}
  </div>
);

// Map Loader
export const MapLoader = () => (
  <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Activity className="text-gray-400 mx-auto mb-4" size={48} />
      </motion.div>
      <p className="text-gray-500">Loading map...</p>
    </div>
  </div>
);

// Mini Pulse Loader (inline)
export const PulseLoader = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
        className={`${sizes[size]} bg-red-600 rounded-full`}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        className={`${sizes[size]} bg-red-600 rounded-full`}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        className={`${sizes[size]} bg-red-600 rounded-full`}
      />
    </div>
  );
};

export default FullPageLoader;