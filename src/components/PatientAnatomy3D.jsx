import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCw, Info, AlertCircle } from 'lucide-react';
import * as THREE from 'three';

// Simplified human body model (in production, use actual medical 3D models)
function BodyModel({ selectedRegion, onRegionClick }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const regions = [
    { id: 'head', position: [0, 1.8, 0], color: '#fca5a5', name: 'Head & Brain' },
    { id: 'chest', position: [0, 0.8, 0], color: '#ef4444', name: 'Chest & Heart' },
    { id: 'abdomen', position: [0, 0.2, 0], color: '#f97316', name: 'Abdomen' },
    { id: 'arm-l', position: [-0.8, 0.8, 0], color: '#3b82f6', name: 'Left Arm' },
    { id: 'arm-r', position: [0.8, 0.8, 0], color: '#3b82f6', name: 'Right Arm' },
    { id: 'leg-l', position: [-0.3, -0.8, 0], color: '#8b5cf6', name: 'Left Leg' },
    { id: 'leg-r', position: [0.3, -0.8, 0], color: '#8b5cf6', name: 'Right Leg' }
  ];

  return (
    <group ref={meshRef}>
      {/* Simplified body parts as spheres/cylinders */}
      {regions.map(region => (
        <mesh
          key={region.id}
          position={region.position}
          onClick={() => onRegionClick(region)}
          onPointerOver={(e) => { document.body.style.cursor = 'pointer'; e.stopPropagation(); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <sphereGeometry args={[region.id.includes('head') ? 0.3 : 0.25, 32, 32]} />
          <meshStandardMaterial 
            color={selectedRegion?.id === region.id ? '#fbbf24' : region.color}
            emissive={selectedRegion?.id === region.id ? '#f59e0b' : '#000000'}
            emissiveIntensity={selectedRegion?.id === region.id ? 0.5 : 0}
          />
          <Html distanceFactor={10}>
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none opacity-0 hover:opacity-100 transition">
              {region.name}
            </div>
          </Html>
        </mesh>
      ))}
      
      {/* Connecting body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 1.5, 32]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
    </group>
  );
}

export default function PatientAnatomy3D({ patientData }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showSymptoms, setShowSymptoms] = useState(false);

  const regionSymptoms = {
    head: ['Headache', 'Dizziness', 'Blurred vision', 'Loss of consciousness'],
    chest: ['Chest pain', 'Shortness of breath', 'Palpitations', 'Coughing blood'],
    abdomen: ['Severe pain', 'Nausea', 'Vomiting', 'Bleeding'],
    'arm-l': ['Fracture', 'Bleeding', 'Numbness', 'Burn'],
    'arm-r': ['Fracture', 'Bleeding', 'Numbness', 'Burn'],
    'leg-l': ['Fracture', 'Sprain', 'Bleeding', 'Unable to walk'],
    'leg-r': ['Fracture', 'Sprain', 'Bleeding', 'Unable to walk']
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Info className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">3D Injury Assessment</h3>
            <p className="text-gray-400 text-sm">Click body regions to report symptoms</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
            <ZoomIn size={20} />
          </button>
          <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
            <ZoomOut size={20} />
          </button>
          <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
            <RotateCw size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 h-[500px]">
        {/* 3D Viewport */}
        <div className="col-span-2 relative">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <BodyModel selectedRegion={selectedRegion} onRegionClick={setSelectedRegion} />
            <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={8} />
            <gridHelper args={[10, 10]} position={[0, -2, 0]} />
          </Canvas>
          
          {/* Overlay Instructions */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur rounded-lg p-3 text-white text-sm">
            <p className="flex items-center gap-2">
              <RotateCw size={14} />
              Drag to rotate • Scroll to zoom
            </p>
          </div>
        </div>

        {/* Symptom Panel */}
        <div className="bg-gray-800 p-6 overflow-y-auto">
          {selectedRegion ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4 className="text-xl font-bold text-white mb-4">{selectedRegion.name}</h4>
              
              <div className="space-y-3">
                <p className="text-gray-400 text-sm mb-3">Select symptoms:</p>
                {regionSymptoms[selectedRegion.id]?.map((symptom, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition flex items-center gap-3"
                  >
                    <div className="w-4 h-4 border-2 border-gray-500 rounded" />
                    {symptom}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-red-400 font-bold text-sm">Emergency Indicator</p>
                    <p className="text-red-300 text-xs mt-1">
                      Chest pain with shortness of breath requires immediate attention
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">
                Confirm Symptoms
              </button>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Info size={48} className="mb-4 opacity-50" />
              <p>Click on a body region to assess injuries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}