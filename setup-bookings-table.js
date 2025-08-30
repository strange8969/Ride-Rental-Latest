// setup-bookings-table.js
// This script helps set up the bookings table in your Supabase project

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials from .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// SQL to create the bookings table
const sqlFilePath = path.join(__dirname, 'setup-bookings-table.sql');
const createTableSQL = fs.readFileSync(sqlFilePath, 'utf8');

// Log setup start
console.log('\n===== Bookings Table Setup =====\n');
console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log('Anon Key: [Hidden for security]');

// Check if we have valid credentials
if (!supabaseUrl || !supabaseUrl.includes('supabase.co') || !supabaseKey) {
  console.error('\n❌ Invalid Supabase credentials!');
  console.error('Please make sure your .env file is set up correctly with:');
  console.error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('\nRun setup-supabase.ps1 or setup-supabase.bat to configure your credentials.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create the bookings table
async function setupBookingsTable() {
  try {
    console.log('\nAttempting to create bookings table...');
    
    // Use rpc to execute SQL directly (if available)
    // Note: This requires the 'postgres' extension to be enabled
    const { error } = await supabase.rpc('exec', { 
      query: createTableSQL 
    }).catch(() => {
      // If rpc fails, we'll show instructions for manual setup
      return { error: { message: 'RPC not available' } };
    });

    if (error) {
      console.log('\n⚠️ Could not create table automatically.');
      console.log('Error:', error.message);
      console.log('\nPlease follow these manual steps:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Open the SQL Editor');
      console.log('3. Copy and paste the SQL from setup-bookings-table.sql');
      console.log('4. Run the SQL commands to create the table structure');
    } else {
      console.log('\n✅ Bookings table created successfully!');
    }
    
    // Check if we can connect to the table
    console.log('\nTesting connection to bookings table...');
    const { data, error: selectError } = await supabase
      .from('bookings')
      .select('count(*)')
      .limit(1);
      
    if (selectError) {
      console.log(`❌ Could not connect to bookings table: ${selectError.message}`);
    } else {
      console.log('✅ Connection to bookings table successful!');
      console.log(`Found ${data[0]?.count || 0} records in the table.`);
    }
    
  } catch (err) {
    console.error('\n❌ Unexpected error:');
    console.error(err);
    console.error('\nPlease try setting up the table manually using the SQL file.');
  }
}

// Run the setup
setupBookingsTable().then(() => {
  console.log('\nSetup process completed!');
  console.log('Check the messages above for the status of your bookings table.');
  console.log('\nIf everything is set up correctly, your app should now be able to:');
  console.log('- Create new bookings');
  console.log('- View existing bookings');
  console.log('\nNext steps:');
  console.log('1. Start or restart your development server (npm run dev)');
  console.log('2. Visit http://localhost:5173/setup-supabase to verify');
});
