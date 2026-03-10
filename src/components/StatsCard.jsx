import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, color, subtitle, trend }) {
  const isPositive = trend?.includes('+');
  
  const colorClasses = {
    red: 'bg-red-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-2xl p-6 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses[color]} opacity-10 rounded-full -mr-16 -mt-16`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${colorClasses[color]} rounded-xl`}>
          <Icon className="text-white" size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {trend}
          </div>
        )}
      </div>
      
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </motion.div>
  );
}