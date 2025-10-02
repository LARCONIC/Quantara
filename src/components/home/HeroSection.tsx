import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the hero section
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      // Apply subtle parallax effect to the background
      heroRef.current.style.setProperty('--mouse-x', `${x}`);
      heroRef.current.style.setProperty('--mouse-y', `${y}`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at calc(50% + calc(var(--mouse-x, 0.5) * 40px)) calc(50% + calc(var(--mouse-y, 0.5) * 40px)), rgba(0, 169, 255, 0.15), transparent 50%)'
      }}
    >
      {/* Particles background */}
      <div className="absolute inset-0 z-0">
        {/* This would be replaced with a proper particles implementation */}
        <div className="particles-container"></div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo animation container */}
          <div className="mb-6 inline-block">
            <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent animate-fade-in">
              Quantara
            </div>
          </div>
          
          {/* Tagline with animation */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 mb-8 animate-slide-up">
            <span className="inline-block">Innovate.</span>{' '}
            <span className="inline-block">Build.</span>{' '}
            <span className="inline-block">Elevate.</span>
          </h1>
          
          {/* Brief description */}
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto animate-fade-in-delay">
            A future-first tech company crafting intuitive solutions that redefine human-computer interaction.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-longer">
            <a 
              href="/products" 
              className="px-6 py-3 bg-[#00A9FF]/20 hover:bg-[#00A9FF]/30 border border-[#00A9FF]/50 hover:border-[#00A9FF] text-white rounded-md transition-all duration-300 flex items-center group"
            >
              View Products
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/about" 
              className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white/90 hover:text-white rounded-md transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      {/* Glassmorphism decorative elements */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#00A9FF]/10 backdrop-blur-xl border border-[#00A9FF]/20 animate-float"></div>
      <div className="absolute top-20 -right-20 w-60 h-60 rounded-full bg-[#00A9FF]/5 backdrop-blur-xl border border-[#00A9FF]/10 animate-float-slow"></div>
    </section>
  );
};

export default HeroSection;
