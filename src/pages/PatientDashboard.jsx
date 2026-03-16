import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Heart, Shield, Clock, MapPin, Phone, 
  AlertCircle, ChevronRight, Plus, Edit2, 
  Trash2, Ambulance, CreditCard, Users, 
  FileText, Bell, Settings, LogOut, Activity,
  Calendar, CheckCircle, XCircle, Star,
  TrendingUp, Droplets, Thermometer, Stethoscope,
  ChevronLeft, Download, Share2, Printer,
  QrCode, BadgeCheck, MapPinned, Siren
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Medical ID Card Component
const MedicalIDCard = ({ user, patient }) => (
  <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-xl">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <User size={32} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{user?.name}</h3>
          <p className="text-red-100 text-sm">Medical ID: {patient?.id || 'P-2024-001'}</p>
        </div>
      </div>
      <div className="bg-white/20 p-2 rounded-lg">
        <QrCode size={24} className="text-white" />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white/10 rounded-lg p-3">
        <p className="text-xs text-red-200 mb-1">Blood Type</p>
        <p className="text-2xl font-bold">{patient?.blood_group || 'Unknown'}</p>
      </div>
      <div className="bg-white/10 rounded-lg p-3">
        <p className="text-xs text-red-200 mb-1">Allergies</p>
        <p className="text-sm font-medium truncate">{patient?.allergies || 'None known'}</p>
      </div>
    </div>
    
    <div className="flex items-center gap-2 text-sm text-red-200">
      <BadgeCheck size={16} />
      <span>SHA Verified • Last updated: {new Date().toLocaleDateString()}</span>
    </div>
  </div>
);

// Emergency Contact Card
const EmergencyContactCard = ({ contact, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User size={20} className="text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{contact.name}</h4>
          <p className="text-sm text-gray-500">{contact.relationship}</p>
          <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 flex items-center gap-1 mt-1">
            <Phone size={12} />
            {contact.phone}
          </a>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
          <Edit2 size={16} />
        </button>
        <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </motion.div>
);

// Health Metrics Chart
const HealthMetricsChart = () => {
  const data = [
    { month: 'Jan', emergencies: 0, bp: 120 },
    { month: 'Feb', emergencies: 1, bp: 118 },
    { month: 'Mar', emergencies: 0, bp: 122 },
    { month: 'Apr', emergencies: 0, bp: 121 },
    { month: 'May', emergencies: 1, bp: 119 },
    { month: 'Jun', emergencies: 0, bp: 120 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Activity size={20} className="text-blue-600" />
        Health Trends
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Line type="monotone" dataKey="bp" stroke="#3b82f6" strokeWidth={2} name="Blood Pressure" />
            <Line type="monotone" dataKey="emergencies" stroke="#dc2626" strokeWidth={2} name="Emergencies" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Subscription Card
const SubscriptionCard = ({ subscription }) => {
  const plans = {
    basic: { name: 'Basic', price: 'Free', features: ['Pay per use', 'Standard response'] },
    family: { name: 'Family Plan', price: 'KES 4,000/year', features: ['Unlimited calls', 'Priority dispatch', 'Family coverage'] },
    premium: { name: 'Premium', price: 'KES 8,000/year', features: ['Everything in Family', 'Air ambulance', 'International'] }
  };

  const currentPlan = plans[subscription?.plan || 'basic'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{currentPlan.name}</h3>
          <p className="text-2xl font-bold text-green-600">{currentPlan.price}</p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          {subscription?.status === 'active' ? 'Active' : 'Inactive'}
        </div>
      </div>
      
      <ul className="space-y-2 mb-6">
        {currentPlan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle size={16} className="text-green-500" />
            {feature}
          </li>
        ))}
      </ul>
      
      <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
        Manage Subscription
      </button>
    </div>
  );
};

// Family Member Card
const FamilyMemberCard = ({ member }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-4">
    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
      <Users size={20} className="text-purple-600" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-gray-900">{member.name}</h4>
      <p className="text-sm text-gray-500">{member.relationship} • {member.age} years</p>
    </div>
    <div className="text-right">
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        member.covered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {member.covered ? 'Covered' : 'Not Covered'}
      </span>
    </div>
  </div>
);

// Recent Emergency Card
const RecentEmergencyCard = ({ emergency }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Siren size={16} className="text-red-500" />
          <span className="font-bold text-gray-900">{emergency.type}</span>
        </div>
        <p className="text-sm text-gray-500">{new Date(emergency.date).toLocaleDateString()}</p>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        emergency.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {emergency.status}
      </span>
    </div>
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <span className="flex items-center gap-1">
        <Ambulance size={14} />
        {emergency.ambulance}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={14} />
        {emergency.responseTime} response
      </span>
    </div>
  </div>
);

// Main Component
export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Queries
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
  });

  const { data: emergencies, isLoading: emergenciesLoading } = useQuery({
    queryKey: ['emergencies'],
    queryFn: () => api.get('/emergency/history').then(r => r.data),
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get('/subscription/status').then(r => r.data),
  });

  const patient = profile?.patient || {};
  const fullUser = profile?.user || user;

  // Mock data for demonstration
  const emergencyContacts = [
    { id: 1, name: 'Jane Mwangi', relationship: 'Spouse', phone: '+254 712 345 678' },
    { id: 2, name: 'Dr. Sarah Kimani', relationship: 'Primary Doctor', phone: '+254 733 456 789' },
  ];

  const familyMembers = [
    { id: 1, name: 'Jane Mwangi', relationship: 'Wife', age: 45, covered: true },
    { id: 2, name: 'Tom Mwangi', relationship: 'Son', age: 12, covered: true },
    { id: 3, name: 'Mary Mwangi', relationship: 'Mother', age: 78, covered: false },
  ];

  const recentEmergencies = [
    { id: 'EMR-001', type: 'Chest Pain', date: '2024-03-01', status: 'completed', ambulance: 'AMB-045', responseTime: '6 min' },
    { id: 'EMR-002', type: 'Fall Injury', date: '2023-11-15', status: 'completed', ambulance: 'AMB-032', responseTime: '9 min' },
  ];

  const stats = [
    { label: 'Total Emergencies', value: '2', icon: Siren, color: 'red' },
    { label: 'Avg Response Time', value: '7.5 min', icon: Clock, color: 'blue' },
    { label: 'Family Members', value: '3', icon: Users, color: 'purple' },
    { label: 'Plan Status', value: 'Active', icon: Shield, color: 'green' },
  ];

  const handleEmergency = () => navigate('/emergency');

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {fullUser?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-blue-100">Your emergency profile is 85% complete</p>
        <div className="mt-4 w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
          <div className="bg-white h-full rounded-full w-[85%]" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <Icon className={`text-${stat.color}-500 mb-2`} size={24} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <MedicalIDCard user={fullUser} patient={patient} />
        <SubscriptionCard subscription={subscription} />
      </div>

      <HealthMetricsChart />
    </div>
  );

  const renderMedicalProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Medical Information</h3>
          <button className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition">
            <Edit2 size={18} />
            Edit
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Droplets className="text-red-500" size={20} />
              <span className="font-bold text-lg">{patient?.blood_group || 'Not specified'}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
            <div className="p-3 bg-red-50 rounded-xl border-l-4 border-red-500">
              <p className="text-red-900 font-medium">{patient?.allergies || 'No known allergies'}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-gray-900">{patient?.medical_conditions || 'None recorded'}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-blue-900">{patient?.medications || 'No medications recorded'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Phone size={20} className="text-blue-600" />
            Emergency Contacts
          </h3>
          <button 
            onClick={() => setShowAddContact(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </div>

        <div className="space-y-3">
          {emergencyContacts.map(contact => (
            <EmergencyContactCard 
              key={contact.id} 
              contact={contact}
              onEdit={() => setEditingContact(contact)}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Emergency History</h3>
        
        {recentEmergencies.length > 0 ? (
          <div className="space-y-4">
            {recentEmergencies.map(emergency => (
              <RecentEmergencyCard key={emergency.id} emergency={emergency} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Siren size={48} className="mx-auto mb-4 opacity-30" />
            <p>No emergency history yet</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" />
          Medical Records
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Emergency Visit Summary</p>
                <p className="text-sm text-gray-500">March 1, 2024 • Nairobi General Hospital</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
                <Download size={18} />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-6">
      <SubscriptionCard subscription={subscription} />
      
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Payment History</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Annual Subscription - Family Plan</p>
              <p className="text-sm text-gray-500">Paid on March 1, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">KES 4,000</p>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Paid</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Upgrade Options</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 cursor-pointer transition">
            <h4 className="font-bold text-lg mb-2">Premium Plan</h4>
            <p className="text-2xl font-bold text-purple-600 mb-2">KES 8,000/year</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Air ambulance coverage</li>
              <li>• International emergency</li>
              <li>• Dedicated support line</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFamily = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Family Members</h3>
          <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition">
            <Plus size={18} />
            Add Member
          </button>
        </div>

        <div className="space-y-3">
          {familyMembers.map(member => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Shield size={20} />
          Family Coverage
        </h4>
        <p className="text-blue-800 text-sm mb-4">
          Your Family Plan covers up to 5 family members for unlimited emergency calls.
        </p>
        <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-[60%]" />
        </div>
        <p className="text-xs text-blue-700 mt-2">3 of 5 members covered</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive emergency alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">SMS Alerts</p>
              <p className="text-sm text-gray-500">Text messages for emergencies</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Location Sharing</p>
              <p className="text-sm text-gray-500">Auto-share GPS during emergencies</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-red-600">Danger Zone</h3>
        <button className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition">
          Delete Account
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Health</h1>
              <p className="text-sm text-gray-500">Patient Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
            </button>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600 transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEmergency}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl shadow-lg font-bold text-lg flex items-center justify-center gap-3"
        >
          <Siren size={24} />
          Request Emergency Help
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'profile', label: 'Medical Profile', icon: FileText },
            { id: 'history', label: 'Emergency History', icon: Clock },
            { id: 'subscription', label: 'My Plan', icon: Shield },
            { id: 'family', label: 'Family Members', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                  activeTab === item.id 
                    ? 'bg-red-50 text-red-600 border-r-4 border-red-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'profile' && renderMedicalProfile()}
              {activeTab === 'history' && renderHistory()}
              {activeTab === 'subscription' && renderSubscription()}
              {activeTab === 'family' && renderFamily()}
              {activeTab === 'settings' && renderSettings()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}