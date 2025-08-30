// simpleSupabaseTest.js - Basic connectivity test
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Testing Supabase Connection...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not found'}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Simple test - get basic info about the Supabase instance
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Connection successful!');
      console.log('Database version:', data || 'Connected');
    }
    
    // Test if we can access any tables (this will show what tables exist)
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (!tablesError && tables) {
      console.log('📋 Available tables:', tables.map(t => t.table_name));
    } else {
      console.log('📋 Could not fetch table list (this is normal for some setups)');
    }
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testConnection();
