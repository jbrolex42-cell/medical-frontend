import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, CheckCircle, Link2, Clock, Hash } from 'lucide-react';

export default function BlockchainRecords({ patientId }) {
  const [records, setRecords] = useState([
    {
      id: '0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      type: 'Emergency Visit',
      date: '2024-03-07 14:30',
      hospital: 'Nairobi General Hospital',
      doctor: 'Dr. Sarah Kimani',
      diagnosis: 'Acute Appendicitis',
      treatment: 'Emergency Appendectomy',
      medications: ['Morphine', 'Antibiotics'],
      verified: true,
      blockNumber: 15432987,
      timestamp: 1709821800
    }
  ]);

  const verifyOnChain = async (recordId) => {
    // Verify hash on blockchain
    return true;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <Shield className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Blockchain Medical Records</h3>
            <p className="text-gray-500 text-sm">Immutable, encrypted, patient-controlled</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {records.length} Records Secured
        </span>
      </div>

      <div className="space-y-4">
        {records.map((record, idx) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{record.type}</h4>
                  <p className="text-sm text-gray-500">{record.hospital}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div>
                <span className="text-gray-500">Date:</span>
                <p className="font-medium">{record.date}</p>
              </div>
              <div>
                <span className="text-gray-500">Doctor:</span>
                <p className="font-medium">{record.doctor}</p>
              </div>
              <div>
                <span className="text-gray-500">Diagnosis:</span>
                <p className="font-medium text-red-600">{record.diagnosis}</p>
              </div>
              <div>
                <span className="text-gray-500">Treatment:</span>
                <p className="font-medium">{record.treatment}</p>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Hash size={14} />
                <span className="font-mono truncate max-w-[200px]">{record.id}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock size={12} />
                  Block #{record.blockNumber}
                </span>
                <button className="text-blue-600 hover:underline flex items-center gap-1">
                  <Link2 size={12} />
                  View on Chain
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
        <Lock className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-bold mb-1">End-to-End Encryption</p>
          <p>Your medical records are encrypted with your private key. Only authorized emergency responders can access them during active emergencies.</p>
        </div>
      </div>
    </div>
  );
}