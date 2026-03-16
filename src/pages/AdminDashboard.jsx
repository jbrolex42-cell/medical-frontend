import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Ambulance, Users, AlertTriangle, 
  TrendingUp, Map, Phone, Clock, Hospital,
  Droplets, Radio, BarChart3, Settings, LogOut,
  Search, Filter, MoreVertical, CheckCircle,
  XCircle, Navigation, Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { useAuthStore } from '../stores/authStore';
import RealTimeMap from '../components/RealTimeMap';
import StatsCard from '../components/StatsCard';
import EmergencyQueue from '../components/EmergencyQueue';
import FleetStatusPanel from '../components/FleetStatusPanel';
import AnalyticsChart from '../components/AnalyticsChart';

export default function AdminDashboard() {
  const [liveEmergencies, setLiveEmergencies] = useState([]);
  const [fleetStatus, setFleetStatus] = useState({ available: 0, busy: 0, offline: 0, maintenance: 0 });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [oxygenAlerts, setOxygenAlerts] = useState([]);
  
  const socket = useSocket();
  const { logout } = useAuthStore();

  // Fetch analytics data
  const { data: analytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics').then(r => r.data),
    refetchInterval: 30000
  });

  // Fetch fleet status
  const { data: fleetData } = useQuery({
    queryKey: ['fleet-status'],
    queryFn: () => api.get('/admin/ambulances/status').then(r => r.data),
    refetchInterval: 10000
  });

  // Fetch oxygen levels
  const { data: oxygenData } = useQuery({
    queryKey: ['oxygen-levels'],
    queryFn: () => api.get('/admin/oxygen-levels').then(r => r.data),
    refetchInterval: 60000
  });

  useEffect(() => {
    if (fleetData) {
      setFleetStatus({
        available: fleetData.available || 0,
        busy: fleetData.busy || 0,
        offline: fleetData.offline || 0,
        maintenance: fleetData.maintenance || 0
      });
    }
  }, [fleetData]);

  useEffect(() => {
    if (oxygenData?.alerts) {
      setOxygenAlerts(oxygenData.alerts);
    }
  }, [oxygenData]);

  // Socket.io real-time updates
  useEffect(() => {
    if (socket) {
      socket.emit('dashboard:subscribe');
      
      socket.on('dashboard:data', (data) => {
        setLiveEmergencies(data.activeEmergencies || []);
      });
      
      socket.on('emergency:created', (emergency) => {
        setLiveEmergencies(prev => [emergency, ...prev]);
        // Play alert sound
        new Audio('/alert.mp3').play().catch(() => {});
      });
      
      socket.on('emergency:status', (update) => {
        setLiveEmergencies(prev => 
          prev.map(e => e.id === update.emergencyId 
            ? { ...e, status: update.status } 
            : e
          ).filter(e => !['completed', 'cancelled'].includes(e.status))
        );
      });

      socket.on('ambulance:status', (update) => {
        refetchAnalytics();
      });
    }
    
    return () => {
      socket?.off('dashboard:data');
      socket?.off('emergency:created');
      socket?.off('emergency:status');
      socket?.off('ambulance:status');
    };
  }, [socket]);

  const handleBroadcastAlert = async () => {
    if (!broadcastMessage.trim()) return;
    
    socket.emit('alert:broadcast', {
      type: 'public_safety',
      message: broadcastMessage,
      severity: 'high',
      timestamp: new Date().toISOString()
    });
    
    setShowBroadcastModal(false);
    setBroadcastMessage('');
  };

  const handleManualDispatch = async (emergencyId, ambulanceId) => {
    try {
      await api.post('/dispatch/assign', { emergency_id: emergencyId, ambulance_id: ambulanceId });
    } catch (error) {
      console.error('Manual dispatch failed:', error);
    }
  };

  const getResponseTimeColor = (minutes) => {
    if (minutes <= 8) return 'text-green-400';
    if (minutes <= 15) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-2 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">EMS Command Center</h1>
              <p className="text-gray-400 text-xs">Real-time Dispatch Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* System Status */}
            <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">System Operational</span>
            </div>

            {/* Quick Actions */}
            <button 
              onClick={() => setShowBroadcastModal(true)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              <Radio size={18} />
              Broadcast Alert
            </button>

            <button 
              onClick={logout}
              className="text-gray-400 hover:text-white transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen border-r border-gray-700">
          <div className="p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'emergencies', label: 'Live Emergencies', icon: AlertTriangle },
                { id: 'fleet', label: 'Fleet Management', icon: Ambulance },
                { id: 'hospitals', label: 'Hospitals', icon: Hospital },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    selectedTab === item.id 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Oxygen Alerts Sidebar */}
          {oxygenAlerts.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                <Droplets size={16} className="text-blue-400" />
                Oxygen Alerts ({oxygenAlerts.length})
              </h3>
              <div className="space-y-2">
                {oxygenAlerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="bg-gray-700 p-3 rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{alert.vehicle_number}</span>
                      <span className="text-red-400 font-bold">{alert.current_level}%</span>
                    </div>
                    <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-500 h-full transition-all"
                        style={{ width: `${alert.current_level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {selectedTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6">
                  <StatsCard 
                    title="Active Emergencies" 
                    value={liveEmergencies.length} 
                    icon={AlertTriangle}
                    color="red"
                    subtitle={`${liveEmergencies.filter(e => e.triage_category === 'critical').length} critical`}
                    trend="+12% vs yesterday"
                  />
                  <StatsCard 
                    title="Available Units" 
                    value={fleetStatus.available} 
                    icon={Ambulance}
                    color="green"
                    subtitle={`${fleetStatus.busy} busy, ${fleetStatus.maintenance} maintenance`}
                    trend="92% operational"
                  />
                  <StatsCard 
                    title="Avg Response Time" 
                    value={`${analytics?.avg_response_time || 0}m`} 
                    icon={Clock}
                    color="blue"
                    subtitle="Target: <10 min"
                    trend="-8% vs last week"
                  />
                  <StatsCard 
                    title="Patients Today" 
                    value={analytics?.total_patients || 0} 
                    icon={Users}
                    color="purple"
                    subtitle={`${analytics?.completed_transports || 0} completed`}
                    trend="+23% vs yesterday"
                  />
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Live Map */}
                  <div className="col-span-2 bg-gray-800 rounded-2xl p-6 h-[600px]">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Map className="text-gray-400" />
                        Live Operations Map
                      </h2>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          Emergency ({liveEmergencies.length})
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-green-500 rounded-full" />
                          Available ({fleetStatus.available})
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                          En Route ({fleetStatus.busy})
                        </span>
                      </div>
                    </div>
                    <div className="h-[520px] rounded-xl overflow-hidden bg-gray-900">
                      <RealTimeMap 
                        emergencies={liveEmergencies}
                        ambulances={fleetData?.ambulances || []}
                      />
                    </div>
                  </div>

                  {/* Emergency Queue */}
                  <div className="space-y-6">
                    <div className="bg-gray-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                          <Phone className="text-red-500" />
                          Active Queue
                        </h2>
                        <span className="bg-red-600 text-xs px-2 py-1 rounded-full">
                          {liveEmergencies.filter(e => e.status === 'pending').length} pending
                        </span>
                      </div>
                      <EmergencyQueue 
                        emergencies={liveEmergencies}
                        onManualDispatch={handleManualDispatch}
                        fleet={fleetData?.ambulances || []}
                      />
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                      <h3 className="font-bold mb-4">Triage Distribution</h3>
                      <div className="space-y-3">
                        {['critical', 'urgent', 'moderate', 'minor'].map(category => {
                          const count = liveEmergencies.filter(e => e.triage_category === category).length;
                          const total = liveEmergencies.length || 1;
                          const percentage = (count / total) * 100;
                          
                          return (
                            <div key={category}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize text-gray-400">{category}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  className={`h-full ${
                                    category === 'critical' ? 'bg-red-500' :
                                    category === 'urgent' ? 'bg-orange-500' :
                                    category === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* EMERGENCIES TAB */}
            {selectedTab === 'emergencies' && (
              <motion.div
                key="emergencies"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Emergency Management</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text" 
                        placeholder="Search emergencies..."
                        className="bg-gray-700 pl-10 pr-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <button className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                      <Filter size={18} />
                      Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700 text-left">
                      <tr>
                        <th className="p-4 rounded-tl-lg">ID</th>
                        <th className="p-4">Patient</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Triage</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Response Time</th>
                        <th className="p-4">Assigned Unit</th>
                        <th className="p-4 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {liveEmergencies.map(emergency => (
                        <tr key={emergency.id} className="hover:bg-gray-700/50 transition">
                          <td className="p-4 font-mono text-gray-400">#{emergency.id}</td>
                          <td className="p-4">
                            <div className="font-medium">{emergency.patient_name || 'Unknown'}</div>
                            <div className="text-sm text-gray-400">{emergency.requester_phone}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Navigation size={14} className="text-gray-400" />
                              {emergency.latitude?.toFixed(4)}, {emergency.longitude?.toFixed(4)}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              emergency.triage_category === 'critical' ? 'bg-red-600' :
                              emergency.triage_category === 'urgent' ? 'bg-orange-600' :
                              emergency.triage_category === 'moderate' ? 'bg-yellow-600' : 'bg-green-600'
                            }`}>
                              {emergency.triage_category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="flex items-center gap-2">
                              {emergency.status === 'en_route' && <Zap size={16} className="text-yellow-400 animate-pulse" />}
                              <span className="capitalize">{emergency.status?.replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={getResponseTimeColor(emergency.response_time_minutes)}>
                              {emergency.response_time_minutes || '--'} min
                            </span>
                          </td>
                          <td className="p-4">
                            {emergency.ambulance ? (
                              <div className="flex items-center gap-2">
                                <Ambulance size={16} className="text-gray-400" />
                                <span>{emergency.ambulance.vehicle_number}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">Unassigned</span>
                            )}
                          </td>
                          <td className="p-4">
                            <button className="p-2 hover:bg-gray-600 rounded-lg transition">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* FLEET TAB */}
            {selectedTab === 'fleet' && (
              <motion.div
                key="fleet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <FleetStatusPanel fleetData={fleetData} />
              </motion.div>
            )}

            {/* ANALYTICS TAB */}
            {selectedTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gray-800 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-6">Performance Analytics</h2>
                  <AnalyticsChart data={analytics?.historical_data || []} />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Response Time Trends</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {analytics?.response_time_trends?.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-500"
                            style={{ height: `${(day.avg_time / 30) * 100}%` }}
                          />
                          <span className="text-xs text-gray-400">{day.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Incident Hotspots</h3>
                    <div className="space-y-3">
                      {analytics?.hotspots?.map((spot, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium">{spot.location}</p>
                            <p className="text-sm text-gray-400">{spot.incidents} incidents this month</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${
                              spot.trend === 'up' ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {spot.trend === 'up' ? '↑' : '↓'} {spot.change}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Radio className="text-red-500" />
                Broadcast Public Alert
              </h3>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter alert message..."
                className="w-full h-32 bg-gray-700 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBroadcastAlert}
                  disabled={!broadcastMessage.trim()}
                  className="flex-1 py-3 bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition font-medium"
                >
                  Broadcast Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}