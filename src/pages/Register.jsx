import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Lock, Eye, EyeOff, ArrowRight, 
  AlertCircle, CheckCircle2, Ambulance, User,
  Shield, ChevronLeft, ChevronRight, Heart
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    // Step 1: Account
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    
    // Step 2: Medical (patients only)
    blood_group: '',
    allergies: '',
    medical_conditions: '',
    medications: '',
    
    // Step 3: Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    
    // Step 4: Subscription
    plan: 'basic' // basic, family, premium
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (userData) => api.post('/auth/register', userData),
    onSuccess: (response) => {
      const { user, token } = response.data;
      login(user, token);
      navigate('/dashboard');
    },
    onError: (error) => {
      setErrors({ 
        general: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    }
  });

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.length < 3) {
        newErrors.name = 'Name must be at least 3 characters';
      }
      
      if (loginMethod === 'email') {
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
      } else {
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        }
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (currentStep === 3) {
      if (!formData.emergency_contact_name) {
        newErrors.emergency_contact_name = 'Emergency contact name is required';
      }
      if (!formData.emergency_contact_phone) {
        newErrors.emergency_contact_phone = 'Emergency contact phone is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 1 && formData.role !== 'patient') {
        setStep(3); // Skip medical info for non-patients
      } else {
        setStep(prev => Math.min(prev + 1, 4));
      }
    }
  };

  const handleBack = () => {
    if (step === 3 && formData.role !== 'patient') {
      setStep(1);
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setErrors({ general: 'Please accept the terms and conditions' });
      return;
    }
    
    const payload = {
      name: formData.name,
      password: formData.password,
      role: formData.role,
      blood_group: formData.blood_group,
      allergies: formData.allergies,
      medical_conditions: formData.medical_conditions,
      medications: formData.medications,
      emergency_contact_name: formData.emergency_contact_name,
      emergency_contact_phone: formData.emergency_contact_phone
    };
    
    if (loginMethod === 'email') {
      payload.email = formData.email;
    } else {
      payload.phone = formData.phone.replace(/\s/g, '');
    }
    
    registerMutation.mutate(payload);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('254')) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 12)}`.trim();
    }
    if (cleaned.startsWith('0')) {
      return `+254 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`.trim();
    }
    return value;
  };

  const steps = [
    { number: 1, title: 'Account', icon: User },
    { number: 2, title: 'Medical', icon: Heart },
    { number: 3, title: 'Contacts', icon: Phone },
    { number: 4, title: 'Plan', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl shadow-lg mb-4"
          >
            <Ambulance className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our emergency medical network</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.number;
            const isCompleted = step > s.number;
            const isVisible = formData.role !== 'patient' ? s.number !== 2 : true;
            
            if (!isVisible) return null;
            
            return (
              <React.Fragment key={s.number}>
                <div className="flex items-center">
                  <motion.div
                    animate={{ 
                      backgroundColor: isActive ? '#dc2626' : isCompleted ? '#22c55e' : '#e5e7eb',
                      color: isActive || isCompleted ? '#ffffff' : '#6b7280'
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </motion.div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && s.number !== 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > s.number ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()} className="p-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Account Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                          errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Login Method Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Method *
                    </label>
                    <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        className={`flex-1 py-3 text-center font-medium transition flex items-center justify-center gap-2 ${
                          loginMethod === 'email' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Mail size={18} />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('phone')}
                        className={`flex-1 py-3 text-center font-medium transition flex items-center justify-center gap-2 ${
                          loginMethod === 'phone' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Phone size={18} />
                        Phone
                      </button>
                    </div>
                  </div>

                  {/* Email or Phone Input */}
                  <AnimatePresence mode="wait">
                    {loginMethod === 'email' ? (
                      <motion.div
                        key="email-input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                              errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.email}
                          </p>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="phone-input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))}
                            placeholder="+254 7XX XXX XXX"
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                              errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.phone}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          We'll send a verification code to this number
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 8 characters"
                        className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                          errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                          errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'patient', label: 'Patient/Citizen', icon: Heart },
                        { value: 'emt', label: 'EMT/Responder', icon: Ambulance }
                      ].map(option => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                            className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
                              formData.role === option.value
                                ? 'border-red-600 bg-red-50 text-red-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                          >
                            <Icon size={24} />
                            <span className="font-medium text-sm">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Medical Information (Patients only) */}
              {step === 2 && formData.role === 'patient' && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Medical Information</h2>
                  <p className="text-gray-600 text-sm mb-4">This helps emergency responders provide better care</p>
                  
                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="blood_group"
                      value={formData.blood_group}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    >
                      <option value="">Select blood group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  {/* Allergies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="e.g., Penicillin, Peanuts, Latex"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                    />
                  </div>

                  {/* Medical Conditions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions
                    </label>
                    <textarea
                      name="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={handleChange}
                      placeholder="e.g., Diabetes, Asthma, Heart condition"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                    />
                  </div>

                  {/* Current Medications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Medications
                    </label>
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={handleChange}
                      placeholder="e.g., Insulin, Inhaler, Blood pressure medication"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Emergency Contact */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Emergency Contact</h2>
                  <p className="text-gray-600 text-sm mb-4">Someone we can contact in case of emergency</p>
                  
                  {/* Contact Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                          errors.emergency_contact_name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                        }`}
                      />
                    </div>
                    {errors.emergency_contact_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.emergency_contact_name}
                      </p>
                    )}
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: formatPhoneNumber(e.target.value) }))}
                        placeholder="+254 7XX XXX XXX"
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                          errors.emergency_contact_phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                        }`}
                      />
                    </div>
                    {errors.emergency_contact_phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.emergency_contact_phone}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-blue-800">
                      This person will be notified when you request emergency services. Make sure they are aware and available.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Subscription Plan */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        id: 'basic',
                        name: 'Basic',
                        price: 'Free',
                        period: '',
                        features: ['Pay-per-use emergency calls', 'Standard response time', 'Basic medical profile'],
                        recommended: false
                      },
                      {
                        id: 'family',
                        name: 'Family',
                        price: 'KES 4,000',
                        period: '/year',
                        features: ['Unlimited emergency calls', 'Priority dispatch', 'Family coverage (up to 5)', 'Free ambulance transport', 'Telemedicine access'],
                        recommended: true
                      },
                      {
                        id: 'premium',
                        name: 'Premium',
                        price: 'KES 8,000',
                        period: '/year',
                        features: ['Everything in Family', 'Air ambulance coverage', 'International coverage', 'Dedicated support line', 'Advanced health monitoring'],
                        recommended: false
                      }
                    ].map(plan => (
                      <div
                        key={plan.id}
                        onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
                        className={`relative p-5 rounded-xl border-2 cursor-pointer transition ${
                          formData.plan === plan.id
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {plan.recommended && (
                          <span className="absolute -top-3 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            RECOMMENDED
                          </span>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{plan.name}</h3>
                            <p className="text-2xl font-bold text-gray-900">
                              {plan.price}
                              <span className="text-sm font-normal text-gray-500">{plan.period}</span>
                            </p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.plan === plan.id ? 'border-red-600 bg-red-600' : 'border-gray-300'
                          }`}>
                            {formData.plan === plan.id && <CheckCircle2 className="text-white" size={16} />}
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle2 size={14} className="text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Terms */}
                  <div className="pt-4 border-t">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked);
                          if (errors.general) setErrors({});
                        }}
                        className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-red-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>
                        . I consent to sharing my medical information with emergency responders.
                      </span>
                    </label>
                  </div>

                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                      <AlertCircle size={16} />
                      {errors.general}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight size={20} />
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={registerMutation.isLoading || !acceptedTerms}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {registerMutation.isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <CheckCircle2 size={20} />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 font-semibold hover:text-red-700">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}