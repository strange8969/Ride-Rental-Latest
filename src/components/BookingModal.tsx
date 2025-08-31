import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { supabase, type BookingInsert, type WeeklyBookingInsert } from '../lib/supabase';

interface BookingData {
  category: string;
  model: string;
  pricePerDay: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData | null;
}

interface FormData {
  name: string;
  contact: string;
  address: string;
  days: number;
  bookingType: 'daily' | 'weekly';
  weeks: number;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
  address?: string;
  days?: string;
  weeks?: string;
  pickupDate?: string;
  returnDate?: string;
  pickupTime?: string;
  returnTime?: string;
}

type BookingStep = 'form' | 'thank-you';

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, bookingData }) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    address: '',
    days: 1,
    bookingType: 'daily',
    weeks: 1,
    pickupDate: '',
    returnDate: '',
    pickupTime: '09:00',
    returnTime: '18:00'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus management and escape key handling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('form');
      setFormData({ name: '', contact: '', address: '', days: 1, bookingType: 'daily', weeks: 1, pickupDate: '', returnDate: '', pickupTime: '09:00', returnTime: '18:00' });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation: 2-60 chars, letters and spaces only
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 60) {
      newErrors.name = 'Name must be less than 60 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Contact validation: 10 digits or +91 + 10 digits
    const contactClean = formData.contact.replace(/\s+/g, '');
    if (!contactClean) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^(\+91)?[6-9]\d{9}$/.test(contactClean)) {
      newErrors.contact = 'Enter a valid 10-digit Indian mobile number';
    }

    // Address validation: minimum 10 characters
    if (!formData.address.trim()) {
      newErrors.address = 'Pickup address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    // Days validation for daily bookings: must be a positive number between 1 and 30
    if (formData.bookingType === 'daily') {
      if (!formData.days || formData.days < 1) {
        newErrors.days = 'Number of days must be at least 1';
      } else if (formData.days > 30) {
        newErrors.days = 'Maximum rental period is 30 days';
      }
    }

    // Weeks validation for weekly bookings: must be a positive number between 1 and 12
    if (formData.bookingType === 'weekly') {
      if (!formData.weeks || formData.weeks < 1) {
        newErrors.weeks = 'Number of weeks must be at least 1';
      } else if (formData.weeks > 12) {
        newErrors.weeks = 'Maximum weekly rental period is 12 weeks';
      }

      // Pickup date validation for weekly bookings
      if (!formData.pickupDate) {
        newErrors.pickupDate = 'Pickup date is required for weekly bookings';
      } else {
        const pickupDate = new Date(formData.pickupDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (pickupDate < today) {
          newErrors.pickupDate = 'Pickup date cannot be in the past';
        }
      }

      // Return date validation for weekly bookings
      if (!formData.returnDate) {
        newErrors.returnDate = 'Return date is required for weekly bookings';
      } else if (formData.pickupDate) {
        const pickupDate = new Date(formData.pickupDate);
        const returnDate = new Date(formData.returnDate);
        
        if (returnDate <= pickupDate) {
          newErrors.returnDate = 'Return date must be after pickup date';
        }
        
        // Check if the date range matches the selected weeks (approximately)
        const daysDifference = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
        const expectedDays = formData.weeks * 7;
        
        if (Math.abs(daysDifference - expectedDays) > 2) {
          newErrors.returnDate = `Return date should be approximately ${expectedDays} days after pickup date for ${formData.weeks} week${formData.weeks > 1 ? 's' : ''}`;
        }
      }
    }

    // Date and time validation for daily bookings
    if (formData.bookingType === 'daily') {
      // Pickup date validation
      if (!formData.pickupDate) {
        newErrors.pickupDate = 'Pickup date is required';
      } else {
        const pickupDate = new Date(formData.pickupDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (pickupDate < today) {
          newErrors.pickupDate = 'Pickup date cannot be in the past';
        }
      }

      // Return date validation (auto-calculated, so mainly check consistency)
      if (!formData.returnDate && formData.pickupDate && formData.days) {
        newErrors.returnDate = 'Return date calculation error - please check pickup date and days';
      } else if (formData.pickupDate && formData.returnDate) {
        const pickupDate = new Date(formData.pickupDate);
        const returnDate = new Date(formData.returnDate);
        
        if (returnDate < pickupDate) {
          newErrors.returnDate = 'Return date cannot be before pickup date';
        }
        
        // Verify the auto-calculated return date matches the expected days
        const daysDifference = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDifference !== formData.days) {
          // Auto-fix the return date if there's a mismatch
          const correctedReturnDate = new Date(pickupDate);
          correctedReturnDate.setDate(correctedReturnDate.getDate() + formData.days);
          // Note: This will be fixed by the auto-calculation, so we don't need to show an error
        }
      }

      // Pickup time validation
      if (!formData.pickupTime) {
        newErrors.pickupTime = 'Pickup time is required';
      }

      // Return time validation
      if (!formData.returnTime) {
        newErrors.returnTime = 'Return time is required';
      }

      // Time logic validation for same-day rentals
      if (formData.pickupDate && formData.returnDate && formData.pickupTime && formData.returnTime) {
        const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
        const returnDateTime = new Date(`${formData.returnDate}T${formData.returnTime}`);
        
        if (returnDateTime <= pickupDateTime) {
          newErrors.returnTime = 'Return time must be after pickup time';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToSupabase = async (payload: BookingInsert): Promise<boolean> => {
    try {
      console.log('Connecting to Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Full payload being sent to Supabase:', payload);

      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Missing Supabase environment variables');
        throw new Error('Missing Supabase environment variables. Check your .env file.');
      }

      const bookingPayload: any = {
        name: payload.name,
        contact: payload.contact,
        address: payload.address,
        category: payload.category,
        model: payload.model,
        price_per_day: payload.price_per_day,
        status: payload.status || 'pending',
        rental_type: payload.rental_type || 'daily'
      };

      if (payload.days !== undefined) {
        bookingPayload.days = payload.days;
      }
      
      if (payload.total_price !== undefined) {
        bookingPayload.total_price = payload.total_price;
      }

      // Add date and time fields if they exist
      if (payload.pickup_date) {
        bookingPayload.pickup_date = payload.pickup_date;
      }
      
      if (payload.return_date) {
        bookingPayload.return_date = payload.return_date;
      }
      
      if (payload.pickup_time) {
        bookingPayload.pickup_time = payload.pickup_time;
      }
      
      if (payload.return_time) {
        bookingPayload.return_time = payload.return_time;
      }

      console.log('Supabase client initialized with URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Submitting booking payload:', bookingPayload);

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select();

      if (error) {
        console.error('❌ Supabase insertion error details:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Full error object:', error);
        
        // Alert user with detailed error for debugging
        alert(`Supabase Error: ${error.message}\nCode: ${error.code}\nDetails: ${error.details || 'None'}`);
        return false;
      }

      console.log('✅ Booking saved successfully to Supabase:', data);
      return true;
    } catch (error) {
      console.error('Error submitting to Supabase:', error);
      return false;
    }
  };

  const submitWeeklyBookingToSupabase = async (payload: WeeklyBookingInsert): Promise<boolean> => {
    try {
      console.log('Connecting to Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Full weekly booking payload being sent to Supabase:', payload);

      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Missing Supabase environment variables');
        throw new Error('Missing Supabase environment variables. Check your .env file.');
      }

      console.log('Supabase client initialized with URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Submitting weekly booking payload:', payload);

      const { data, error } = await supabase
        .from('weekly_bookings')
        .insert([payload])
        .select();

      if (error) {
        console.error('❌ Weekly booking Supabase insertion error details:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Full error object:', error);
        
        // Alert user with detailed error for debugging
        alert(`Weekly Booking Supabase Error: ${error.message}\nCode: ${error.code}\nDetails: ${error.details || 'None'}`);
        return false;
      }

      console.log('✅ Weekly booking saved successfully to Supabase:', data);
      return true;
    } catch (error) {
      console.error('Error submitting weekly booking to Supabase:', error);
      return false;
    }
  };

  const submitToGoogleForm = async (payload: any): Promise<boolean> => {
    try {
      await fetch('https://script.google.com/macros/s/AKfycbxJQsVLGK7qgJ1bm9Ag0AEBL09pHf06vpjV7ZjnFYdNKM8y9HUhlQAnXwwG4gM-OCSs/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting to Google Form:', error);
      return false;
    }
  };

  const calculatePrice = () => {
    if (!bookingData) return { pricePerDay: 0, totalPrice: 0, discount: false, weeklyDiscount: false, originalPrice: 0, savings: 0 };
    
    let pricePerDay = bookingData.pricePerDay;
    let totalPrice = 0;
    let discount = false;
    let weeklyDiscount = false;
    let originalPrice = 0;
    let savings = 0;
    
    if (formData.bookingType === 'weekly') {
      // Weekly booking calculations
      const daysInWeeks = formData.weeks * 7;
      originalPrice = pricePerDay * daysInWeeks;
      
      // Apply 35% weekly discount
      weeklyDiscount = true;
      totalPrice = Math.round(originalPrice * 0.65); // 35% off
      savings = originalPrice - totalPrice;
    } else {
      // Daily booking calculations
      totalPrice = pricePerDay * formData.days;
      originalPrice = totalPrice;
      
      // Apply 10% discount for Pulsar bikes when booked for exactly 24 hours (1 day)
      if (formData.days === 1 && 
          (bookingData.model.includes('Pulsar 150') || 
           bookingData.model.includes('Pulsar 125'))) {
        discount = true;
        totalPrice = Math.round(totalPrice * 0.9); // 10% off
        savings = originalPrice - totalPrice;
      }
    }
    
    return { pricePerDay, totalPrice, discount, weeklyDiscount, originalPrice, savings };
  };

  const storeBookingLocally = (payload: any) => {
    try {
      const existingBookings = JSON.parse(localStorage.getItem('pendingBookings') || '[]');
      
      const bookingWithTimestamp = {
        ...payload,
        savedAt: new Date().toISOString(),
        id: `local-${Date.now()}`
      };
      
      existingBookings.push(bookingWithTimestamp);
      localStorage.setItem('pendingBookings', JSON.stringify(existingBookings));
      
      console.log('Booking saved to localStorage as fallback');
      return true;
    } catch (err) {
      console.error('Failed to save booking to localStorage:', err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !bookingData) return;

    // Directly submit the booking
    await submitBooking();
  };

  const submitBooking = async () => {
    if (!bookingData) return;
    
    setIsSubmitting(true);
    
    const { pricePerDay, totalPrice, originalPrice, savings } = calculatePrice();
    let successfulSubmission = false;

    try {
      if (formData.bookingType === 'weekly') {
        // Weekly booking submission
        const weeklyPayload: WeeklyBookingInsert = {
          name: formData.name.trim(),
          contact: formData.contact.replace(/\s+/g, ''),
          address: formData.address.trim(),
          category: bookingData.category,
          model: bookingData.model,
          price_per_day: pricePerDay,
          weeks: formData.weeks,
          total_weeks_price: totalPrice,
          weekly_discount_percent: 35,
          original_price: originalPrice,
          savings: savings,
          status: 'pending',
          pickup_date: formData.pickupDate,
          return_date: formData.returnDate
        };

        console.log('Weekly Booking Payload:', weeklyPayload);
        console.log('Attempting to submit weekly booking to Supabase...');
        
        const supabaseSuccess = await submitWeeklyBookingToSupabase(weeklyPayload);
        
        if (supabaseSuccess) {
          console.log('✅ Weekly booking submitted to Supabase successfully!');
          successfulSubmission = true;
        } else {
          console.log('❌ Weekly booking Supabase submission failed, saving to localStorage...');
          const localStorageSuccess = storeBookingLocally({
            ...weeklyPayload,
            bookingType: 'weekly',
            timestamp: new Date().toISOString()
          });
          
          if (localStorageSuccess) {
            console.log('✅ Weekly booking saved to localStorage successfully!');
            successfulSubmission = true;
          }
        }
      } else {
        // Daily booking submission (existing logic)
        const supabasePayload: BookingInsert = {
          name: formData.name.trim(),
          contact: formData.contact.replace(/\s+/g, ''),
          address: formData.address.trim(),
          category: bookingData.category,
          model: bookingData.model,
          price_per_day: pricePerDay,
          days: formData.days,
          total_price: totalPrice,
          status: 'pending',
          rental_type: 'daily',
          pickup_date: formData.pickupDate,
          return_date: formData.returnDate,
          pickup_time: formData.pickupTime,
          return_time: formData.returnTime
        };

        const commonPayload = {
          name: formData.name.trim(),
          contact: formData.contact.replace(/\s+/g, ''),
          address: formData.address.trim(),
          category: bookingData.category,
          model: bookingData.model,
          pricePerDay: pricePerDay,
          days: formData.days,
          totalPrice: totalPrice,
          timestamp: new Date().toISOString()
        };

        console.log('Daily Booking Payload:', supabasePayload);
        console.log('Attempting to submit daily booking to Supabase...');
        
        const supabaseSuccess = await submitToSupabase(supabasePayload);
        
        if (supabaseSuccess) {
          console.log('✅ Daily booking submitted to Supabase successfully!');
          successfulSubmission = true;
        } else {
          console.log('❌ Supabase submission failed, trying Google Form as fallback...');
          const googleFormSuccess = await submitToGoogleForm(commonPayload);
          
          if (googleFormSuccess) {
            console.log('✅ Booking submitted to Google Form successfully!');
            successfulSubmission = true;
          } else {
            console.log('❌ Google Form submission failed, saving to localStorage...');
            const localStorageSuccess = storeBookingLocally(commonPayload);
            
            if (localStorageSuccess) {
              console.log('✅ Booking saved to localStorage successfully!');
              successfulSubmission = true;
            }
          }
        }
      }
      
      if (successfulSubmission) {
        setCurrentStep('thank-you');
      } else {
        console.error('❌ All submission methods failed!');
        alert('There was an error submitting your booking. Please contact us directly with your booking details.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      const localStorageSuccess = storeBookingLocally({
        name: formData.name.trim(),
        contact: formData.contact.replace(/\s+/g, ''),
        address: formData.address.trim(),
        category: bookingData.category,
        model: bookingData.model,
        pricePerDay: pricePerDay,
        days: formData.days,
        weeks: formData.weeks,
        totalPrice: totalPrice,
        bookingType: formData.bookingType,
        timestamp: new Date().toISOString()
      });
      
      if (localStorageSuccess) {
        setCurrentStep('thank-you');
        console.log('✅ Saved to localStorage after error!');
      } else {
        alert('There was an error submitting your booking. Please try again or contact us directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    let processedValue: any = value;
    
    if (field === 'days' || field === 'weeks') {
      processedValue = typeof value === 'string' ? parseInt(value) || 1 : value;
    }
    
    setFormData(prev => {
      const newData = { ...prev, [field]: processedValue };
      
      // Auto-calculate return date for weekly bookings
      if (field === 'weeks' || (field === 'pickupDate' && newData.bookingType === 'weekly')) {
        if (newData.bookingType === 'weekly' && newData.pickupDate && newData.weeks) {
          const pickupDate = new Date(newData.pickupDate);
          const returnDate = new Date(pickupDate);
          returnDate.setDate(returnDate.getDate() + (newData.weeks * 7));
          newData.returnDate = returnDate.toISOString().split('T')[0];
        }
      }
      
      // Auto-calculate return date for daily bookings
      if (field === 'days' || (field === 'pickupDate' && newData.bookingType === 'daily')) {
        if (newData.bookingType === 'daily' && newData.pickupDate && newData.days) {
          const pickupDate = new Date(newData.pickupDate);
          const returnDate = new Date(pickupDate);
          returnDate.setDate(returnDate.getDate() + newData.days);
          newData.returnDate = returnDate.toISOString().split('T')[0];
        }
      }
      
      return newData;
    });
    
    // Clear error for this field if it exists
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen || !bookingData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div 
        ref={modalRef}
        className={`
          relative w-full max-w-md bg-gray-800 rounded-xl shadow-2xl transform transition-all duration-300 ease-out border border-gray-700
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          md:max-w-lg lg:max-w-xl
          max-h-[90vh] overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {currentStep === 'thank-you' ? (
          /* Thank You State */
          <div className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Thanks, {formData.name.split(' ')[0]}!
              </h2>
              <p className="text-gray-300">
                We'll contact you shortly to confirm your <strong>{bookingData.model}</strong> booking for{' '}
                {formData.bookingType === 'weekly' ? (
                  <>
                    <strong>{formData.weeks} week{formData.weeks > 1 ? 's' : ''} ({formData.weeks * 7} days)</strong>
                    {formData.pickupDate && formData.returnDate && (
                      <span className="block mt-1 text-gray-400 text-sm">
                        From {new Date(formData.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to {new Date(formData.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </>
                ) : (
                  <strong>{formData.days} day{formData.days > 1 ? 's' : ''}</strong>
                )}.
                {formData.bookingType === 'weekly' && (
                  <span className="block mt-1 text-green-400 font-medium">With 35% weekly discount applied!</span>
                )}
                {formData.bookingType === 'daily' && calculatePrice().discount && formData.days === 1 && (
                  <span className="block mt-1 text-green-400 font-medium">With 10% discount applied!</span>
                )}
              </p>
            </div>
            
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-300">
                <strong>What's next?</strong><br />
                Our team will call you within 30 minutes to confirm availability and arrange pickup details.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 shadow-lg"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-600">
              <h2 id="booking-modal-title" className="text-2xl font-bold text-white mb-2">
                Complete Your Booking
              </h2>
              <p className="text-gray-300">
                Fill in your details to complete the booking.
              </p>
            </div>

            {/* Booking Summary */}
            <div className="p-6 py-4 bg-gray-700 border-b border-gray-600">
              <h3 className="font-semibold text-white mb-2">Booking Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Category:</span>
                  <span className="font-medium text-white">{bookingData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Model:</span>
                  <span className="font-medium text-white">{bookingData.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Rental Type:</span>
                  <span className="font-medium text-white capitalize">{formData.bookingType}</span>
                </div>
                
                {formData.bookingType === 'weekly' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Duration:</span>
                      <span className="font-medium text-white">{formData.weeks} week{formData.weeks > 1 ? 's' : ''} ({formData.weeks * 7} days)</span>
                    </div>
                    {formData.pickupDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Pickup Date:</span>
                        <span className="font-medium text-white">{new Date(formData.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {formData.returnDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Return Date:</span>
                        <span className="font-medium text-white">{new Date(formData.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-300">Price per day:</span>
                      <span className="font-medium text-yellow-400">₹{bookingData.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Original total:</span>
                      <span className="text-gray-400 line-through">₹{calculatePrice().originalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Weekly discount (35%):</span>
                      <span className="text-green-400 font-medium">-₹{calculatePrice().savings}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Duration:</span>
                      <span className="font-medium text-white">{formData.days} day{formData.days > 1 ? 's' : ''}</span>
                    </div>
                    {calculatePrice().discount && formData.days === 1 ? (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Price per day:</span>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through">₹{bookingData.pricePerDay}</span>
                            <span className="font-medium text-yellow-400">₹{Math.round(bookingData.pricePerDay * 0.9)}</span>
                          </div>
                          <div className="text-xs text-green-400 font-semibold">10% OFF APPLIED!</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Price per day:</span>
                        <span className="font-medium text-yellow-400">₹{bookingData.pricePerDay}</span>
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex justify-between items-center pt-1 border-t border-gray-600 mt-1">
                  <span className="text-gray-300 font-semibold">Final Total:</span>
                  <div className="text-right">
                    <span className="font-bold text-yellow-400 text-lg">₹{calculatePrice().totalPrice}</span>
                    {formData.bookingType === 'weekly' && (
                      <div className="text-xs text-green-400 font-semibold">WEEKLY DISCOUNT APPLIED!</div>
                    )}
                    {formData.bookingType === 'daily' && calculatePrice().discount && formData.days === 1 && (
                      <div className="text-xs text-green-400">You save ₹{calculatePrice().savings}!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      ref={firstInputRef}
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`
                        w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white placeholder-gray-400
                        ${errors.name ? 'border-red-500' : 'border-gray-600'}
                      `}
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Booking Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Booking Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('bookingType', 'daily')}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200 text-left
                        ${formData.bookingType === 'daily' 
                          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' 
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                        }
                      `}
                      disabled={isSubmitting}
                    >
                      <div className="font-medium">Daily Rental</div>
                      <div className="text-xs text-gray-400">Flexible daily booking</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('bookingType', 'weekly')}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200 text-left relative
                        ${formData.bookingType === 'weekly' 
                          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' 
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                        }
                      `}
                      disabled={isSubmitting}
                    >
                      <div className="font-medium">Weekly Rental</div>
                      <div className="text-xs text-gray-400">35% OFF - Best Value!</div>
                      <div className="absolute -top-1 -right-1 bg-green-500 text-black text-xs px-1 py-0.5 rounded text-black font-bold">
                        SAVE 35%
                      </div>
                    </button>
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-1">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      id="contact"
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      className={`
                        w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white placeholder-gray-400
                        ${errors.contact ? 'border-red-500' : 'border-gray-600'}
                      `}
                      placeholder="9876543210"
                      disabled={isSubmitting}
                      aria-describedby={errors.contact ? 'contact-error' : undefined}
                    />
                  </div>
                  {errors.contact && (
                    <p id="contact-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.contact}
                    </p>
                  )}
                </div>

                {/* Pickup Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                    Pickup Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <textarea
                      id="address"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`
                        w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none text-white placeholder-gray-400
                        ${errors.address ? 'border-red-500' : 'border-gray-600'}
                      `}
                      placeholder="Enter your complete pickup address..."
                      disabled={isSubmitting}
                      aria-describedby={errors.address ? 'address-error' : undefined}
                    />
                  </div>
                  {errors.address && (
                    <p id="address-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.address}
                    </p>
                  )}
                </div>
                
                {/* Booking Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                    {formData.bookingType === 'weekly' ? 'Number of Weeks *' : 'Number of Days *'}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        id="duration"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        autoComplete="off"
                        value={formData.bookingType === 'weekly' ? formData.weeks : formData.days}
                        onFocus={(e) => {
                          // Select all text on focus for easier editing
                          e.target.select();
                        }}
                        onChange={(e) => {
                          let value = e.target.value;
                          console.log('Duration input changed:', value);
                          
                          // Allow empty string during editing
                          if (value === '') {
                            // Don't set to 1 immediately, let user type
                            return;
                          }
                          
                          // Remove non-numeric characters
                          value = value.replace(/[^0-9]/g, '');
                          
                          // If still empty after cleanup, don't update
                          if (value === '') {
                            return;
                          }
                          
                          // Parse to number and apply limits
                          let numValue = parseInt(value);
                          const maxValue = formData.bookingType === 'weekly' ? 12 : 30;
                          
                          if (numValue > maxValue) {
                            numValue = maxValue;
                          }
                          if (numValue < 1) {
                            numValue = 1;
                          }
                          
                          console.log('Setting duration value:', numValue);
                          handleInputChange(formData.bookingType === 'weekly' ? 'weeks' : 'days', numValue);
                        }}
                        onBlur={(e) => {
                          // If field is empty when user leaves, set to 1
                          if (e.target.value === '' || parseInt(e.target.value) < 1) {
                            handleInputChange(formData.bookingType === 'weekly' ? 'weeks' : 'days', 1);
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace - if current value is single digit, clear the field
                          if (e.key === 'Backspace') {
                            const currentValue = e.currentTarget.value;
                            if (currentValue.length === 1) {
                              e.preventDefault();
                              e.currentTarget.value = '';
                              return;
                            }
                          }
                          
                          // Allow: backspace, delete, tab, escape, enter
                          if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
                            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                            (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) ||
                            // Allow: home, end, left, right, up, down
                            (e.keyCode >= 35 && e.keyCode <= 40)) {
                            return;
                          }
                          
                          // Ensure that it is a number (0-9)
                          if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                          }
                        }}
                        className={`
                          w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white placeholder-gray-400
                          ${(formData.bookingType === 'weekly' ? errors.weeks : errors.days) ? 'border-red-500' : 'border-gray-600'}
                        `}
                        placeholder={formData.bookingType === 'weekly' ? 'Enter weeks' : 'Enter days'}
                        disabled={isSubmitting}
                        aria-describedby={(formData.bookingType === 'weekly' ? errors.weeks : errors.days) ? 'duration-error' : undefined}
                      />
                    </div>
                    <div className="text-yellow-400 font-medium min-w-0">
                      {formData.bookingType === 'weekly' && calculatePrice().weeklyDiscount ? (
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 line-through text-sm">₹{calculatePrice().originalPrice}</span>
                            <span className="text-lg">₹{calculatePrice().totalPrice}</span>
                          </div>
                          <div className="text-xs text-green-400">Save ₹{calculatePrice().savings}!</div>
                        </div>
                      ) : (
                        <span>₹{calculatePrice().totalPrice} total</span>
                      )}
                    </div>
                  </div>
                  {((formData.bookingType === 'weekly' && errors.weeks) || (formData.bookingType === 'daily' && errors.days)) && (
                    <p id="duration-error" className="mt-1 text-sm text-red-600" role="alert">
                      {formData.bookingType === 'weekly' ? errors.weeks : errors.days}
                    </p>
                  )}
                  
                  {/* Daily Booking Date & Time Selection */}
                  {formData.bookingType === 'daily' && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pickup Date */}
                        <div>
                          <label htmlFor="dailyPickupDate" className="block text-sm font-medium text-gray-300 mb-1">
                            Pickup Date *
                          </label>
                          <input
                            id="dailyPickupDate"
                            type="date"
                            value={formData.pickupDate}
                            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={`
                              w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white
                              ${errors.pickupDate ? 'border-red-500' : 'border-gray-600'}
                            `}
                            disabled={isSubmitting}
                            aria-describedby={errors.pickupDate ? 'daily-pickup-date-error' : undefined}
                          />
                          {errors.pickupDate && (
                            <p id="daily-pickup-date-error" className="mt-1 text-sm text-red-600" role="alert">
                              {errors.pickupDate}
                            </p>
                          )}
                        </div>

                        {/* Return Date */}
                        <div>
                          <label htmlFor="dailyReturnDate" className="block text-sm font-medium text-gray-300 mb-1">
                            Return Date * 
                            <span className="text-xs text-blue-400 ml-1">(Auto-calculated)</span>
                          </label>
                          <div className="relative">
                            <input
                              id="dailyReturnDate"
                              type="date"
                              value={formData.returnDate}
                              readOnly
                              className={`
                                w-full px-4 py-3 bg-gray-600 border rounded-lg transition-colors text-gray-300 cursor-not-allowed
                                ${errors.returnDate ? 'border-red-500' : 'border-gray-500'}
                              `}
                              disabled={isSubmitting}
                              aria-describedby={errors.returnDate ? 'daily-return-date-error' : undefined}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <span className="text-xs text-blue-400">📅</span>
                            </div>
                          </div>
                          {!formData.pickupDate && (
                            <p className="mt-1 text-xs text-gray-400">
                              Select pickup date and number of days to auto-calculate
                            </p>
                          )}
                          {errors.returnDate && (
                            <p id="daily-return-date-error" className="mt-1 text-sm text-red-600" role="alert">
                              {errors.returnDate}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pickup Time */}
                        <div>
                          <label htmlFor="dailyPickupTime" className="block text-sm font-medium text-gray-300 mb-1">
                            Pickup Time *
                          </label>
                          <input
                            id="dailyPickupTime"
                            type="time"
                            value={formData.pickupTime}
                            onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                            className={`
                              w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white
                              ${errors.pickupTime ? 'border-red-500' : 'border-gray-600'}
                            `}
                            disabled={isSubmitting}
                            aria-describedby={errors.pickupTime ? 'daily-pickup-time-error' : undefined}
                          />
                          {errors.pickupTime && (
                            <p id="daily-pickup-time-error" className="mt-1 text-sm text-red-600" role="alert">
                              {errors.pickupTime}
                            </p>
                          )}
                        </div>

                        {/* Return Time */}
                        <div>
                          <label htmlFor="dailyReturnTime" className="block text-sm font-medium text-gray-300 mb-1">
                            Return Time *
                          </label>
                          <input
                            id="dailyReturnTime"
                            type="time"
                            value={formData.returnTime}
                            onChange={(e) => handleInputChange('returnTime', e.target.value)}
                            className={`
                              w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white
                              ${errors.returnTime ? 'border-red-500' : 'border-gray-600'}
                            `}
                            disabled={isSubmitting}
                            aria-describedby={errors.returnTime ? 'daily-return-time-error' : undefined}
                          />
                          {errors.returnTime && (
                            <p id="daily-return-time-error" className="mt-1 text-sm text-red-600" role="alert">
                              {errors.returnTime}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {formData.pickupDate && formData.returnDate && (
                        <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-blue-400 text-sm font-semibold">📅 Rental Schedule</span>
                          </div>
                          <p className="text-xs text-blue-300">
                            Pickup: {new Date(formData.pickupDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })} at {formData.pickupTime}<br/>
                            Return: {new Date(formData.returnDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })} at {formData.returnTime}<br/>
                            Duration: {formData.days} day{formData.days > 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Weekly Booking Date Selection */}
                  {formData.bookingType === 'weekly' && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pickup Date */}
                        <div>
                          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-300 mb-1">
                            Pickup Date *
                          </label>
                          <input
                            id="pickupDate"
                            type="date"
                            value={formData.pickupDate}
                            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={`
                              w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white
                              ${errors.pickupDate ? 'border-red-500' : 'border-gray-600'}
                            `}
                            disabled={isSubmitting}
                            aria-describedby={errors.pickupDate ? 'pickup-date-error' : undefined}
                          />
                          {errors.pickupDate && (
                            <p id="pickup-date-error" className="mt-1 text-sm text-red-600" role="alert">
                              {errors.pickupDate}
                            </p>
                          )}
                        </div>

                        {/* Return Date */}
                        <div>
                          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-300 mb-1">
                            Return Date *
                          </label>
                          <input
                            id="returnDate"
                            type="date"
                            value={formData.returnDate}
                            onChange={(e) => handleInputChange('returnDate', e.target.value)}
                            min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                            className={`
                              w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white
                              ${errors.returnDate ? 'border-red-500' : 'border-gray-600'}
                            `}
                            disabled={isSubmitting}
                            aria-describedby={errors.returnDate ? 'return-date-error' : undefined}
                          />
                          {errors.returnDate && (
                            <p id="return-date-error" className="mt-1 text-sm text-red-600" role="alert">
                              {errors.returnDate}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {formData.pickupDate && formData.returnDate && (
                        <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-blue-400 text-sm font-semibold">📅 Booking Period</span>
                          </div>
                          <p className="text-xs text-blue-300">
                            From: {new Date(formData.pickupDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}<br/>
                            To: {new Date(formData.returnDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}<br/>
                            Duration: {Math.ceil((new Date(formData.returnDate).getTime() - new Date(formData.pickupDate).getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Weekly Booking Benefits */}
                  {formData.bookingType === 'weekly' && (
                    <div className="mt-2 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-400 text-sm font-semibold">🎉 Weekly Deal Active!</span>
                      </div>
                      <p className="text-xs text-green-300">
                        • 35% OFF on total rental cost<br/>
                        • {formData.weeks} week{formData.weeks > 1 ? 's' : ''} = {formData.weeks * 7} days of riding<br/>
                        • Best value for extended trips
                      </p>
                    </div>
                  )}
                  
                  {/* Daily Booking Tips */}
                  {formData.bookingType === 'daily' && bookingData.model.includes("Pulsar") && formData.days !== 1 && (
                    <div className="mt-2 py-2 px-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                      <p className="text-xs text-yellow-200 font-medium">💡 Tip: Book for exactly 24 hours to get 10% OFF on this Pulsar!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Booking'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none sm:px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
