// frontend-react/src/components/DroneDispatch.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Package, MapPin, Battery, Wind, Clock, CheckCircle } from 'lucide-react';

export default function DroneDispatch() {
  const [drones, setDrones] = useState([
    { id: 'DRN-001', status: 'available', battery: 95, location: 'Base A', cargo: null },
    { id: 'DRN-002', status: 'delivering', battery: 67, location: 'En Route', cargo: 'Oxygen', eta: '4 min' },
    { id: 'DRN-003', status: 'returning', battery: 45, location: 'Returning', cargo: null }
  ]);

  const [activeMissions, setActiveMissions] = useState([
    {
      id: 1,
      droneId: 'DRN-002',
      type: 'medical_supply',
      destination: 'Rural Clinic #4',
      cargo: 'Oxygen Cylinder (Type B)',
      priority: 'critical',
      progress: 65,
      coordinates: { lat: -1.3500, lng: 36.7500 }
    }
  ]);

  const requestDrone = (type) => {
    // API call to dispatch drone
    console.log('Requesting drone for:', type);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Plane className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Emergency Drone Fleet</h3>
            <p className="text-gray-500 text-sm">Autonomous medical supply delivery</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {drones.filter(d => d.status === 'available').length} Available
          </span>
        </div>
      </div>

      {/* Active Missions */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Clock size={18} />
          Active Missions
        </h4>
        <div className="space-y-3">
          {activeMissions.map(mission => (
            <motion.div
              key={mission.id}
              className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Plane className="text-blue-600" size={18} />
                    <span className="font-bold">{mission.droneId}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      mission.priority === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {mission.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">To: {mission.destination}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{mission.progress}%</p>
                  <p className="text-xs text-gray-500">Complete</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mission.progress}%` }}
                  className="bg-blue-500 h-full"
                />
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Package size={14} />
                  {mission.cargo}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {mission.coordinates.lat.toFixed(4)}, {mission.coordinates.lng.toFixed(4)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drone Fleet Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {drones.map(drone => (
          <div 
            key={drone.id}
            className={`p-4 rounded-xl border-2 ${
              drone.status === 'available' ? 'border-green-500 bg-green-50' :
              drone.status === 'delivering' ? 'border-blue-500 bg-blue-50' :
              'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">{drone.id}</span>
              <div className={`w-2 h-2 rounded-full ${
                drone.status === 'available' ? 'bg-green-500' :
                drone.status === 'delivering' ? 'bg-blue-500 animate-pulse' :
                'bg-gray-400'
              }`} />
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <Battery size={12} />
              {drone.battery}%
            </div>
            <p className="text-xs font-medium capitalize">{drone.status}</p>
            {drone.cargo && <p className="text-xs text-gray-500 mt-1">Cargo: {drone.cargo}</p>}
          </div>
        ))}
      </div>

      {/* Quick Dispatch Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => requestDrone('blood')}
          className="p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl transition flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <span className="font-bold text-red-700">Dispatch Blood</span>
          <span className="text-xs text-red-600">O- Negative Priority</span>
        </button>
        
        <button
          onClick={() => requestDrone('oxygen')}
          className="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Wind className="text-white" size={24} />
          </div>
          <span className="font-bold text-blue-700">Dispatch Oxygen</span>
          <span className="text-xs text-blue-600">Emergency Cylinder</span>
        </button>
        
        <button
          onClick={() => requestDrone('meds')}
          className="p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <span className="font-bold text-green-700">Dispatch Medication</span>
          <span className="text-xs text-green-600">Critical Supplies</span>
        </button>
        
        <button
          onClick={() => requestDrone('aed')}
          className="p-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-xl transition flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <CheckCircle className="text-white" size={24} />
          </div>
          <span className="font-bold text-yellow-700">Dispatch AED</span>
          <span className="text-xs text-yellow-600">Defibrillator</span>
        </button>
      </div>
    </div>
  );
}