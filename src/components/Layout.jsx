import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance, Menu, X, ChevronDown, Phone, Shield,
  Activity, Home, LayoutDashboard,
  Users, FileText, AlertTriangle, Heart
} from 'lucide-react';

import { useAuthStore } from '../stores/authStore';
import Footer from '../components/Footer';


// =============================
// Floating Emergency SOS Button
// =============================
const EmergencySOS = () => {

  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 space-y-2"
          >

            <button
              onClick={() => navigate('/emergency?type=medical')}
              className="flex items-center gap-3 bg-white shadow-lg px-4 py-3 rounded-xl"
            >
              <Heart className="text-red-500" size={20} />
              Medical Emergency
            </button>

            <button
              onClick={() => navigate('/emergency?type=accident')}
              className="flex items-center gap-3 bg-white shadow-lg px-4 py-3 rounded-xl"
            >
              <AlertTriangle className="text-orange-500" size={20} />
              Accident / Trauma
            </button>

            <button
              onClick={() => window.location.href = 'tel:999'}
              className="flex items-center gap-3 bg-white shadow-lg px-4 py-3 rounded-xl"
            >
              <Phone className="text-blue-500" size={20} />
              Call 999
            </button>

          </motion.div>
        )}
      </AnimatePresence>


      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${
          isExpanded ? 'bg-gray-800' : 'bg-red-600'
        }`}
      >
        {isExpanded ? (
          <X className="text-white" size={28} />
        ) : (
          <Ambulance className="text-white" size={28} />
        )}
      </button>

    </div>
  );
};



// =============================
// Header
// =============================
const Header = ({ isAuthenticated, user, onLogout }) => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/emergency', label: 'Emergency', icon: AlertTriangle },
        { path: '/history', label: 'History', icon: FileText },
        { path: '/family', label: 'Family', icon: Users },
      ]
    : [
        { path: '/', label: 'Home', icon: Home },
        { path: '/about', label: 'About', icon: Shield },
        { path: '/services', label: 'Services', icon: Activity },
        { path: '/contact', label: 'Contact', icon: Phone },
      ];

  return (
    <header className="sticky top-0 bg-white border-b shadow-sm z-40">

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Ambulance className="text-white" size={22} />
          </div>

          <span className="font-bold text-lg">SwiftEMS</span>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2">

          {navLinks.map((link) => {

            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isActive(link.path)
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}

        </nav>


        {/* Right Section */}
        <div className="flex items-center gap-3">

          {isAuthenticated ? (
            <>

              {/* Profile */}
              <div className="relative">

                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2"
                >

                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center">
                    {user?.name?.charAt(0) || 'U'}
                  </div>

                  <ChevronDown size={16} />

                </button>


                <AnimatePresence>
                  {profileOpen && (

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg"
                    >

                      <div className="p-3 border-b">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50">
                        Profile
                      </Link>

                      <Link to="/settings" className="block px-4 py-2 hover:bg-gray-50">
                        Settings
                      </Link>

                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>

                    </motion.div>

                  )}
                </AnimatePresence>

              </div>

            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600">
                Sign In
              </Link>

              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>
    </header>
  );
};



// =============================
// Main Layout
// =============================
export default function Layout() {

  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const hideFooterRoutes = ['/login', '/register', '/emergency'];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (

    <div className="min-h-screen flex flex-col bg-gray-50">

      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      {!shouldHideFooter && <Footer />}

      <EmergencySOS />

    </div>
  );
}