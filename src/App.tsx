import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import LabPage from './pages/LabPage';
import FuturePage from './pages/FuturePage';
import ReadmePage from './pages/ReadmePage';
import AuthPage from './pages/AuthPage';
import ServicesPage from './pages/ServicesPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminSetupPage from './pages/AdminSetupPage';
import EmailConfirmPage from './pages/EmailConfirmPage';
import './App.css';

// Add custom animation classes
import './styles/animations.css';

const App: React.FC = () => {
  useEffect(() => {
    // Add class to body for global styles
    document.body.classList.add('bg-[#121212]', 'text-white');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.body.classList.add('reduce-motion');
    }
    
    return () => {
      document.body.classList.remove('bg-[#121212]', 'text-white', 'reduce-motion');
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/lab" element={<Layout><LabPage /></Layout>} />
          <Route path="/future" element={<Layout><FuturePage /></Layout>} />
          <Route path="/readme" element={<Layout><ReadmePage /></Layout>} />
          <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
          
          {/* Auth Routes (No Layout) */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin-setup" element={<AdminSetupPage />} />
          <Route path="/confirm" element={<EmailConfirmPage />} />

          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Client Dashboard - Coming Soon */}
          <Route 
            path="/studio" 
            element={
              <ProtectedRoute requiredRole="client">
                <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Client Studio</h1>
                    <p className="text-gray-400">Coming Soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Member Dashboard - Coming Soon */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="member">
                <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Member Dashboard</h1>
                    <p className="text-gray-400">Coming Soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;