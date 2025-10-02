import React from 'react';
import ContactForm from '../components/contact/ContactForm';
import ContactOptions from '../components/contact/ContactOptions';

const ContactPage: React.FC = () => {
  return (
    <section className="py-20 bg-[#121212]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Contact Us
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-delay">
              Have questions or want to connect with Quantara? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-10">
            <ContactForm />
            <ContactOptions />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
