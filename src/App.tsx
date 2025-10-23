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
import EmailConfirmationPage from './pages/EmailConfirmationPage'; // Enterprise confirmation handler
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
          <Route path="/confirm" element={<EmailConfirmationPage />} /> {/* Enterprise confirmation */}

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
                <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Client Studio</h1>
                    <p className="text-gray-300">Coming Soon - Advanced client management interface</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Dashboard Route - Redirects based on role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRedirect />
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

// Component to redirect users to appropriate dashboard based on role
const DashboardRedirect: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setUserRole(profile?.role || 'client');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole('client'); // Default to client
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect based on role
  if (userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/studio" replace />;
  }
};

export default App;