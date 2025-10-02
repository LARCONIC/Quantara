import React, { useEffect } from 'react';
import { Briefcase, Lightbulb } from 'lucide-react';

const ContactOptions: React.FC = () => {
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
    
    const cards = document.querySelectorAll('.option-card');
    cards.forEach((card) => observer.observe(card));
    
    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        className="option-card opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 h-full hover:border-[#00A9FF]/30 hover:shadow-[0_0_25px_rgba(0,169,255,0.15)] transition-all duration-500">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-[#00A9FF]/20 flex items-center justify-center mr-3">
              <Briefcase className="w-5 h-5 text-[#00A9FF]" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Work with Us
            </h3>
          </div>
          <p className="text-white/70 mb-4">
            Interested in collaborating with Quantara on a project? We're always open to partnerships and opportunities to create something amazing together.
          </p>
          <a 
            href="mailto:yourancient0@gmail.com" 
            className="text-[#00A9FF] hover:text-white transition-colors"
          >
           yourancient0@gmail.com
          </a>
        </div>
      </div>
      
      <div 
        className="option-card opacity-0 translate-y-8 transition-all duration-700 delay-100 ease-out"
      >
        <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 h-full hover:border-[#00A9FF]/30 hover:shadow-[0_0_25px_rgba(0,169,255,0.15)] transition-all duration-500">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-[#00A9FF]/20 flex items-center justify-center mr-3">
              <Lightbulb className="w-5 h-5 text-[#00A9FF]" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Have a Startup Idea?
            </h3>
          </div>
          <p className="text-white/70 mb-4">
            Got an innovative tech concept you'd like to discuss? We're always excited to hear about new ideas and potential ventures in the digital space.
          </p>
          <a 
            href="mailto:yourancient0@gmail.com" 
            className="text-[#00A9FF] hover:text-white transition-colors"
          >
            yourancient0@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactOptions;
