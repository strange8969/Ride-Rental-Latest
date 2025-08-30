import { supabase } from '../lib/supabase';

// Function to test if the Supabase connection is working
export const testSupabaseConnection = async () => {
  try {
    // First, check environment variables
    const envVars = {
      url: import.meta.env.VITE_SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY,
      urlValid: Boolean(import.meta.env.VITE_SUPABASE_URL?.startsWith('https://')),
      keyValid: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY?.length > 10)
    };

    console.log('Environment variables check:', envVars.urlValid && envVars.keyValid ? '✅' : '❌');
    console.log('URL looks valid:', envVars.urlValid ? '✅' : '❌');
    console.log('Key seems to be present:', envVars.keyValid ? '✅' : '❌');

    if (!envVars.urlValid || !envVars.keyValid) {
      return {
        success: false,
        error: 'Invalid environment variables',
        details: {
          envVars: {
            urlPresent: Boolean(envVars.url),
            keyPresent: Boolean(envVars.key),
            urlValid: envVars.urlValid,
            keyValid: envVars.keyValid
          }
        }
      };
    }

    // Check if supabase client is initialized
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not initialized',
        details: {}
      };
    }

    // Try a simple ping query
    const { data, error } = await supabase.from('bookings').select('id').limit(1);

    if (error) {
      return {
        success: false,
        error: error.message,
        details: { error }
      };
    }

    return {
      success: true,
      data
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: { error: err }
    };
  }
};

// Function to check if the bookings table exists and has the expected structure
export const checkBookingsTable = async () => {
  try {
    // Try to get the structure of the bookings table
    const { data, error } = await supabase
      .from('bookings')
      .select('id, name, contact, address, category, model, price_per_day, days, total_price, status')
      .limit(1);

    if (error) {
      return {
        success: false,
        error: error.message,
        details: { error }
      };
    }

    // Now check which columns actually exist in the returned data
    const columnInfo = {
      columnsChecked: ['id', 'name', 'contact', 'address', 'category', 'model', 
                      'price_per_day', 'days', 'total_price', 'status'],
      columnsFound: data && data.length > 0 ? Object.keys(data[0]) : []
    };

    return {
      success: true,
      data: columnInfo
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: { error: err }
    };
  }
};

// Function to attempt a test insert with complete debugging information
export const testBookingInsert = async () => {
  try {
    const testPayload = {
      name: 'Test User',
      contact: '9876543210',
      address: 'Test Address',
      category: 'Test Category',
      model: 'Test Model',
      price_per_day: 100,
      days: 1,
      total_price: 100,
      rental_type: 'daily',
      status: 'test'
    };

    console.log('Attempting test insert with payload:', testPayload);

    const { data, error } = await supabase
      .from('bookings')
      .insert([testPayload])
      .select();

    if (error) {
      return {
        success: false,
        error: error.message,
        details: { error, payload: testPayload }
      };
    }

    return {
      success: true,
      data,
      payload: testPayload
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: { error: err }
    };
  }
};

// Function to run all tests
export const runAllSupabaseTests = async () => {
  const connectionTest = await testSupabaseConnection();
  console.log('Connection test:', connectionTest.success ? '✅' : '❌');
  
  if (!connectionTest.success) {
    return {
      allPassed: false,
      tests: {
        connection: connectionTest
      }
    };
  }

  const tableCheck = await checkBookingsTable();
  console.log('Bookings table check:', tableCheck.success ? '✅' : '❌');
  
  if (!tableCheck.success) {
    return {
      allPassed: false,
      tests: {
        connection: connectionTest,
        tableCheck
      }
    };
  }

  const insertTest = await testBookingInsert();
  console.log('Test insert:', insertTest.success ? '✅' : '❌');

  return {
    allPassed: connectionTest.success && tableCheck.success && insertTest.success,
    tests: {
      connection: connectionTest,
      tableCheck,
      insertTest
    }
  };
};
