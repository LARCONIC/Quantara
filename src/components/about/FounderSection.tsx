import React, { useEffect, useRef } from 'react';

const FounderSection: React.FC = () => {
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-10 hover:border-[#00A9FF]/30 hover:shadow-[0_0_25px_rgba(0,169,255,0.15)] transition-all duration-500">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Founder's Note
            </h2>
            <blockquote className="text-white/80 mb-6 leading-relaxed italic">
              "I founded Quantara with a vision to create technology that feels like magic—powerful yet intuitive, advanced yet accessible. Our journey is about crafting digital experiences that don't just solve problems but elevate how we interact with the digital world."
            </blockquote>
            <p className="text-white/70 leading-relaxed">
              My dream is to build a company that stands at the intersection of innovation and elegance, where cutting-edge technology meets thoughtful design. With Quantara, we're not just building products; we're shaping a future where technology enhances human potential in seamless, beautiful ways.
            </p>
            <div className="mt-6 flex justify-end">
              <div className="text-[#00A9FF] font-medium">
             Larconic — Founder, Quantara
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
