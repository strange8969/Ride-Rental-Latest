import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare, Send, CheckCircle, MapPin, Clock } from 'lucide-react';
import { createContactMessage } from '../lib/supabase';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit phone number or leave it empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting contact form data:', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });
      
      await createContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      const errorMessage = err?.message || 'Unknown error';
      setError(`Failed to send message: ${errorMessage}`);
      console.error('Contact form error details:', err);
      
      // Add specific handling for common Supabase errors
      if (errorMessage.includes('relation "contacts" does not exist')) {
        setError('The contacts table does not exist in the database. Please create it first.');
      } else if (errorMessage.includes('permission denied')) {
        setError('Permission denied. Please check your database policies.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-green-400 mb-2">Message Sent Successfully!</h3>
          <p className="text-gray-300 mb-4">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="inline mr-2" size={16} />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors disabled:opacity-50"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="inline mr-2" size={16} />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors disabled:opacity-50"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        {/* Phone and Subject Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Phone className="inline mr-2" size={16} />
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors disabled:opacity-50"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MessageSquare className="inline mr-2" size={16} />
              Subject *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors disabled:opacity-50"
              required
            >
              <option value="">Select a subject</option>
              <option value="Bike Rental Inquiry">Bike Rental Inquiry</option>
              <option value="Booking Support">Booking Support</option>
              <option value="Pricing Information">Pricing Information</option>
              <option value="Technical Support">Technical Support</option>
              <option value="General Question">General Question</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MessageSquare className="inline mr-2" size={16} />
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            disabled={isSubmitting}
            rows={5}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors disabled:opacity-50 resize-none"
            placeholder="Enter your message here..."
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-black disabled:text-gray-400 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2" size={20} />
              Send Message
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          * Required fields. We'll respond to your message within 24 hours.
        </p>
      </form>
    </div>
  );
};

// Main Contact Page Component
const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about our rental services? Need assistance with a booking?
            Our team is here to help you. Reach out to us using any of the methods below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />
          
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-500 p-3 rounded-lg">
                    <Phone className="text-gray-900" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Phone</h3>
                    <a 
                      href="https://wa.me/918827326825?text=Hello,%20I%20would%20like%20to%20inquire%20about%20bike%20rentals." 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                    >
                      +91 8827326825
                    </a>
                    <p className="text-xs text-gray-500 mt-1">All days, 9am-9pm</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-500 p-3 rounded-lg">
                    <Mail className="text-gray-900" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Email</h3>
                    <a 
                      href="mailto:riderental68@gmail.com" 
                      className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                    >
                      riderental68@gmail.com
                    </a>
                    <p className="text-xs text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-500 p-3 rounded-lg">
                    <MapPin className="text-gray-900" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Location</h3>
                    <p className="text-gray-400">VIT Bhopal, Kothri Kalan, Sehore, Madhya Pradesh</p>
                    <p className="text-xs text-gray-500 mt-1">Visit our rental office</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-500 p-3 rounded-lg">
                    <Clock className="text-gray-900" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Business Hours</h3>
                    <p className="text-gray-400">All Days: 9:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Find Us</h2>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.8661435195624!2d77.2342!3d23.2884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c42de6c4b7c85%3A0x5c4ab5b2b3b8b9c!2sVIT%20Bhopal%2C%20Kothri%20Kalan%2C%20Sehore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1629556234334!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy"
                  title="VIT Bhopal Location Map"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;