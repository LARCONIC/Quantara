import React, { useEffect, useRef } from 'react';

const VisionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-[#121212] opacity-0 translate-y-8 transition-all duration-700 ease-out"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Vision
          </h2>
          <div className="text-2xl md:text-3xl font-light text-white/80 mb-10 space-y-6">
            <p>
              <span className="text-[#00A9FF]">Future.</span> 
              <span className="mx-3">•</span>
              <span className="text-[#00A9FF]">Innovation.</span>
              <span className="mx-3">•</span>
              <span className="text-[#00A9FF]">Simplicity.</span>
            </p>
          </div>
          <p className="text-white/70 text-lg mb-6 max-w-2xl mx-auto">
            At Quantara, we envision a world where technology seamlessly enhances human potential, where innovation is accessible, and where digital experiences are both powerful and elegantly simple.
          </p>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            We're building the future of digital interaction—one product at a time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
