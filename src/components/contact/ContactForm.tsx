import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
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
    
    if (formRef.current) {
      observer.observe(formRef.current);
    }
    
    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div 
      ref={formRef}
      className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-10 hover:border-[#00A9FF]/30 hover:shadow-[0_0_25px_rgba(0,169,255,0.15)] transition-all duration-500 opacity-0 translate-y-8"
    >
      <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
      
      {isSubmitted ? (
        <div className="bg-[#00A9FF]/20 border border-[#00A9FF]/50 rounded-md p-4 text-white animate-fade-in">
          Thank you for your message! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white/80 mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="w-full bg-[#121212] border border-white/10 focus:border-[#00A9FF]/50 rounded-md px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#00A9FF]/20 transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-white/80 mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="w-full bg-[#121212] border border-white/10 focus:border-[#00A9FF]/50 rounded-md px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#00A9FF]/20 transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-white/80 mb-2 text-sm">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-[#121212] border border-white/10 focus:border-[#00A9FF]/50 rounded-md px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#00A9FF]/20 transition-all resize-none"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#00A9FF]/20 hover:bg-[#00A9FF]/30 border border-[#00A9FF]/50 hover:border-[#00A9FF] text-white rounded-md transition-all duration-300 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  Send Message
                  <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
