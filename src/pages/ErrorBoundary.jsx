import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log to error tracking service (Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    // Could send to backend
    // fetch('/api/log-error', { method: 'POST', body: JSON.stringify({ error: error.toString(), stack: errorInfo.componentStack }) });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={40} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
            <p className="text-gray-500 mb-6">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>

            {this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-mono text-gray-600 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRefresh}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition"
              >
                <RefreshCw size={20} />
                Try Again
              </button>
              
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                <Home size={20} />
                Go to Homepage
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-3">Need immediate assistance?</p>
              <a 
                href="tel:999"
                className="inline-flex items-center gap-2 text-red-600 font-medium hover:underline"
              >
                <Phone size={18} />
                Call Emergency Services (999)
              </a>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;