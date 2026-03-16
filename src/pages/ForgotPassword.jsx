import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  AlertCircle, CheckCircle2, Shield, KeyRound, RefreshCw,
  Timer, Send, Smartphone, Fingerprint
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';

// Step components for clean code organization
const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="flex items-center">
        <motion.div
          initial={false}
          animate={{
            backgroundColor: i + 1 <= currentStep ? '#dc2626' : '#e5e7eb',
            scale: i + 1 === currentStep ? 1.1 : 1
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            i + 1 <= currentStep ? 'text-white' : 'text-gray-500'
          }`}
        >
          {i + 1 < currentStep ? <CheckCircle2 size={20} /> : i + 1}
        </motion.div>
        {i < totalSteps - 1 && (
          <div className={`w-12 h-1 mx-2 rounded-full ${
            i + 1 < currentStep ? 'bg-red-600' : 'bg-gray-200'
          }`} />
        )}
      </div>
    ))}
  </div>
);

// Step 1: Identity Verification (Email or Phone)
const IdentityStep = ({ 
  method, setMethod, email, setEmail, phone, setPhone, 
  errors, onContinue, isLoading 
}) => {
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('254')) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 12)}`.trim();
    }
    if (cleaned.startsWith('0')) {
      return `+254 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`.trim();
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-red-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-500 mt-2">No worries, we'll help you recover your account</p>
      </div>

      {/* Method Selection */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setMethod('email')}
          className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            method === 'email' 
              ? 'bg-white text-red-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail size={18} />
          Email
        </button>
        <button
          type="button"
          onClick={() => setMethod('phone')}
          className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            method === 'phone' 
              ? 'bg-white text-red-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Phone size={18} />
          Phone
        </button>
      </div>

      {/* Input Field */}
      <AnimatePresence mode="wait">
        {method === 'email' ? (
          <motion.div
            key="email-input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-red-500'
                }`}
              />
            </div>
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle size={14} />
                {errors.email}
              </motion.p>
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
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="+254 7XX XXX XXX"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition ${
                  errors.phone 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-red-500'
                }`}
              />
            </div>
            {errors.phone && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle size={14} />
                {errors.phone}
              </motion.p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              We'll send a verification code via SMS
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        disabled={isLoading}
        className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCw className="animate-spin" size={20} />
            Verifying...
          </>
        ) : (
          <>
            Continue
            <ArrowRight size={20} />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

// Step 2: OTP Verification
const OTPStep = ({ 
  method, contact, otp, setOtp, onVerify, onResend, 
  isLoading, error, resendTimer 
}) => {
  const inputRefs = useRef([]);
  
  // Auto-focus and auto-advance
  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0]; // Only single digit
    if (!/^\d*$/.test(value)) return; // Only numbers
    
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));
    
    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(pasted.padEnd(6, ''));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Enter Verification Code</h2>
        <p className="text-gray-500 mt-2">
          We've sent a 6-digit code to<br />
          <span className="font-semibold text-gray-900">{contact}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {Array.from({ length: 6 }, (_, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            maxLength={1}
            value={otp[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-14 h-16 text-2xl font-bold text-center border-2 rounded-xl focus:outline-none transition ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'
            }`}
          />
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onVerify}
        disabled={otp.length !== 6 || isLoading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCw className="animate-spin" size={20} />
            Verifying...
          </>
        ) : (
          <>
            Verify Code
            <CheckCircle2 size={20} />
          </>
        )}
      </motion.button>

      {/* Resend Timer */}
      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-gray-500 flex items-center justify-center gap-2">
            <Timer size={16} />
            Resend code in {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}
          </p>
        ) : (
          <button
            onClick={onResend}
            className="text-red-600 font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
          >
            <Send size={16} />
            Didn't receive it? Resend
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Step 3: New Password
const NewPasswordStep = ({ 
  password, setPassword, confirmPassword, setConfirmPassword,
  onReset, isLoading, errors, strength 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Create New Password</h2>
        <p className="text-gray-500 mt-2">Make it strong and memorable</p>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters, uppercase, number"
            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition ${
              errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {/* Password Strength */}
        {password && (
          <div className="mt-3">
            <div className="flex gap-1 h-2 mb-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all ${
                    i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Strength: <span className={`font-medium ${strengthColors[strength - 1]?.replace('bg-', 'text-')}`}>
                {strengthLabels[strength - 1] || 'Too short'}
              </span>
            </p>
          </div>
        )}
        
        {errors.password && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle size={14} />
            {errors.password}
          </motion.p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition ${
              errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle size={14} />
            {errors.confirmPassword}
          </motion.p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
        <ul className="space-y-2 text-sm">
          {[
            { label: 'At least 8 characters', test: password.length >= 8 },
            { label: 'One uppercase letter', test: /[A-Z]/.test(password) },
            { label: 'One lowercase letter', test: /[a-z]/.test(password) },
            { label: 'One number', test: /\d/.test(password) },
            { label: 'One special character', test: /[!@#$%^&*]/.test(password) }
          ].map((req, i) => (
            <li key={i} className={`flex items-center gap-2 ${req.test ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle2 size={14} className={req.test ? 'opacity-100' : 'opacity-30'} />
              {req.label}
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        disabled={isLoading || strength < 3}
        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCw className="animate-spin" size={20} />
            Resetting...
          </>
        ) : (
          <>
            Reset Password
            <CheckCircle2 size={20} />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

// Step 4: Success
const SuccessStep = ({ onLogin }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-8"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
    >
      <CheckCircle2 className="text-green-600" size={48} />
    </motion.div>
    
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
      Your password has been successfully reset. You can now log in with your new password.
    </p>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onLogin}
      className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition flex items-center gap-2 mx-auto"
    >
      Go to Login
      <ArrowRight size={20} />
    </motion.button>

    <div className="mt-8 p-4 bg-blue-50 rounded-xl max-w-sm mx-auto">
      <p className="text-sm text-blue-800 flex items-start gap-2">
        <Shield size={16} className="flex-shrink-0 mt-0.5" />
        For security reasons, please don't share your password with anyone. Enable two-factor authentication for extra protection.
      </p>
    </div>
  </motion.div>
);

// Main Component
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Identity
  const [method, setMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [identityErrors, setIdentityErrors] = useState({});

  // Step 2: OTP
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [verifiedContact, setVerifiedContact] = useState('');

  // Step 3: New Password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Reset Token
  const [resetToken, setResetToken] = useState('');

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0 && step === 2) {
      const timer = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, step]);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  // API Mutations
  const requestResetMutation = useMutation({
    mutationFn: (data) => api.post('/auth/forgot-password', data),
    onSuccess: (res) => {
      setVerifiedContact(method === 'email' ? email : phone);
      setStep(2);
      setResendTimer(60);
    },
    onError: (err) => {
      setIdentityErrors({ 
        [method]: err.response?.data?.message || 'Account not found' 
      });
    }
  });

  const verifyOTPMutation = useMutation({
    mutationFn: (data) => api.post('/auth/verify-otp', data),
    onSuccess: (res) => {
      setResetToken(res.data.token);
      setStep(3);
    },
    onError: (err) => {
      setOtpError(err.response?.data?.message || 'Invalid code');
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data) => api.post('/auth/reset-password', data),
    onSuccess: () => {
      setStep(4);
    },
    onError: (err) => {
      setPasswordErrors({ general: err.response?.data?.message || 'Reset failed' });
    }
  });

  // Handlers
  const handleIdentityContinue = () => {
    const errors = {};
    if (method === 'email') {
      if (!email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email format';
    } else {
      if (!phone) errors.phone = 'Phone number is required';
      else if (phone.replace(/\D/g, '').length < 10) errors.phone = 'Invalid phone number';
    }
    
    if (Object.keys(errors).length > 0) {
      setIdentityErrors(errors);
      return;
    }

    requestResetMutation.mutate({
      [method]: method === 'email' ? email : phone.replace(/\D/g, '')
    });
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    verifyOTPMutation.mutate({
      [method]: method === 'email' ? email : phone.replace(/\D/g, ''),
      otp,
      token: resetToken
    });
  };

  const handleResendOTP = () => {
    setOtp('');
    setOtpError('');
    requestResetMutation.mutate({
      [method]: method === 'email' ? email : phone.replace(/\D/g, '')
    });
  };

  const handleResetPassword = () => {
    const errors = {};
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) errors.password = 'Must contain uppercase letter';
    if (!/\d/.test(password)) errors.password = 'Must contain a number';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    resetPasswordMutation.mutate({
      token: resetToken,
      password,
      password_confirmation: confirmPassword
    });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Back Button (except step 1 and 4) */}
        {step > 1 && step < 4 && (
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Step Indicator */}
          {step < 4 && <StepIndicator currentStep={step} totalSteps={3} />}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <IdentityStep
                key="step1"
                method={method}
                setMethod={setMethod}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                errors={identityErrors}
                onContinue={handleIdentityContinue}
                isLoading={requestResetMutation.isLoading}
              />
            )}

            {step === 2 && (
              <OTPStep
                key="step2"
                method={method}
                contact={verifiedContact}
                otp={otp}
                setOtp={setOtp}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                isLoading={verifyOTPMutation.isLoading}
                error={otpError}
                resendTimer={resendTimer}
              />
            )}

            {step === 3 && (
              <NewPasswordStep
                key="step3"
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onReset={handleResetPassword}
                isLoading={resetPasswordMutation.isLoading}
                errors={passwordErrors}
                strength={passwordStrength}
              />
            )}

            {step === 4 && (
              <SuccessStep
                key="step4"
                onLogin={() => navigate('/login')}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-red-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a href="tel:+254700000000" className="text-red-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Shield size={16} />
          <span>256-bit SSL Encrypted</span>
          <span>•</span>
          <span>PCI DSS Compliant</span>
        </div>
      </motion.div>
    </div>
  );
}