import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ConnectionInfo {
  url: string | null;
  keyPresent: boolean;
  keyFormat: 'valid' | 'invalid' | 'unknown';
  timestamp: string;
  envInfo: any;
}

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  details?: any;
}

const SupabaseTestComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showFixGuide, setShowFixGuide] = useState(false);
  
  // Check JWT token format
  const validateJWT = (token: string): boolean => {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3;
  };
  
  // Get token details if possible
  const getTokenInfo = (token: string) => {
    try {
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      return {
        issuer: payload.iss,
        projectRef: payload.ref,
        role: payload.role,
        issuedAt: new Date(payload.iat * 1000).toISOString(),
        expires: new Date(payload.exp * 1000).toISOString()
      };
    } catch (e) {
      console.error('Failed to parse JWT token:', e);
      return null;
    }
  };
  
  useEffect(() => {
    async function checkConnection() {
      try {
        const allTests: TestResult[] = [];
        
        // Test 1: Check environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        const urlValid = Boolean(supabaseUrl?.startsWith('https://'));
        const keyValid = validateJWT(supabaseKey);
        
        allTests.push({
          name: 'Environment Variables',
          success: urlValid && keyValid,
          message: urlValid && keyValid 
            ? 'Environment variables are properly configured'
            : 'Issues with environment variables',
          details: {
            url: urlValid ? 'Valid URL format' : 'Invalid URL format',
            key: keyValid ? 'Valid JWT format' : 'Invalid JWT format'
          }
        });
        
        setConnectionInfo({
          url: supabaseUrl,
          keyPresent: Boolean(supabaseKey),
          keyFormat: keyValid ? 'valid' : supabaseKey ? 'invalid' : 'unknown',
          timestamp: new Date().toISOString(),
          envInfo: keyValid ? getTokenInfo(supabaseKey) : null
        });
        
        // Test 2: Basic connectivity
        try {
          // Use a simple ping test that won't fail if table doesn't exist
          const { data: pingData, error: pingError } = await supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true });
          
          allTests.push({
            name: 'Basic Connectivity',
            success: !pingError,
            message: pingError ? `Connection failed: ${pingError.message}` : 'Connected to Supabase',
            details: pingError || { count: pingData }
          });
          
          if (pingError) {
            setError(`Failed to connect: ${pingError.message}`);
            setTestResults(allTests);
            setIsLoading(false);
            return;
          }
        } catch (connErr) {
          console.error('Connection error:', connErr);
          allTests.push({
            name: 'Basic Connectivity',
            success: false,
            message: `Connection failed: ${connErr instanceof Error ? connErr.message : String(connErr)}`,
            details: connErr
          });
          
          setError(`Connection error: ${connErr instanceof Error ? connErr.message : String(connErr)}`);
          setTestResults(allTests);
          setIsLoading(false);
          return;
        }
        
        // Test 3: Check if bookings table exists
        try {
          const { count: tableCount, error: tableError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });
          
          allTests.push({
            name: 'Bookings Table',
            success: !tableError,
            message: tableError 
              ? `Table check failed: ${tableError.message}` 
              : `Bookings table exists with ${tableCount || 0} records`,
            details: tableError || { count: tableCount }
          });
          
          if (!tableError) {
            // If table exists, try to get some data
            const { data, error } = await supabase
              .from('bookings')
              .select('*')
              .limit(5);
              
            if (error) {
              console.error('Error fetching data:', error);
              setError(`Failed to fetch data: ${error.message}`);
              allTests.push({
                name: 'Data Retrieval',
                success: false,
                message: `Failed to fetch data: ${error.message}`,
                details: error
              });
            } else {
              console.log('Fetched data:', data);
              setData(data);
              allTests.push({
                name: 'Data Retrieval',
                success: true,
                message: `Retrieved ${data.length} records`,
                details: { count: data.length }
              });
            }
          }
        } catch (tableErr) {
          console.error('Table check error:', tableErr);
          allTests.push({
            name: 'Bookings Table',
            success: false,
            message: `Table check failed: ${tableErr instanceof Error ? tableErr.message : String(tableErr)}`,
            details: tableErr
          });
        }
        
        setTestResults(allTests);
        
        // Set overall status based on all tests
        const hasFailedTest = allTests.some(test => !test.success);
        if (hasFailedTest) {
          const firstFailure = allTests.find(test => !test.success);
          setError(firstFailure?.message || 'Connection test failed');
        }
      } catch (err) {
        console.error('Unexpected error during connection tests:', err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkConnection();
  }, []);
  
  async function testInsert() {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate a unique test record
      const timestamp = new Date().toISOString();
      const testRecord = {
        name: `Test User ${Date.now()}`,
        contact: '9876543210',
        address: `Test Address created at ${timestamp}`,
        category: 'Test',
        model: 'Test Model',
        price_per_day: 100,
        days: 1,
        total_price: 100,
        rental_type: 'daily',
        status: 'test'
      };
      
      console.log('Attempting to insert test record:', testRecord);
      
      // Try to insert the record
      const { data, error } = await supabase
        .from('bookings')
        .insert([testRecord])
        .select();
        
      if (error) {
        console.error('Insert error:', error);
        setError(`Failed to insert: ${error.message}`);
        
        // Add more details for specific error codes
        if (error.code === '23502') {
          setError(`Failed to insert: NOT NULL constraint violation. Required field missing.`);
        } else if (error.code === '42P01') {
          setError(`Failed to insert: Table "bookings" does not exist. Run migrations first.`);
        } else if (error.code === '42501') {
          setError(`Failed to insert: RLS policy error. Check Row Level Security policies.`);
        }
      } else {
        console.log('Inserted data successfully:', data);
        
        // Refresh data list
        const { data: refreshedData, error: refreshError } = await supabase
          .from('bookings')
          .select('*')
          .limit(5)
          .order('created_at', { ascending: false });
          
        if (!refreshError) {
          setData(refreshedData);
          
          // Add a successful test result
          setTestResults(prev => [...prev, {
            name: 'Insert Test',
            success: true,
            message: 'Successfully inserted test record',
            details: data
          }]);
        }
      }
    } catch (err) {
      console.error('Unexpected error during insert test:', err);
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg max-w-4xl mx-auto my-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>
      
      {/* Connection Info */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Connection Information</h3>
        <p className="mb-1">
          <strong>URL:</strong> {connectionInfo?.url || 'Not available'}
        </p>
        <p className="mb-1">
          <strong>API Key Present:</strong> {connectionInfo?.keyPresent ? '✅' : '❌'}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          {isLoading ? 'Checking...' : error ? '❌ Error' : data ? '✅ Connected' : '❓ Unknown'}
        </p>
      </div>
      
      {/* Data Display */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Data from Bookings Table</h3>
          <button
            onClick={testInsert}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Insert Test Record'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-t-transparent border-white rounded-full"></div>
            <p className="mt-2">Loading data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg">
            <p className="text-red-200 font-medium">{error}</p>
            
            {/* Debugging Information */}
            <div className="mt-4">
              <p className="text-sm font-medium text-red-300">Debugging Information:</p>
              <pre className="mt-2 p-3 bg-gray-900 rounded text-xs overflow-x-auto">
                {JSON.stringify({
                  timestamp: new Date().toISOString(),
                  environment: {
                    supabaseUrl: connectionInfo?.url || 'Not available',
                    hasKey: connectionInfo?.keyPresent || false
                  },
                  error: error
                }, null, 2)}
              </pre>
            </div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  {Object.keys(data[0]).map(key => (
                    <th key={key} className="px-4 py-2 text-left text-gray-300 text-sm">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-800/50' : ''}>
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="px-4 py-2 text-sm">
                        {value === null ? (
                          <span className="text-gray-500">null</span>
                        ) : typeof value === 'object' ? (
                          JSON.stringify(value)
                        ) : (
                          String(value)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded-lg">
            <p className="text-yellow-200">No data found in the bookings table.</p>
          </div>
        )}
      </div>
      
      {/* Debug Info */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium text-blue-400 hover:text-blue-300">
          Show Debug Information
        </summary>
        <pre className="mt-2 p-3 bg-gray-900 rounded text-xs overflow-x-auto">
          {JSON.stringify({
            environment: {
              supabaseUrl: connectionInfo?.url || 'Not available',
              hasKey: connectionInfo?.keyPresent || false,
              nodeEnv: import.meta.env.NODE_ENV,
              mode: import.meta.env.MODE
            },
            connectionInfo,
            data: data ? `${data.length} records found` : null,
            error
          }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default SupabaseTestComponent;
