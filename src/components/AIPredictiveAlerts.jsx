import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle, TrendingUp, Map, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AIPredictiveAlerts() {
  const [predictions, setPredictions] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  // AI predicts emergencies before they happen
  useEffect(() => {
    // ML model analyzes: weather, traffic, events, historical data
    const mockPredictions = [
      {
        id: 1,
        type: 'traffic_accident',
        probability: 0.85,
        location: { lat: -1.2921, lng: 36.8219 },
        reason: 'Heavy rain + rush hour + road construction',
        estimated_time: '15-30 minutes',
        recommended_action: 'Pre-position ambulance at Junction A'
      },
      {
        id: 2,
        type: 'cardiac_emergency',
        probability: 0.72,
        location: { lat: -1.3000, lng: 36.8000 },
        reason: 'Marathon event + high humidity + elderly participants',
        estimated_time: 'Next 2 hours',
        recommended_action: 'Deploy motorcycle responder'
      }
    ];
    setPredictions(mockPredictions);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl">
            <Brain className="text-purple-300" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Predictive Analytics</h3>
            <p className="text-purple-200 text-sm">Machine Learning Emergency Forecasting</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live Model
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {predictions.map(prediction => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className={prediction.probability > 0.8 ? 'text-red-400' : 'text-yellow-400'} />
                <span className="font-bold capitalize">{prediction.type.replace('_', ' ')}</span>
              </div>
              <span className="text-2xl font-bold">{Math.round(prediction.probability * 100)}%</span>
            </div>
            <p className="text-sm text-purple-200 mb-2">{prediction.reason}</p>
            <div className="flex items-center gap-4 text-xs text-purple-300">
              <span>ETA: {prediction.estimated_time}</span>
              <span>•</span>
              <span>{prediction.recommended_action}</span>
            </div>
            <div className="mt-3 w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prediction.probability * 100}%` }}
                className={`h-full ${prediction.probability > 0.8 ? 'bg-red-500' : 'bg-yellow-500'}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Real-time Risk Heatmap */}
      <div className="bg-black/20 rounded-xl p-4">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Map size={18} />
          Live Risk Heatmap
        </h4>
        <div className="h-48 bg-gray-800 rounded-lg relative overflow-hidden">
          {/* Simulated heatmap overlay */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-yellow-500 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-orange-500 rounded-full blur-2xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Interactive Map Component</p>
          </div>
        </div>
      </div>
    </div>
  );
}