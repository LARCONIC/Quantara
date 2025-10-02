import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#121212]/80 backdrop-blur-md border-b border-white/10 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center group"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent group-hover:from-[#00A9FF] group-hover:to-white/90 transition-all duration-300">
              Quantara
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Products', 'Lab', 'Future', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-white/80 hover:text-[#00A9FF] transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00A9FF] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white/90 hover:text-[#00A9FF] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-[#121212]/95 backdrop-blur-lg border-b border-white/10 transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0 overflow-hidden py-0'
        }`}
      >
        <nav className="container mx-auto px-4 flex flex-col space-y-4">
          {['Home', 'Products', 'Lab', 'Future', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="text-white/80 hover:text-[#00A9FF] py-2 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
