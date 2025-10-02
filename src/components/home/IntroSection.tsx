import React, { useEffect, useRef } from 'react';

const IntroSection: React.FC = () => {
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
              About <span className="text-[#00A9FF]">Quantara</span>
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              Quantara is a future-first tech company dedicated to creating innovative digital products that blend cutting-edge technology with elegant design. We believe in building tools that not only solve problems but elevate the human experience.
            </p>
            <p className="text-white/80 leading-relaxed">
              Our mission is to pioneer intelligent digital solutions for a seamless future, where technology empowers and inspires with trust and sophistication. From creative tools like MemeChakra to upcoming innovations in AI and automation, we're committed to shaping tomorrow's technology today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
