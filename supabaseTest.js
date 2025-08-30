// supabaseTest.js
// Run this file with Node.js to test your Supabase connection

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

console.log('== Supabase Connection Test ==');

// Get credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'Not found'}`);

if (!supabaseUrl || !supabaseKey) {
  console.error('\nERROR: Missing Supabase credentials in .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
  try {
    console.log('\nTesting connection...');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error(`\nERROR: ${error.message}`);
      console.error('Details:', error);
      
      // Provide troubleshooting tips based on error
      if (error.message.includes('invalid api key')) {
        console.log('\nTROUBLESHOOTING:');
        console.log('1. Check that your API key is correct and complete');
        console.log('2. Make sure you are using the anon/public key, not service_role');
        console.log('3. Verify the key is properly formatted (should be a JWT token)');
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('\nTROUBLESHOOTING:');
        console.log('1. The bookings table does not exist in your database');
        console.log('2. Run the SQL in setup-bookings-table.sql to create it');
      }
      
      process.exit(1);
    }
    
    console.log('\nSUCCESS! Connected to Supabase');
    console.log(`Found ${data[0]?.count || 0} records in the bookings table`);
    
    // Try an insert
    console.log('\nTesting insert capability...');
    
    const testRecord = {
      name: 'Test User',
      contact: '9876543210',
      address: 'Test Address',
      category: 'Test',
      model: 'Test Model',
      price_per_day: 500,
      days: 1,
      total_price: 500,
      rental_type: 'daily',
      status: 'test'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('bookings')
      .insert([testRecord])
      .select();
      
    if (insertError) {
      console.error(`\nINSERT ERROR: ${insertError.message}`);
      console.error('Details:', insertError);
      
      if (insertError.message.includes('permission denied')) {
        console.log('\nTROUBLESHOOTING:');
        console.log('1. RLS policies may be preventing inserts');
        console.log('2. Ensure you have an RLS policy allowing anon users to insert');
      }
    } else {
      console.log('\nSUCCESS! Inserted test record');
      console.log('Inserted record ID:', insertData[0].id);
    }
    
  } catch (err) {
    console.error('\nUNEXPECTED ERROR:');
    console.error(err);
  }
}

testConnection();
