import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  MessageSquare, Send, MoreVertical, User, 
  Stethoscope, FileText, Pill, Activity, 
  ChevronLeft, Clock, AlertCircle, CheckCircle2,
  ScreenShare, Settings, Fullscreen
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// ✅ Fixed: default import for API
import api from '../services/api';

export default function Telemedicine() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [showPrescription, setShowPrescription] = useState(false);

  // Fetch session data
  const { data: session, isLoading } = useQuery({
    queryKey: ['telemedicine', sessionId],
    queryFn: () => api.get(`/telemedicine/${sessionId}`).then(r => r.data),
    enabled: !!sessionId
  });

  // Simulate call connection
  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text: newMessage, sender: 'patient', time: new Date() }]);
    setNewMessage('');
  };

  // ✅ Safe confirm: disable ESLint for this line
  const handleEndCall = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('End this consultation?')) {
      navigate('/dashboard');
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* … rest of your component stays the same … */}
    </div>
  );
}