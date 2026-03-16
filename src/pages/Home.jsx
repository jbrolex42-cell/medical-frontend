import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Ambulance, Heart, Clock, MapPin, Shield, Phone, 
  ChevronRight, Star, Users, Activity, Brain, 
  Globe, Award, CheckCircle2, ArrowRight, Menu, X,
  Play, Pause, Zap, Droplets, Thermometer, Stethoscope,
  Baby, Bone, Flame, Wind, AlertTriangle, Car
       } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Footer from '../components/Footer';

const AnimatedCounter = ({ target, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const EmergencyTypeCard = ({ icon: Icon, title, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className={`p-6 rounded-2xl bg-white shadow-lg border-l-4 ${color} cursor-pointer group`}
  >
    <div className={`w-14 h-14 rounded-xl ${color.replace('border-', 'bg-').replace('500', '100')} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
      <Icon className={color.replace('border-', 'text-')} size={28} />
    </div>
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">24/7 emergency response with specialized equipment</p>
  </motion.div>
);

// Testimonial Card
const TestimonialCard = ({ name, role, content, rating, image }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white p-6 rounded-2xl shadow-lg"
  >
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
      ))}
    </div>
    <p className="text-gray-700 mb-4 italic">"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
        {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : <Users className="w-full h-full p-3 text-gray-400" />}
      </div>
      <div>
        <p className="font-bold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </motion.div>
);

// Feature Row
const FeatureRow = ({ icon: Icon, title, description, reverse = false }) => (
  <motion.div
    initial={{ opacity: 0, x: reverse ? 50 : -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}
  >
    <div className="flex-1">
      <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="text-red-600" size={40} />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
      <button className="mt-6 text-red-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all">
        Learn more <ArrowRight size={20} />
      </button>
    </div>
    <div className="flex-1">
      <div className="bg-gray-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl flex items-center justify-center">
          <Icon className="text-white" size={80} />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  
  const stats = [
    { value: 50000, suffix: '+', label: 'Emergencies Handled', icon: Heart },
    { value: 8, suffix: ' min', label: 'Avg Response Time', icon: Clock },
    { value: 98, suffix: '%', label: 'Patient Satisfaction', icon: Star },
    { value: 150, suffix: '+', label: 'Ambulances', icon: Ambulance },
  ];

  const emergencyTypes = [
    { icon: Heart, title: 'Cardiac Emergency', color: 'border-red-500', delay: 0 },
    { icon: Bone, title: 'Trauma & Accidents', color: 'border-orange-500', delay: 0.1 },
    { icon: Baby, title: 'Pediatric Emergency', color: 'border-pink-500', delay: 0.2 },
    { icon: Brain, title: 'Neurological', color: 'border-purple-500', delay: 0.3 },
    { icon: Flame, title: 'Burns & Fire', color: 'border-yellow-500', delay: 0.4 },
    { icon: Wind, title: 'Respiratory', color: 'border-blue-500', delay: 0.5 },
  ];

  const testimonials = [
    {
      name: "Sarah Kimani",
      role: "Patient - Nairobi",
      content: "The ambulance arrived in 6 minutes when my husband had a heart attack. The EMTs were incredibly professional and saved his life.",
      rating: 5
    },
    {
      name: "Dr. James Ochieng",
      role: "Emergency Physician",
      content: "This system has revolutionized how we receive patients. Real-time vitals and GPS tracking mean we're prepared before arrival.",
      rating: 5
    },
    {
      name: "Mary Wanjiku",
      role: "Mother of 3",
      content: "The pediatric emergency team was amazing with my son's asthma attack. They even followed up the next day.",
      rating: 5
    }
  ];

  const handleEmergencyClick = () => {
    if (isAuthenticated) {
      navigate('/emergency');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header (appears on scroll) */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Ambulance className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl text-gray-900">EMERGENCY MEDICAL SERVICE</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-red-600 font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-red-600 font-medium">How It Works</a>
            <a href="#emergencies" className="text-gray-600 hover:text-red-600 font-medium">Emergency Types</a>
            <a href="#testimonials" className="text-gray-600 hover:text-red-600 font-medium">Testimonials</a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                <Users size={18} />
                My Account
              </button>
            ) : (
              <>
                <Link to="/login" className="hidden md:block text-gray-600 font-medium hover:text-red-600">Sign In</Link>
                <Link to="/register" className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition">
                  Get Started
                </Link>
              </>
            )}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-40 pt-20 px-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-lg font-medium py-3 border-b" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-lg font-medium py-3 border-b" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#emergencies" className="text-lg font-medium py-3 border-b" onClick={() => setMobileMenuOpen(false)}>Emergency Types</a>
              <Link to="/login" className="text-lg font-medium py-3 border-b" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="bg-red-600 text-white py-3 rounded-lg font-medium text-center" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-blue-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-32 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              Now serving all of Kenya
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Emergency Care <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                When Seconds Matter
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Kenya's most advanced emergency medical system. AI-powered dispatch, real-time tracking, and specialist care at your fingertips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEmergencyClick}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-red-200 hover:shadow-xl transition"
              >
                <AlertTriangle size={24} />
                Request Emergency
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveVideo(true)}
                className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:border-red-200 hover:bg-red-50 transition"
              >
                <Play size={24} className="text-red-600" />
                Watch How It Works
              </motion.button>
            </div>

            <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="text-green-500" size={18} />
                <span>SHA Accredited</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={18} />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="text-green-500" size={18} />
                <span>Nationwide Coverage</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              {/* Live Map Preview */}
              <div className="bg-gray-100 rounded-2xl h-80 mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                
                {/* Animated Ambulance */}
                <motion.div
                  animate={{ 
                    x: [0, 100, 100, 0, 0],
                    y: [0, 0, 50, 50, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Ambulance className="text-white" size={24} />
                </motion.div>

                {/* Pulse rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 2, 2, 1], opacity: [0.5, 0, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-red-500 rounded-full"
                  />
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Nearest Ambulance</p>
                      <p className="font-bold text-gray-900">3.2 km away</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">ETA</p>
                      <p className="font-bold text-red-600">6 min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">8.2</p>
                  <p className="text-xs text-gray-500">min avg response</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">150+</p>
                  <p className="text-xs text-gray-500">ambulances</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-xs text-gray-500">survival rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <Icon className="mx-auto mb-4 text-red-500" size={40} />
                  <p className="text-4xl md:text-5xl font-bold mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Types Section */}
      <section id="emergencies" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Emergency Types We Handle</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized response teams equipped for every medical emergency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyTypes.map((type, idx) => (
              <EmergencyTypeCard key={idx} {...type} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/emergency-types" 
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-4 transition-all"
            >
              View all 30+ emergency types <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How SwiftEMS Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to life-saving care</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Request Help',
                description: 'Tap the emergency button or call 999. Our AI triage system immediately assesses your situation.',
                icon: Phone,
                color: 'bg-red-100 text-red-600'
              },
              {
                step: '02',
                title: 'Smart Dispatch',
                description: 'GPS tracking finds the nearest equipped ambulance. Real-time updates on arrival time.',
                icon: MapPin,
                color: 'bg-blue-100 text-blue-600'
              },
              {
                step: '03',
                title: 'Expert Care',
                description: 'Specialized EMTs arrive prepared. Direct hospital integration for seamless handoff.',
                icon: Heart,
                color: 'bg-green-100 text-green-600'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative"
                >
                  <div className="text-8xl font-bold text-gray-100 absolute -top-4 -left-4">
                    {item.step}
                  </div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          <FeatureRow 
            icon={Brain}
            title="AI-Powered Triage"
            description="Our machine learning system analyzes symptoms, vital signs, and medical history to prioritize emergencies and predict resource needs. Critical cases get instant priority dispatch."
          />
          <FeatureRow 
            icon={MapPin}
            title="Real-Time GPS Tracking"
            description="Watch your ambulance approach in real-time. Smart routing considers traffic, road conditions, and hospital capacity to ensure the fastest possible response."
            reverse
          />
          <FeatureRow 
            icon={Shield}
            title="Blockchain Medical Records"
            description="Your medical history is encrypted and secured on the blockchain. EMTs access critical information instantly—allergies, medications, conditions—saving precious minutes."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lives We've Touched</h2>
            <p className="text-xl text-gray-600">Real stories from real people</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready When You Need Us</h2>
          <p className="text-xl mb-8 text-red-100">
            Join 50,000+ Kenyans who trust SwiftEMS for emergency care. 
            Download the app or create your account today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition"
            >
              Create Free Account
            </button>
            <a 
              href="tel:999"
              className="bg-red-700 text-white border-2 border-red-400 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-800 transition flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call 999
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-red-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Free registration
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> No hidden fees
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Ambulance className="text-white" size={24} />
              </div>
              <span className="font-bold text-xl text-white">EMS</span>
            </div>
            <p className="text-sm leading-relaxed">
              Kenya's most trusted emergency medical services platform. 
              Available 24/7, nationwide.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/emergency" className="hover:text-white transition">Request Emergency</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
              <li><a href="#" className="hover:text-white transition">Download App</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Emergency Types</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Cardiac Emergency</a></li>
              <li><a href="#" className="hover:text-white transition">Trauma & Accidents</a></li>
              <li><a href="#" className="hover:text-white transition">Pediatric Care</a></li>
              <li><a href="#" className="hover:text-white transition">View All</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={14} /> Emergency: 999
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} /> Support: 0757751980
              </li>
              <li>JBROLEX42@GMAIL.COM</li>
              <li>Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Data Protection</a>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(false)}
          >
            <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full aspect-video flex items-center justify-center">
              <p className="text-gray-500">Video Player Placeholder</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
