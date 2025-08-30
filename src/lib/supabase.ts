import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up Supabase connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Booking {
  id: string;
  name: string;
  contact: string;
  address: string;
  category: string;
  model: string;
  price_per_day: number;
  days?: number; // Made optional to match the updated table structure
  total_price?: number; // Made optional to match the updated table structure
  status: string;
  rental_type?: string; // Added rental_type field
  pickup_date?: string;
  return_date?: string;
  pickup_time?: string;
  return_time?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingInsert {
  name: string;
  contact: string;
  address: string;
  category: string;
  model: string;
  price_per_day: number;
  days?: number; // Made optional to match the updated table structure
  total_price?: number; // Made optional to match the updated table structure
  status?: string;
  rental_type?: string; // Added rental_type field
  pickup_date?: string;
  return_date?: string;
  pickup_time?: string;
  return_time?: string;
}

export interface WeeklyBooking {
  id: string;
  name: string;
  contact: string;
  address: string;
  category: string;
  model: string;
  price_per_day: number;
  weeks: number;
  total_weeks_price: number;
  weekly_discount_percent: number;
  original_price: number;
  savings: number;
  status: string;
  pickup_date?: string;
  return_date?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyBookingInsert {
  name: string;
  contact: string;
  address: string;
  category: string;
  model: string;
  price_per_day: number;
  weeks: number;
  total_weeks_price: number;
  weekly_discount_percent?: number;
  original_price: number;
  savings: number;
  status?: string;
  pickup_date?: string;
  return_date?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at?: string;
}

// Function to create a contact message in Supabase
export const createContactMessage = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> => {
  console.log('Creating contact message in Supabase:', contactData);
  
  try {
    // First try to use the dedicated contacts table
    const { error: contactsError } = await supabase
      .from('contacts')
      .insert([{
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        subject: contactData.subject,
        message: contactData.message,
        status: 'new'
      }]);
      
    if (!contactsError) {
      console.log('Contact message saved successfully to contacts table!');
      return;
    }
    
    console.log('Contacts table not available, falling back to bookings table:', contactsError);
    
    // Fallback: Convert contact form data to booking structure
    const bookingData = {
      name: contactData.name,
      contact: contactData.phone || contactData.email,
      address: contactData.message.substring(0, 255), // Truncate if too long
      category: 'Contact Form',
      model: contactData.subject,
      price_per_day: 0,
      days: 1,
      total_price: 0,
      rental_type: 'contact',
      status: `CONTACT: ${contactData.email}`
    };
    
    console.log('Saving contact as booking:', bookingData);
    
    const { error } = await supabase
      .from('bookings')
      .insert([bookingData]);
      
    if (error) {
      console.error('Error inserting into bookings table:', error);
      throw new Error(`Failed to save message: ${error.message}`);
    }
    
    console.log('Contact message saved successfully as booking!');
  } catch (err: any) {
    console.error('Unexpected error in createContactMessage:', err);
    throw err; // Re-throw to be caught by the component
  }
}