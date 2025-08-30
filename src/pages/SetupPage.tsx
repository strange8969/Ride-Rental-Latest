import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import SupabaseTestComponent from '../components/SupabaseTestComponent';

const SetupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createTable = async () => {
    setIsLoading(true);
    try {
      // SQL to create the bookings table
      const { error } = await supabase.rpc('exec', {
        query: `
        -- Drop existing table if it exists
        DROP TABLE IF EXISTS public.bookings;

        -- Create the bookings table
        CREATE TABLE public.bookings (
          id uuid not null default gen_random_uuid(),
          name text not null,
          contact text not null,
          address text not null,
          category text not null,
          model text not null,
          price_per_day integer not null, 
          status text null default 'pending'::text,
          created_at timestamp with time zone null default now(),
          updated_at timestamp with time zone null default now(),
          constraint bookings_pkey primary key (id)
        );
        
        -- Create the index
        CREATE INDEX IF NOT EXISTS bookings_created_at_idx on public.bookings using btree (created_at desc);
        
        -- Enable RLS
        ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Anyone can create bookings" 
        ON public.bookings
        FOR INSERT 
        TO anon
        WITH CHECK (true);
        
        CREATE POLICY "Anyone can read bookings" 
        ON public.bookings
        FOR SELECT
        TO anon
        USING (true);
        `
      });

      if (error) {
        setResult({
          success: false,
          error: error.message
        });
      } else {
        // Test if the table was created by inserting a test record
        const { data, error: insertError } = await supabase
          .from('bookings')
          .insert([{
            name: 'Setup Test User',
            contact: '9876543210',
            address: 'Setup Test Address',
            category: 'Test',
            model: 'Test Model',
            price_per_day: 500,
            days: 1,
            total_price: 500,
            rental_type: 'daily',
            status: 'test'
          }])
          .select();

        if (insertError) {
          setResult({
            success: false,
            message: 'Table created but insert failed',
            error: insertError.message
          });
        } else {
          setResult({
            success: true,
            message: 'Table created and test record inserted successfully!',
            data
          });
        }
      }
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-yellow-500">Supabase Setup Page</h1>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Environment Configuration</h2>
          
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <p className="text-white"><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
            <p className="text-white"><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set (hidden)' : '❌ Not set'}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Create Bookings Table</h3>
            <p className="text-gray-300 mb-4">Click the button below to create or recreate the bookings table in your Supabase project.</p>
            
            <button
              onClick={createTable}
              disabled={isLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating Table...' : 'Create Bookings Table'}
            </button>
            
            {result && (
              <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                <p className={`font-medium ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                  {result.success ? '✅ ' : '❌ '} 
                  {result.message || (result.success ? 'Success!' : 'Error!')}
                </p>
                
                {result.error && (
                  <p className="text-red-400 mt-2">{result.error}</p>
                )}
                
                {result.data && (
                  <pre className="mt-2 bg-gray-900 p-2 rounded text-xs overflow-x-auto text-white">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Supabase Test Component */}
        <SupabaseTestComponent />
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4 text-white">Troubleshooting Steps</h2>
          
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>Make sure your <code className="bg-gray-700 px-1 rounded">.env</code> file is properly configured with the correct Supabase URL and anon key.</li>
            <li>Verify your Supabase project is active and the database is running.</li>
            <li>Check if your Supabase project has the required tables and structure.</li>
            <li>Ensure Row Level Security (RLS) policies are properly configured to allow the operations you're trying to perform.</li>
            <li>Restart your development server after making changes to environment variables.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
