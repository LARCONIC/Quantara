import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] border-t border-white/10 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and brief description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Quantara
              </span>
            </Link>
            <p className="text-white/60 text-sm">
              Innovate. Build. Elevate.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Products', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-white/60 hover:text-[#00A9FF] transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white/60 hover:text-[#00A9FF] transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="md:col-span-1">
            <h3 className="text-white font-medium mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://github.com/LARCONIC" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#00A9FF] transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.instagram.com/quantara.25?igsh=MTkyenY0cTZydW5tNA==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#00A9FF] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/quantara-l/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#00A9FF] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <p className="text-white/60 text-sm">
              <a 
                href="mailto:yourancient0@gmail.com" 
                className="hover:text-[#00A9FF] transition-colors"
              >
                yourancient0@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            © {currentYear} Quantara. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
