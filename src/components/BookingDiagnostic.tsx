import { useState } from 'react';
import { supabase } from '../lib/supabase';

const BookingDiagnostic = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Testing Supabase connection...');
      console.log('Environment variables:');
      console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Test 1: Basic connection
      const { error: healthError } = await supabase
        .from('bookings')
        .select('count(*)', { count: 'exact' })
        .limit(1);

      if (healthError) {
        setResult({
          step: 'connection',
          success: false,
          error: healthError.message,
          details: healthError
        });
        return;
      }

      console.log('✅ Connection successful');

      // Test 2: Check table structure
      const { data: structureData, error: structureError } = await supabase
        .from('bookings')
        .select('*')
        .limit(1);

      if (structureError) {
        setResult({
          step: 'structure',
          success: false,
          error: structureError.message,
          details: structureError
        });
        return;
      }

      console.log('✅ Table structure OK');

      // Test 3: Try inserting a test booking
      const testBooking = {
        name: `Test User ${Date.now()}`,
        contact: '9876543210',
        address: 'Test Address for Diagnostic',
        category: 'Test Category',
        model: 'Test Model',
        price_per_day: 100,
        days: 1,
        total_price: 100,
        status: 'pending',
        rental_type: 'daily'
      };

      console.log('🧪 Testing booking insert with payload:', testBooking);

      const { data: insertData, error: insertError } = await supabase
        .from('bookings')
        .insert([testBooking])
        .select();

      if (insertError) {
        setResult({
          step: 'insert',
          success: false,
          error: insertError.message,
          details: insertError,
          payload: testBooking
        });
        return;
      }

      console.log('✅ Test booking inserted successfully:', insertData);

      setResult({
        success: true,
        message: 'All tests passed! Supabase is working correctly.',
        insertedData: insertData,
        tableStructure: structureData
      });

    } catch (error: any) {
      console.error('❌ Unexpected error:', error);
      setResult({
        step: 'unexpected',
        success: false,
        error: error.message,
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testRealBookingFlow = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Simulate exact booking flow from BookingModal
      const formData = {
        name: `Real Test User ${Date.now()}`,
        contact: '9876543210',
        address: 'Real Test Address, City, State',
        days: 2,
        bookingType: 'daily'
      };

      const bookingData = {
        category: 'Sports Bike',
        model: 'Bajaj Pulsar 150',
        pricePerDay: 600
      };

      const pricePerDay = bookingData.pricePerDay;
      const totalPrice = pricePerDay * formData.days;

      const supabasePayload = {
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

      console.log('🚀 Testing real booking flow with payload:', supabasePayload);

      const { data, error } = await supabase
        .from('bookings')
        .insert([supabasePayload])
        .select();

      if (error) {
        console.error('❌ Real booking test failed:', error);
        setResult({
          step: 'real_booking',
          success: false,
          error: error.message,
          details: error,
          payload: supabasePayload
        });
        return;
      }

      console.log('✅ Real booking test successful:', data);
      setResult({
        success: true,
        message: 'Real booking flow test passed!',
        insertedData: data,
        payload: supabasePayload
      });

    } catch (error: any) {
      console.error('❌ Real booking flow error:', error);
      setResult({
        step: 'real_booking',
        success: false,
        error: error.message,
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  const checkRecentBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        setResult({
          step: 'recent_bookings',
          success: false,
          error: error.message,
          details: error
        });
        return;
      }

      setResult({
        success: true,
        message: `Found ${data.length} recent bookings`,
        recentBookings: data
      });

    } catch (error: any) {
      setResult({
        step: 'recent_bookings',
        success: false,
        error: error.message,
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">🔧 Booking System Diagnostic</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testSupabaseConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 font-medium"
        >
          {loading ? 'Testing...' : '🔍 Test Connection & Insert'}
        </button>
        
        <button
          onClick={testRealBookingFlow}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 font-medium"
        >
          {loading ? 'Testing...' : '🚀 Test Real Booking Flow'}
        </button>
        
        <button
          onClick={checkRecentBookings}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 font-medium"
        >
          {loading ? 'Loading...' : '📋 Check Recent Bookings'}
        </button>
      </div>

      {result && (
        <div className={`p-6 rounded-lg ${result.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
          <h2 className={`text-xl font-bold mb-4 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
            {result.success ? '✅ Success' : '❌ Error'}
          </h2>
          
          {result.message && (
            <p className="text-gray-300 mb-4">{result.message}</p>
          )}
          
          {result.error && (
            <div className="mb-4">
              <p className="text-red-300 font-medium">Error: {result.error}</p>
              {result.step && (
                <p className="text-red-200 text-sm">Failed at step: {result.step}</p>
              )}
            </div>
          )}

          {result.insertedData && (
            <div className="mb-4">
              <h3 className="text-green-400 font-medium mb-2">Inserted Data:</h3>
              <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(result.insertedData, null, 2)}
              </pre>
            </div>
          )}

          {result.recentBookings && (
            <div className="mb-4">
              <h3 className="text-green-400 font-medium mb-2">Recent Bookings:</h3>
              <div className="space-y-2 max-h-60 overflow-auto">
                {result.recentBookings.map((booking: any, index: number) => (
                  <div key={index} className="bg-gray-800 p-3 rounded text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Name:</strong> {booking.name}</div>
                      <div><strong>Model:</strong> {booking.model}</div>
                      <div><strong>Contact:</strong> {booking.contact}</div>
                      <div><strong>Days:</strong> {booking.days}</div>
                      <div><strong>Total:</strong> ₹{booking.total_price}</div>
                      <div><strong>Status:</strong> {booking.status}</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      Created: {new Date(booking.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(result.payload || result.details) && (
            <details className="mt-4">
              <summary className="cursor-pointer text-gray-400 hover:text-white font-medium">
                View Technical Details
              </summary>
              <pre className="mt-2 p-3 bg-gray-800 rounded text-xs overflow-auto">
                {JSON.stringify(result.payload || result.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold text-gray-300 mb-2">Environment Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
          <div><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</div>
          <div><strong>API Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}</div>
        </div>
      </div>
    </div>
  );
};

export default BookingDiagnostic;
