import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Ambulance, Phone, Mail, MapPin, Clock, Heart, ArrowUp, CheckCircle 
} from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-gray-900 text-gray-400 p-8">
      {/* Emergency Contact */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gray-800 p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <Phone size={24} className="text-red-600" />
          <div>
            <p>24/7 Emergency Hotline</p>
            <a href="tel:999" className="text-white font-bold text-xl hover:text-red-400">999</a>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="tel:+254700000000" className="hover:text-white transition">+254 700 000 000</a>
          <a href="tel:+254711111111" className="hover:text-white transition">+254 711 111 111</a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
        <div>
          <h4 className="text-white font-bold mb-2">Emergency Services</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/emergency" className="hover:text-red-400">Request Ambulance</Link></li>
            <li><Link to="/track" className="hover:text-red-400">Track Emergency</Link></li>
            <li><Link to="/telemedicine" className="hover:text-red-400">Telemedicine</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Company</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/about" className="hover:text-red-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-red-400">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Resources</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/blog" className="hover:text-red-400">Blog</Link></li>
            <li><Link to="/help" className="hover:text-red-400">Help Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/privacy" className="hover:text-red-400">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-red-400">Terms</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-6 gap-4">
        <div className="text-sm text-center md:text-left">
          <p>
            &copy; {new Date().getFullYear()} EMS. Made with <Heart size={14} className="inline text-red-500" /> in Nairobi.
          </p>
          <p className="font-bold text-gray-200 uppercase tracking-widest mt-1">ROLEX</p>
        </div>

        {/* Social Links Added Here */}
        <div className="flex items-center gap-3">
          {/* WhatsApp */}
          <a 
            href="https://wa.me/254757751980"
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition text-sm"
          >
            Chat on WhatsApp
          </a>
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/irolex0?igsh=MTZ6NmlwamNidmE0NQ=="
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-medium transition text-sm"
          >
            Instagram
          </a>
        </div>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-8 right-8 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700 transition z-50 shadow-lg"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}