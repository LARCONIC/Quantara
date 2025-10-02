import React, { useEffect, useRef } from 'react';

const MissionValuesSection: React.FC = () => {
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
    
    const cards = document.querySelectorAll('.value-card');
    cards.forEach((card) => observer.observe(card));
    
    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);
  
  const values = [
    {
      title: "Innovation",
      description: "We constantly push boundaries and explore new possibilities in technology and design."
    },
    {
      title: "Excellence",
      description: "We strive for the highest quality in everything we create, from code to user experience."
    },
    {
      title: "Trust",
      description: "We build reliable, secure products that users can depend on with confidence."
    },
    {
      title: "Elegance",
      description: "We believe in the power of simplicity and refined design to enhance functionality."
    }
  ];
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-[#1A1A1A]"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Our Mission & Values
          </h2>
          <p className="text-white/70 text-lg mb-12 text-center max-w-2xl mx-auto">
            We're on a mission to pioneer intelligent digital solutions for a seamless future, guided by our core values.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="value-card opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 h-full hover:border-[#00A9FF]/30 hover:shadow-[0_0_25px_rgba(0,169,255,0.15)] transition-all duration-500">
                  <h3 className="text-xl font-semibold text-[#00A9FF] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-white/70">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionValuesSection;
