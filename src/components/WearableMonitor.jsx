import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Watch, Heart, Activity, Zap, AlertCircle, Bluetooth } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function WearableMonitor({ patientId }) {
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodOxygen: 98,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 36.6,
    stressLevel: 25,
    connected: true,
    battery: 85
  });

  const [history, setHistory] = useState([]);

  // Simulate real-time data from wearable
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => {
        const newHeartRate = prev.heartRate + (Math.random() - 0.5) * 4;
        const newVitals = {
          ...prev,
          heartRate: Math.max(60, Math.min(100, newHeartRate)),
          bloodOxygen: Math.max(95, Math.min(100, prev.bloodOxygen + (Math.random() - 0.5))),
          stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 5))
        };
        
        setHistory(h => [...h.slice(-20), { time: Date.now(), hr: newVitals.heartRate }]);
        return newVitals;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value, type) => {
    switch(type) {
      case 'heartRate':
        return value > 100 || value < 60 ? 'text-red-500' : 'text-green-500';
      case 'oxygen':
        return value < 95 ? 'text-red-500' : 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Watch className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Smart Watch Connected</h3>
            <p className="text-gray-400 text-sm">Apple Watch Series 9 • Patient ID: {patientId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-green-400">
            <Bluetooth size={16} />
            Connected
          </span>
          <span className="text-sm text-gray-400">{vitals.battery}%</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Heart Rate */}
        <motion.div 
          className="bg-gray-800 rounded-xl p-4"
          animate={{ scale: vitals.heartRate > 100 ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: vitals.heartRate > 100 ? Infinity : 0, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Heart size={16} />
            <span className="text-sm">Heart Rate</span>
          </div>
          <div className={`text-3xl font-bold ${getStatusColor(vitals.heartRate, 'heartRate')}`}>
            {Math.round(vitals.heartRate)}
          </div>
          <span className="text-xs text-gray-500">BPM</span>
        </motion.div>

        {/* Blood Oxygen */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Activity size={16} />
            <span className="text-sm">SpO2</span>
          </div>
          <div className={`text-3xl font-bold ${getStatusColor(vitals.bloodOxygen, 'oxygen')}`}>
            {Math.round(vitals.bloodOxygen)}%
          </div>
          <span className="text-xs text-gray-500">Blood Oxygen</span>
        </div>

        {/* Blood Pressure */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Activity size={16} />
            <span className="text-sm">BP</span>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
          </div>
          <span className="text-xs text-gray-500">mmHg</span>
        </div>

        {/* Stress Level */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Zap size={16} />
            <span className="text-sm">Stress</span>
          </div>
          <div className={`text-3xl font-bold ${vitals.stressLevel > 70 ? 'text-red-400' : 'text-yellow-400'}`}>
            {Math.round(vitals.stressLevel)}
          </div>
          <span className="text-xs text-gray-500">HRV Index</span>
        </div>
      </div>

      {/* Real-time Chart */}
      <div className="bg-gray-800 rounded-xl p-4 h-48">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Live Heart Rate</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <YAxis domain={[50, 110]} hide />
            <Line 
              type="monotone" 
              dataKey="hr" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Emergency Alert Trigger */}
      {vitals.heartRate > 120 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-600/20 border border-red-500 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <p className="font-bold text-red-400">Elevated Heart Rate Detected</p>
            <p className="text-sm text-red-300">Automatically notifying emergency contacts...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}