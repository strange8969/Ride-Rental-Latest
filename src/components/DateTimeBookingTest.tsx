import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const DateTimeBookingTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testDateTimeSubmission = async () => {
    setIsLoading(true);
    setTestResult('Testing date/time submission...');

    try {
      const testBooking = {
        name: 'Test User DateTime',
        contact: '9876543210',
        address: 'Test Address for DateTime Booking',
        category: 'Scooter',
        model: 'Test Model',
        price_per_day: 100,
        days: 2,
        total_price: 200,
        status: 'pending',
        rental_type: 'daily',
        pickup_date: '2025-08-29',
        return_date: '2025-08-31',
        pickup_time: '10:00',
        return_time: '18:00'
      };

      console.log('Submitting test booking with date/time fields:', testBooking);

      const { data, error } = await supabase
        .from('bookings')
        .insert([testBooking])
        .select();

      if (error) {
        console.error('Error submitting test booking:', error);
        setTestResult(`❌ ERROR: ${error.message}\nCode: ${error.code}\nDetails: ${error.details || 'None'}\n\nThis likely means the database columns don't exist yet. Please run the migration SQL in your Supabase dashboard.`);
      } else {
        console.log('Test booking submitted successfully:', data);
        setTestResult(`✅ SUCCESS: Date/time booking submitted successfully!\n\nData saved: ${JSON.stringify(data[0], null, 2)}\n\nThe pickup_date, return_date, pickup_time, and return_time fields are working correctly.`);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setTestResult(`❌ UNEXPECTED ERROR: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTableStructure = async () => {
    setIsLoading(true);
    setTestResult('Checking table structure...');

    try {
      // Try to query the table structure
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .limit(1);

      if (error) {
        setTestResult(`❌ ERROR checking table: ${error.message}`);
      } else {
        setTestResult(`✅ Table accessible. Sample data structure:\n${JSON.stringify(data[0] || 'No data found', null, 2)}`);
      }
    } catch (err: any) {
      setTestResult(`❌ ERROR: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">📅 Date/Time Booking Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={checkTableStructure}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Checking...' : 'Check Table Structure'}
        </button>

        <button
          onClick={testDateTimeSubmission}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Date/Time Submission'}
        </button>

        {testResult && (
          <div className="p-4 bg-gray-700 rounded border">
            <h3 className="font-semibold text-white mb-2">Test Result:</h3>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto">
              {testResult}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded">
        <h3 className="font-semibold text-yellow-400 mb-2">📋 Instructions:</h3>
        <ol className="text-sm text-yellow-200 space-y-1">
          <li>1. First click "Check Table Structure" to verify database connection</li>
          <li>2. If the test submission fails, you need to run the migration SQL in Supabase</li>
          <li>3. Go to your Supabase dashboard → SQL Editor → Run the migration from APPLY-DATETIME-MIGRATION.md</li>
          <li>4. After running migration, try the test submission again</li>
        </ol>
      </div>
    </div>
  );
};

export default DateTimeBookingTest;
