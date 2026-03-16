import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ambulance, Truck, CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react';

export default function FleetStatusPanel({ fleetData = [] }) {
  const [filter, setFilter] = useState('all');

  const ambulances = fleetData.ambulances || [];

  const filtered = filter === 'all'
    ? ambulances
    : ambulances.filter(a => a.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-600';
      case 'busy': return 'bg-yellow-600';
      case 'maintenance': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} className="text-green-400" />;
      case 'busy': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'maintenance': return <Wrench size={16} className="text-red-400" />;
      default: return <XCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'available', 'busy', 'maintenance'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {status} ({status === 'all' ? ambulances.length : ambulances.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(amb => (
          <motion.div
            key={amb.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(amb.status)} bg-opacity-20`}>
                  <Ambulance className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{amb.vehicle_number || 'N/A'}</h3>
                  <p className="text-xs text-gray-400 capitalize">{amb.vehicle_type || 'N/A'}</p>
                </div>
              </div>
              {getStatusIcon(amb.status)}
            </div>

            {/* Fuel/Oxygen/Driver info */}
            <div className="text-sm space-y-2">
              <p>Fuel: {amb.fuel_level ?? 'N/A'}%</p>
              <p>O₂: {amb.current_oxygen_level ?? 'N/A'}%</p>
              <p>Driver: {amb.driver?.name || 'N/A'}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}