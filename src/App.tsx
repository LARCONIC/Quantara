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
      document.body.classList.remove('bg-[#121212]', 'text-white');
      if (prefersReducedMotion) {
        document.body.classList.remove('reduce-motion');
      }
    };
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="lab" element={<LabPage />} />
            <Route path="future" element={<FuturePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="readme" element={<ReadmePage />} />
          </Route>

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

          {/* Unauthorized Route */}
          <Route 
            path="/unauthorized" 
            element={
              <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                  <p className="text-gray-400 mb-4">You don't have permission to access this page.</p>
                  <button 
                    onClick={() => window.history.back()}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Go Back
                  </button>
                </div>
              </div>
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