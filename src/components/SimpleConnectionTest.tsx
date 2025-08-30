import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SimpleConnectionTest = () => {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    data: any | null;
  }>({
    isConnected: false,
    isLoading: true,
    error: null,
    data: null
  });
  
  useEffect(() => {
    testConnection();
  }, []);
  
  const testConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    try {
      // Check if environment variables are set
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setStatus({
          isConnected: false,
          isLoading: false,
          error: 'Missing environment variables',
          data: null
        });
        return;
      }
      
      // Try to query the database
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .limit(1);
        
      if (error) {
        setStatus({
          isConnected: false,
          isLoading: false,
          error: error.message,
          data: null
        });
      } else {
        setStatus({
          isConnected: true,
          isLoading: false,
          error: null,
          data
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setStatus({
        isConnected: false,
        isLoading: false,
        error: errorMessage,
        data: null
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
      <h2 className="text-2xl font-bold mb-6">Supabase Connection Status</h2>
      
      <div className="flex items-center mb-4">
        <div className={`w-4 h-4 rounded-full mr-3 ${
          status.isLoading ? 'bg-yellow-400' : 
          status.isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className="font-medium">
          {status.isLoading ? 'Checking...' : 
           status.isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      {status.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>Error:</strong> {status.error}
        </div>
      )}
      
      {status.isConnected && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          <strong>Success!</strong> Connected to Supabase project.
          <div className="text-sm mt-1">
            {status.data && status.data[0] && (
              <div>Found {status.data[0].count} records in the bookings table.</div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-2">
        <p className="text-sm text-gray-600">
          Environment variables:
        </p>
        <div className="bg-gray-50 p-2 rounded text-sm font-mono mt-1">
          <div>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</div>
          <div>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 
            `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 10)}...` : 'Not set'}</div>
        </div>
      </div>
      
      <button 
        onClick={testConnection}
        disabled={status.isLoading}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {status.isLoading ? 'Testing...' : 'Test Connection Again'}
      </button>
    </div>
  );
};

export default SimpleConnectionTest;
