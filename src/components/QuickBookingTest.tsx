import { useState } from 'react';
import { supabase, type BookingInsert } from '../lib/supabase';

export default function QuickBookingTest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string>('');

  const testRealBooking = async () => {
    setIsSubmitting(true);
    setResult('');
    
    try {
      console.log('=== TESTING REAL BOOKING FLOW ===');
      
      // This mimics exactly what BookingModal does
      const bookingData = {
        category: 'Sports Bike',
        model: 'Pulsar 150',
        pricePerDay: 550
      };
      
      const formData = {
        name: 'Test Customer',
        contact: '9876543210',
        address: 'Test Address, Test City',
        days: 2
      };
      
      // Calculate price exactly like BookingModal
      const pricePerDay = bookingData.pricePerDay;
      const totalPrice = pricePerDay * formData.days;
      
      console.log('Price calculation:', { pricePerDay, totalPrice });
      
      // Create payload exactly like BookingModal
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
        rental_type: 'daily'
      };
      
      console.log('Full booking payload:', supabasePayload);
      console.log('Environment check:');
      console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('- VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Test the exact same logic as submitToSupabase
      const bookingPayload: any = {
        name: supabasePayload.name,
        contact: supabasePayload.contact,
        address: supabasePayload.address,
        category: supabasePayload.category,
        model: supabasePayload.model,
        price_per_day: supabasePayload.price_per_day,
        status: supabasePayload.status || 'pending',
        rental_type: supabasePayload.rental_type || 'daily'
      };

      if (supabasePayload.days !== undefined) {
        bookingPayload.days = supabasePayload.days;
      }
      
      if (supabasePayload.total_price !== undefined) {
        bookingPayload.total_price = supabasePayload.total_price;
      }

      console.log('Final payload for Supabase:', bookingPayload);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select();

      if (error) {
        console.error('❌ Supabase error:', error);
        setResult(`❌ Booking failed: ${error.message}\n\nDetails: ${JSON.stringify(error, null, 2)}`);
      } else {
        console.log('✅ Booking saved successfully:', data);
        setResult(`✅ Real booking test successful!\n\nSaved data: ${JSON.stringify(data[0], null, 2)}`);
      }
      
    } catch (error: any) {
      console.error('❌ Unexpected error:', error);
      setResult(`❌ Unexpected error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkExistingBookings = async () => {
    try {
      console.log('=== CHECKING EXISTING BOOKINGS ===');
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching bookings:', error);
        setResult(`❌ Error fetching bookings: ${error.message}`);
      } else {
        console.log('Recent bookings:', data);
        setResult(`📋 Recent bookings found: ${data.length}\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setResult(`❌ Unexpected error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">🚀 Booking Flow Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <button
          onClick={testRealBooking}
          disabled={isSubmitting}
          className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Testing Booking...' : '🧪 Test Real Booking'}
        </button>
        
        <button
          onClick={checkExistingBookings}
          className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          📋 Check Recent Bookings
        </button>
      </div>
      
      {result && (
        <div className="mt-4 text-sm p-4 rounded bg-gray-800 border border-gray-700">
          <pre className="whitespace-pre-wrap text-green-400">{result}</pre>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-400 space-y-1">
        <p>🔍 This test mimics exactly what your booking form does</p>
        <p>📊 Check browser console (F12) for detailed logs</p>
        <p>🔗 Check your Supabase dashboard for new entries</p>
      </div>
    </div>
  );
}
