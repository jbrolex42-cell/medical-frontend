import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ScanFace, Shield, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';

export default function BiometricAuth({ onAuthSuccess, onCancel }) {
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState(null); 
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); 

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('success');
            setTimeout(() => onAuthSuccess(), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  const startScan = (type) => {
    setScanType(type);
    setScanning(true);
    setStatus('scanning');
    setProgress(0);
  };

  // Check if WebAuthn is supported
  const isWebAuthnSupported = () => {
    return window.PublicKeyCredential !== undefined;
  };

  const handleWebAuthn = async () => {
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: 'Emergency Medical System' },
          user: {
            id: new Uint8Array(16),
            name: 'user@example.com',
            displayName: 'User'
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: { authenticatorAttachment: 'platform' }
        }
      });
      setStatus('success');
      onAuthSuccess();
    } catch (err) {
      setStatus('error');
      console.error('WebAuthn failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-blue-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Secure Access</h2>
          <p className="text-gray-500 mt-2">Verify your identity to access medical records</p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {isWebAuthnSupported() && (
                <button
                  onClick={handleWebAuthn}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-4"
                >
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ScanFace className="text-blue-600" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Face Recognition</p>
                    <p className="text-sm text-gray-500">Use device Face ID</p>
                  </div>
                </button>
              )}

              <button
                onClick={() => startScan('fingerprint')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-4"
              >
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Fingerprint className="text-purple-600" size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Fingerprint</p>
                  <p className="text-sm text-gray-500">Touch sensor to verify</p>
                </div>
              </button>

              <button
                onClick={() => startScan('face')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-4"
              >
                <div className="p-3 bg-green-100 rounded-lg">
                  <Smartphone className="text-green-600" size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">App Simulator</p>
                  <p className="text-sm text-gray-500">Demo biometric scan</p>
                </div>
              </button>
            </motion.div>
          )}

          {status === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 3.77} 377`}
                    className="transition-all duration-100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {scanType === 'fingerprint' ? (
                    <Fingerprint className="text-blue-600 animate-pulse" size={40} />
                  ) : (
                    <ScanFace className="text-blue-600 animate-pulse" size={40} />
                  )}
                </div>
              </div>
              <p className="text-lg font-medium text-gray-900">Scanning...</p>
              <p className="text-sm text-gray-500 mt-1">Keep {scanType === 'fingerprint' ? 'finger' : 'face'} steady</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <p className="text-xl font-bold text-gray-900">Access Granted</p>
              <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={40} />
              </div>
              <p className="text-lg font-bold text-gray-900">Scan Failed</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-4 text-blue-600 font-medium hover:underline"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onCancel}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel and use password
        </button>
      </motion.div>
    </div>
  );
}