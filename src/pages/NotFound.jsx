import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft, Ambulance, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        {/* ...rest of your component */}
      </motion.div>
    </div>
  );
}