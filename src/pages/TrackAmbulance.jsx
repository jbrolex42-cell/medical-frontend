import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Clock, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// ✅ Fixed: default import
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';
import MapComponent from '../components/MapComponent';

export default function TrackAmbulance() {
  const { emergencyId } = useParams();
  const [ambulanceLocation, setAmbulanceLocation] = useState(null);
  const [eta, setEta] = useState(null);
  
  const { data: emergency, refetch } = useQuery({
    queryKey: ['emergency', emergencyId],
    queryFn: () => api.get(`/emergency/${emergencyId}/track`).then(r => r.data),
    refetchInterval: 5000
  });

  const socket = useSocket();

  useEffect(() => {
    if (socket && emergency?.assigned_ambulance_id) {
      socket.emit('tracking:subscribe', { ambulanceId: emergency.assigned_ambulance_id });
      
      socket.on('ambulance:moved', (data) => {
        setAmbulanceLocation({ lng: data.longitude, lat: data.latitude });
        setEta(data.eta);
      });
      
      socket.on('emergency:status', (data) => {
        refetch();
      });
    }
    
    return () => {
      socket?.off('ambulance:moved');
      socket?.off('emergency:status');
    };
  }, [socket, emergency, refetch]);

  const getStatusMessage = (status) => {
    const messages = {
      dispatched: 'Ambulance assigned and preparing to depart',
      en_route: 'Ambulance is on the way to you',
      arrived_scene: 'Ambulance has arrived at your location',
      transporting: 'Transporting to hospital',
      arrived_hospital: 'Arrived at hospital'
    };
    return messages[status] || 'Processing your request...';
  };

  if (!emergency) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Emergency #{emergencyId}</h1>
            <p className="text-gray-400 text-sm">{getStatusMessage(emergency.status)}</p>
          </div>
          <div className="bg-red-600 px-4 py-2 rounded-full">
            <span className="font-bold">{emergency.triage_category}</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-96 relative">
        <MapComponent
          center={[emergency.longitude, emergency.latitude]}
          zoom={14}
          markers={[
            { lng: emergency.longitude, lat: emergency.latitude, type: 'patient' },
            ...(ambulanceLocation ? [{ lng: ambulanceLocation.lng, lat: ambulanceLocation.lat, type: 'ambulance' }] : [])
          ]}
          route={ambulanceLocation ? [ambulanceLocation, { lng: emergency.longitude, lat: emergency.latitude }] : null}
        />
        
        {/* ETA Overlay */}
        {eta && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 left-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Clock className="text-red-600" />
              <div>
                <p className="text-xs text-gray-600">Estimated Arrival</p>
                <p className="font-bold text-lg">{eta} mins</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Responder Info */}
      <div className="p-4 space-y-4">
        {emergency.ambulance && (
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{emergency.ambulance.driver?.name || 'EMT Team'}</h3>
                <p className="text-gray-400 text-sm">Ambulance {emergency.ambulance.vehicle_number}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">{emergency.ambulance.vehicle_type}</span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">Oxygen: {emergency.ambulance.current_oxygen_level}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <a 
            href={`tel:${emergency.ambulance?.driver?.phone || '911'}`}
            className="bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition"
          >
            <Phone /> Call EMT
          </a>
          <button className="bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
            <MessageSquare /> Chat
          </button>
        </div>

        {/* Status Timeline */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-4">Status Updates</h3>
          <div className="space-y-3">
            {['pending', 'dispatched', 'en_route', 'arrived_scene', 'transporting', 'arrived_hospital'].map((status, idx) => {
              const isActive = ['pending', 'dispatched', 'en_route', 'arrived_scene', 'transporting', 'arrived_hospital'].indexOf(emergency.status) >= idx;
              const isCurrent = emergency.status === status;
              
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isActive ? (isCurrent ? 'bg-red-600 animate-pulse' : 'bg-green-500') : 'bg-gray-600'}`} />
                  <span className={`capitalize ${isCurrent ? 'font-bold text-white' : 'text-gray-400'}`}>
                    {status.replace('_', ' ')}
                  </span>
                  {isCurrent && <span className="text-xs text-gray-500 ml-auto">Now</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}