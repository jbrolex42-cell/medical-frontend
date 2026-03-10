import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Navigation, Truck } from 'lucide-react';

export default function EmergencyQueue({ emergencies = [], onManualDispatch, fleet = [] }) {
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const pendingEmergencies = useMemo(
    () => emergencies.filter(e => e.status === 'pending'),
    [emergencies]
  );

  const activeEmergencies = useMemo(
    () => emergencies.filter(e => e.status !== 'pending'),
    [emergencies]
  );

  const availableUnits = useMemo(
    () => fleet.filter(f => f.status === 'available'),
    [fleet]
  );

  const getTriageColor = (category) => {
    const colors = {
      critical: 'border-red-600 bg-red-600/10',
      urgent: 'border-orange-600 bg-orange-600/10',
      moderate: 'border-yellow-600 bg-yellow-600/10',
      minor: 'border-green-600 bg-green-600/10'
    };
    return colors[category] || 'border-gray-600';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);

    if (isNaN(diff)) return '--';
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  const formatCoords = (value) => {
    return typeof value === "number" ? value.toFixed(3) : "--";
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">

      {/* Pending Emergencies */}
      {pendingEmergencies.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Awaiting Dispatch ({pendingEmergencies.length})
          </h4>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {pendingEmergencies.map(emergency => (
                <motion.div
                  key={emergency.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl border-l-4 ${getTriageColor(emergency.triage_category)} bg-gray-800/40 cursor-pointer hover:bg-gray-700/50 transition-colors shadow-sm`}
                  onClick={() =>
                    setSelectedEmergency(
                      selectedEmergency === emergency.id ? null : emergency.id
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">

                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-gray-400">
                          #{String(emergency.id).slice(-4)}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          emergency.triage_category === 'critical'
                            ? 'bg-red-600 text-white'
                            : emergency.triage_category === 'urgent'
                            ? 'bg-orange-600 text-white'
                            : emergency.triage_category === 'moderate'
                            ? 'bg-yellow-600 text-black'
                            : 'bg-green-600 text-white'
                        }`}>
                          {emergency.triage_category}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-100 line-clamp-2 leading-relaxed">
                        {emergency.symptoms}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400">

                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-blue-400" />
                          {formatTime(emergency.created_at)}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-red-400" />
                          {formatCoords(emergency.latitude)}, {formatCoords(emergency.longitude)}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* Dispatch Dropdown */}
                  <AnimatePresence>
                    {selectedEmergency === emergency.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-700/50">

                          <p className="text-[11px] font-semibold text-gray-500 uppercase mb-2">
                            Available Units:
                          </p>

                          <div className="grid grid-cols-2 gap-2">

                            {availableUnits.length > 0 ? (
                              availableUnits.map(unit => (
                                <button
                                  key={unit.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onManualDispatch(emergency.id, unit.id);
                                  }}
                                  className="flex items-center gap-2 p-2 bg-gray-700/60 rounded-lg hover:bg-blue-600 transition-all text-xs group"
                                >
                                  <Truck size={14} className="group-hover:text-white" />
                                  <span className="truncate">
                                    {unit.vehicle_number}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <p className="col-span-2 text-xs italic text-orange-400 py-1">
                                All units currently deployed
                              </p>
                            )}

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Active Emergencies */}
      {activeEmergencies.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            In Progress ({activeEmergencies.length})
          </h4>

          <div className="space-y-2">
            {activeEmergencies.map(emergency => (
              <div
                key={emergency.id}
                className="p-4 rounded-xl bg-gray-800/20 border border-gray-700/50"
              >

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-gray-500">
                    #{String(emergency.id).slice(-4)}
                  </span>

                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase border ${
                    emergency.status === 'en_route'
                      ? 'border-yellow-600 text-yellow-500'
                      : emergency.status === 'arrived_scene'
                      ? 'border-blue-600 text-blue-500'
                      : emergency.status === 'transporting'
                      ? 'border-purple-600 text-purple-500'
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {emergency.status?.replace('_', ' ')}
                  </span>
                </div>

                {emergency.ambulance && (
                  <div className="flex items-center justify-between mt-1">

                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Navigation size={14} className="text-emerald-400" />
                      <span className="font-medium text-xs text-gray-200">
                        {emergency.ambulance.vehicle_number}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400 bg-gray-700/40 px-2 py-0.5 rounded">
                      ETA: <span className="text-emerald-400 font-bold">
                        {emergency.eta_minutes || '?'}m
                      </span>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {emergencies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-700/50">
          <p className="text-sm font-medium">No active or pending calls</p>
          <p className="text-xs mt-1">System is clear</p>
        </div>
      )}

    </div>
  );
}