import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [isTestingBooking, setIsTestingBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<string>('');

  const testConnection = async () => {
    setIsTestingConnection(true);
    setTestResult('');
    
    try {
      console.log('Testing Supabase connection...');
      console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Test basic connection
      const { data, error } = await supabase
        .from('bookings')
        .select('count(*)', { count: 'exact', head: true });
      
      if (error) {
        console.error('Supabase connection error:', error);
        setTestResult(`❌ Connection failed: ${error.message}`);
      } else {
        console.log('Supabase connection successful:', data);
        setTestResult(`✅ Connection successful! Table accessible.`);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setTestResult(`❌ Unexpected error: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testBookingInsert = async () => {
    setIsTestingBooking(true);
    setBookingResult('');
    
    try {
      console.log('Testing booking insert...');
      
      const testBooking = {
        name: 'Test User',
        contact: '9999999999',
        address: 'Test Address',
        category: 'Test Category',
        model: 'Test Model',
        price_per_day: 100,
        days: 1,
        total_price: 100,
        status: 'test'
      };
      
      console.log('Inserting test booking:', testBooking);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([testBooking])
        .select();
      
      if (error) {
        console.error('Booking insert error:', error);
        setBookingResult(`❌ Insert failed: ${error.message}`);
      } else {
        console.log('Booking insert successful:', data);
        setBookingResult(`✅ Test booking inserted successfully! ID: ${data[0]?.id}`);
      }
    } catch (error: any) {
      console.error('Unexpected booking error:', error);
      setBookingResult(`❌ Unexpected error: ${error.message}`);
    } finally {
      setIsTestingBooking(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Supabase Test</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={testConnection}
            disabled={isTestingConnection}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isTestingConnection ? 'Testing Connection...' : 'Test Connection'}
          </button>
          {testResult && (
            <div className="mt-2 text-sm p-2 rounded bg-gray-700">
              {testResult}
            </div>
          )}
        </div>
        
        <div>
          <button
            onClick={testBookingInsert}
            disabled={isTestingBooking}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isTestingBooking ? 'Testing Insert...' : 'Test Booking Insert'}
          </button>
          {bookingResult && (
            <div className="mt-2 text-sm p-2 rounded bg-gray-700">
              {bookingResult}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <p>Check browser console for detailed logs</p>
      </div>
    </div>
  );
}
