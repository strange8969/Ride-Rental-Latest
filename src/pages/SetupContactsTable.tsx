import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const CreateContactsTable: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const createTable = async () => {
    setLoading(true);
    try {
      // SQL to create the handle_contact_form function
      const sql = `
        CREATE OR REPLACE FUNCTION handle_contact_form(
          form_name TEXT,
          form_email TEXT,
          form_phone TEXT,
          form_vehicle TEXT,
          form_message TEXT
        ) RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          -- First create the table if it doesn't exist
          CREATE TABLE IF NOT EXISTS contacts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            vehicle TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          -- Enable Row Level Security if not already enabled
          BEGIN
            ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
          EXCEPTION
            WHEN OTHERS THEN
              -- RLS may already be enabled, continue
          END;

          -- Create policies if they don't exist
          -- Check if the insert policy exists
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Anyone can create contacts'
          ) THEN
            CREATE POLICY "Anyone can create contacts"
              ON contacts
              FOR INSERT
              TO anon
              WITH CHECK (true);
          END IF;

          -- Check if the select policy exists
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Anyone can read contacts'
          ) THEN
            CREATE POLICY "Anyone can read contacts"
              ON contacts
              FOR SELECT
              TO anon
              USING (true);
          END IF;

          -- Insert the contact form data
          INSERT INTO contacts (name, email, phone, vehicle, message)
          VALUES (form_name, form_email, form_phone, form_vehicle, form_message);

          -- Return success
          result := jsonb_build_object(
            'success', true,
            'message', 'Contact form submitted successfully'
          );
          
          RETURN result;
        EXCEPTION
          WHEN OTHERS THEN
            -- Return error information
            result := jsonb_build_object(
              'success', false,
              'error', SQLERRM,
              'detail', SQLSTATE
            );
            
            RETURN result;
        END;
        $$;
      `;

      // Execute the SQL directly
      const { error } = await supabase.rpc('exec_sql', { sql });

      if (error) {
        console.error('Error creating function:', error);
        setStatus(`Error: ${error.message}`);
        
        // Try a simpler approach - sometimes the 'exec_sql' function doesn't exist
        try {
          // Create contacts table directly
          const { error: tableError } = await supabase.from('contacts').select('count').limit(1);
          
          if (tableError && tableError.code === '42P01') { // relation does not exist
            // Try to create the table with a simple query
            const { error: createError } = await supabase.rpc('exec_sql', {
              sql: `
                CREATE TABLE IF NOT EXISTS contacts (
                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                  name TEXT NOT NULL,
                  email TEXT NOT NULL,
                  phone TEXT NOT NULL,
                  vehicle TEXT NOT NULL,
                  message TEXT NOT NULL,
                  created_at TIMESTAMPTZ DEFAULT now()
                );
                ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "Anyone can create contacts" ON contacts FOR INSERT TO anon WITH CHECK (true);
                CREATE POLICY "Anyone can read contacts" ON contacts FOR SELECT TO anon USING (true);
              `
            });
            
            if (createError) {
              setStatus(`Failed to create table: ${createError.message}`);
            } else {
              setStatus('Contacts table created successfully! You can use the contact form now.');
            }
          } else if (tableError) {
            setStatus(`Error checking table: ${tableError.message}`);
          } else {
            setStatus('Contacts table already exists! Your form should work.');
          }
        } catch (err: any) {
          setStatus(`Error with fallback approach: ${err.message}`);
        }
      } else {
        setStatus('Function created successfully! Your contact form should work now.');
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setStatus(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 flex flex-col items-center">
      <div className="max-w-lg mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl text-white">
        <h1 className="text-2xl font-bold mb-6">Setup Contacts Table</h1>
        <p className="mb-6">
          Click the button below to set up the contacts table in your Supabase database.
          This is required for the contact form to work properly.
        </p>
        <button
          onClick={createTable}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg"
        >
          {loading ? 'Setting up...' : 'Setup Contacts Table'}
        </button>
        
        {status && (
          <div className={`mt-6 p-4 rounded-lg ${status.includes('Error') ? 'bg-red-900' : 'bg-green-900'}`}>
            {status}
          </div>
        )}
        
        <div className="mt-10 border-t border-gray-600 pt-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click the button above to set up the contacts table</li>
            <li>Once successful, go back to the Contact page</li>
            <li>Your contact form should now work with the new table</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CreateContactsTable;
