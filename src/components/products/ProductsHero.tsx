import React, { useEffect, useRef } from 'react';

const ProductsHero: React.FC = () => {
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
      className="relative py-20 md:py-32 flex items-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at calc(50% + calc(var(--mouse-x, 0.5) * 40px)) calc(50% + calc(var(--mouse-y, 0.5) * 40px)), rgba(0, 169, 255, 0.15), transparent 50%)'
      }}
    >
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Our Products
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto animate-fade-in-delay">
            Explore Quantara's ecosystem of innovative digital solutions designed to enhance creativity and productivity.
          </p>
        </div>
      </div>
      
      {/* Glassmorphism decorative elements */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#00A9FF]/10 backdrop-blur-xl border border-[#00A9FF]/20 animate-float"></div>
      <div className="absolute top-20 -right-20 w-60 h-60 rounded-full bg-[#00A9FF]/5 backdrop-blur-xl border border-[#00A9FF]/10 animate-float-slow"></div>
    </section>
  );
};

export default ProductsHero;
