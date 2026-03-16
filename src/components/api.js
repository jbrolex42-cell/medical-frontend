import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Emergency APIs
export const emergencyAPI = {
  create: (data) => api.post('/emergency/request', data),
  getById: (id) => api.get(`/emergency/${id}/track`),
  getHistory: () => api.get('/emergency/history'),
  cancel: (id) => api.post(`/emergency/${id}/cancel`),
  updateVitals: (data) => api.post('/emergency/vitals', data),
};

// Ambulance APIs
export const ambulanceAPI = {
  getNearby: (lat, lng) => api.get(`/ambulances/nearby?lat=${lat}&lng=${lng}`),
  getLocation: (id) => api.get(`/ambulances/${id}/location`),
};

// Hospital APIs
export const hospitalAPI = {
  getNearby: (lat, lng) => api.get(`/hospitals/nearby?lat=${lat}&lng=${lng}`),
  getBeds: (id) => api.get(`/hospitals/${id}/beds`),
  reserveBed: (id) => api.post(`/hospitals/${id}/reserve-bed`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getLiveEmergencies: () => api.get('/admin/emergencies/live'),
  getFleetStatus: () => api.get('/admin/ambulances/status'),
  getAnalytics: () => api.get('/admin/analytics'),
  getOxygenLevels: () => api.get('/admin/oxygen-levels'),
  broadcastAlert: (data) => api.post('/admin/broadcast-alert', data),
};

// Payment/Subscription APIs
export const paymentAPI = {
  getStatus: () => api.get('/subscription/status'),
  create: (data) => api.post('/subscription/create', data),
  processPayment: (data) => api.post('/subscription/pay', data),
  verifySHA: (data) => api.post('/sha/verify', data),
  submitClaim: (data) => api.post('/sha/claim', data),
};

// Telemedicine APIs
export const telemedicineAPI = {
  getSession: (id) => api.get(`/telemedicine/${id}`),
  initiate: (data) => api.post('/telemedicine/initiate', data),
  join: (id) => api.post(`/telemedicine/${id}/join`),
  end: (id) => api.post(`/telemedicine/${id}/end`),
};

// AI APIs
export const aiAPI = {
  triage: (data) => api.post('/ai/triage', data),
  voiceEmergency: (data) => api.post('/ai/voice-emergency', data),
};

export default api;