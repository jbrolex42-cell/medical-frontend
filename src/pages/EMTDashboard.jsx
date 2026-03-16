import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ambulance, MapPin, Navigation, Phone, Clock, 
  CheckCircle2, AlertCircle, User, Heart, Activity,
  ChevronRight, Menu, X, LogOut, Bell, Settings,
  FileText, Camera, Mic, Send, Map, Route
       } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { useAuthStore } from '../stores/authStore';

export default function EMTDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const socket = useSocket();
  
  const [activeTab, setActiveTab] = useState('dispatch');
  const [currentEmergency, setCurrentEmergency] = useState(null);
  const [location, setLocation] = useState(null);
  const [vitals, setVitals] = useState({
    bp_systolic: '',
    bp_diastolic: '',
    pulse: '',
    spo2: '',
    temperature: '',
    gcs: ''
  });
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulate incoming dispatch
  useEffect(() => {
    const mockEmergency = {
      id: 'EMR-2024-001847',
      type: 'Heart Attack',
      severity: 'critical',
      patientName: 'John Mwangi',
      age: 67,
      gender: 'male',
      location: { lat: -1.2921, lng: 36.8219, address: 'Kenyatta Avenue, Nairobi CBD' },
      symptoms: ['Chest pain', 'Shortness of breath', 'Sweating'],
      allergies: 'Penicillin',
      medications: 'Aspirin daily',
      contact: '+254 712 345 678',
      eta: '4 min'
    };
    
    // setTimeout(() => setCurrentEmergency(mockEmergency), 2000);
  }, []);

  // Location tracking
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setLocation(newLoc);
        
        if (socket) {
          socket.emit('emt:location', {
            lat: newLoc.lat,
            lng: newLoc.lng,
            emergencyId: currentEmergency?.id
          });
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, currentEmergency]);

  const handleStatusUpdate = (status) => {
    if (socket) {
      socket.emit('emergency:status', {
        emergencyId: currentEmergency.id,
        status,
        timestamp: new Date().toISOString()
      });
    }
  };

  const renderDispatchView = () => (
    <div className="space-y-6">
      {!currentEmergency ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="text-green-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">On Standby</h2>
          <p className="text-gray-500">Waiting for emergency dispatch...</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            GPS Active • Location broadcasting
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Emergency Alert Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-600 text-white rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={20} />
                  <span className="font-bold text-lg">CRITICAL DISPATCH</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{currentEmergency.type}</h3>
                <p className="text-red-100">ID: {currentEmergency.id}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{currentEmergency.eta}</p>
                <p className="text-red-200">ETA</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-red-500">
              <div>
                <p className="text-2xl font-bold">{currentEmergency.patientName}</p>
                <p className="text-red-200 text-sm">Patient</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{currentEmergency.age} yrs</p>
                <p className="text-red-200 text-sm">Age</p>
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{currentEmergency.gender}</p>
                <p className="text-red-200 text-sm">Gender</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleStatusUpdate('en_route')}
              className="bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Navigation size={24} />
              En Route to Scene
            </button>
            <button
              onClick={() => handleStatusUpdate('arrived_scene')}
              className="bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <MapPin size={24} />
              Arrived at Scene
            </button>
          </div>

          {/* Patient Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Patient Information
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-medium flex items-start gap-2">
                  <MapPin size={16} className="text-red-500 mt-1" />
                  {currentEmergency.location.address}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Contact</p>
                <a href={`tel:${currentEmergency.contact}`} className="font-medium text-blue-600 flex items-center gap-2">
                  <Phone size={16} />
                  {currentEmergency.contact}
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <AlertCircle className="text-red-500" size={20} />
                <div>
                  <p className="font-medium text-red-900">Allergy Alert</p>
                  <p className="text-sm text-red-700">{currentEmergency.allergies}</p>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900 mb-1">Current Medications</p>
                <p className="text-sm text-blue-700">{currentEmergency.medications}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Reported Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {currentEmergency.symptoms.map((symptom, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Map Placeholder */}
          <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Map size={48} className="mx-auto mb-2" />
              <p>Interactive Navigation Map</p>
              <p className="text-sm">Turn-by-turn directions to patient</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPatientCareView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="text-red-600" size={24} />
          Vital Signs Assessment
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="120"
                value={vitals.bp_systolic}
                onChange={(e) => setVitals({...vitals, bp_systolic: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <span className="py-2">/</span>
              <input
                type="number"
                placeholder="80"
                value={vitals.bp_diastolic}
                onChange={(e) => setVitals({...vitals, bp_diastolic: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pulse (BPM)</label>
            <input
              type="number"
              placeholder="72"
              value={vitals.pulse}
              onChange={(e) => setVitals({...vitals, pulse: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SpO2 (%)</label>
            <input
              type="number"
              placeholder="98"
              value={vitals.spo2}
              onChange={(e) => setVitals({...vitals, spo2: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              placeholder="36.5"
              value={vitals.temperature}
              onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GCS (3-15)</label>
            <input
              type="number"
              min="3"
              max="15"
              placeholder="15"
              value={vitals.gcs}
              onChange={(e) => setVitals({...vitals, gcs: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Treatment & Notes</h3>
        <textarea
          value={treatmentNotes}
          onChange={(e) => setTreatmentNotes(e.target.value)}
          placeholder="Document treatment provided, medications administered, patient response..."
          rows={6}
          className="w-full px-4 py-3 border rounded-xl resize-none"
        />
        
        <div className="flex gap-3 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <Camera size={20} />
            Add Photo
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <Mic size={20} />
            Voice Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleStatusUpdate('transporting')}
          className="bg-yellow-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-yellow-700 transition flex items-center justify-center gap-2"
        >
          <Ambulance size={24} />
          Start Transport
        </button>
        <button
          onClick={() => handleStatusUpdate('arrived_hospital')}
          className="bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={24} />
          Arrived at Hospital
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white w-64 flex-shrink-0 transition-all ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Ambulance size={24} />
            </div>
            <div>
              <h1 className="font-bold">SwiftEMS</h1>
              <p className="text-xs text-gray-400">EMT Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dispatch', label: 'Dispatch', icon: Navigation },
              { id: 'patient', label: 'Patient Care', icon: Heart },
              { id: 'history', label: 'History', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.id ? 'bg-red-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold">EMT Dashboard</span>
          <div className="w-8" />
        </header>

        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dispatch' && 'Active Dispatch'}
              {activeTab === 'patient' && 'Patient Care'}
              {activeTab === 'history' && 'Emergency History'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            <p className="text-gray-500">
              {location && `Current Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
            </p>
          </div>

          {activeTab === 'dispatch' && renderDispatchView()}
          {activeTab === 'patient' && renderPatientCareView()}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p>No completed emergencies yet</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">EMT Settings</h3>
              <p className="text-gray-500">Profile and availability settings</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}