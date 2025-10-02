import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import LabPage from './pages/LabPage';
import FuturePage from './pages/FuturePage';
import ReadmePage from './pages/ReadmePage';
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
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="lab" element={<LabPage />} />
          <Route path="future" element={<FuturePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="readme" element={<ReadmePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
