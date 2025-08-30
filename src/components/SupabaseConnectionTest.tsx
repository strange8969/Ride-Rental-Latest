import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

interface ConnectionState {
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  details: any | null;
  apiKey: string | null;
}

const SupabaseConnectionTest = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: true,
    isConnected: false,
    error: null,
    details: null,
    apiKey: null
  });

  const [manualUrl, setManualUrl] = useState('');
  const [manualKey, setManualKey] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionState(prev => ({ ...prev, isConnecting: true }));
    try {
      // Get the current Supabase URL and API key from environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Check if environment variables are set
      if (!supabaseUrl || !supabaseKey) {
        setConnectionState({
          isConnecting: false,
          isConnected: false,
          error: 'Missing environment variables',
          details: {
            url: supabaseUrl || 'Not set',
            keyProvided: supabaseKey ? 'Yes (hidden)' : 'No'
          },
          apiKey: supabaseKey ? supabaseKey.substring(0, 5) + '...' : 'Not set'
        });
        return;
      }

      // Test connection by making a simple query
      const { data, error } = await supabase
        .from('bookings')
        .select('count(*)')
        .limit(1);

      if (error) {
        // Connection failed
        setConnectionState({
          isConnecting: false,
          isConnected: false,
          error: error.message,
          details: { 
            error,
            url: supabaseUrl,
            keyProvided: 'Yes (hidden)'
          },
          apiKey: supabaseKey.substring(0, 5) + '...'
        });
      } else {
        // Connection successful
        setConnectionState({
          isConnecting: false,
          isConnected: true,
          error: null,
          details: { 
            data,
            url: supabaseUrl,
            keyProvided: 'Yes (hidden)'
          },
          apiKey: supabaseKey.substring(0, 5) + '...'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setConnectionState({
        isConnecting: false,
        isConnected: false,
        error: errorMessage,
        details: error,
        apiKey: null
      });
    }
  };

  const handleManualConnect = async () => {
    try {
      // Validate inputs
      if (!manualUrl || !manualKey) {
        alert('Please provide both URL and API key');
        return;
      }

      setConnectionState(prev => ({ ...prev, isConnecting: true }));

      // Create a temporary client with manual credentials
      const tempClient = createClient(manualUrl, manualKey);

      // Test connection
      const { data, error } = await tempClient
        .from('bookings')
        .select('count(*)')
        .limit(1);

      if (error) {
        alert(`Connection failed: ${error.message}`);
        setConnectionState({
          isConnecting: false,
          isConnected: false,
          error: error.message,
          details: { manualTest: true, error },
          apiKey: null
        });
      } else {
        // Update the .env file with working credentials
        if (confirm('Connection successful! Would you like to update your .env file with these credentials?')) {
          const updateResult = await fetch('/api/update-env', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: manualUrl, key: manualKey })
          });
          
          if (updateResult.ok) {
            alert('Environment variables updated! Please restart your development server.');
          } else {
            alert('Failed to update environment variables. Please update .env file manually.');
          }
        }

        setConnectionState({
          isConnecting: false,
          isConnected: true,
          error: null,
          details: { manualTest: true, data },
          apiKey: manualKey.substring(0, 5) + '...'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
      setConnectionState({
        isConnecting: false,
        isConnected: false,
        error: errorMessage,
        details: { manualTest: true, error },
        apiKey: null
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Diagnostic</h1>

      {/* Connection Status */}
      <div className="p-4 bg-gray-100 rounded-lg mb-6">
        <h2 className="font-semibold text-lg mb-2">Connection Status</h2>
        
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            connectionState.isConnecting ? 'bg-yellow-400' : 
            connectionState.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="font-medium">
            {connectionState.isConnecting ? 'Checking connection...' : 
             connectionState.isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {connectionState.error && (
          <div className="text-red-600 mt-2">
            <p className="font-medium">Error: {connectionState.error}</p>
          </div>
        )}

        <div className="mt-3">
          <div><strong>URL:</strong> {connectionState.details && 'url' in connectionState.details ? connectionState.details.url : 'Not available'}</div>
          <div><strong>API Key:</strong> {connectionState.apiKey || 'Not available'}</div>
        </div>
        
        <button 
          onClick={checkConnection}
          disabled={connectionState.isConnecting}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {connectionState.isConnecting ? 'Checking...' : 'Test Connection Again'}
        </button>
      </div>

      {/* Manual Connection Form */}
      <div className="p-4 bg-gray-100 rounded-lg mb-6">
        <h2 className="font-semibold text-lg mb-2">Manual Connection Test</h2>
        <p className="text-sm text-gray-600 mb-4">
          If your environment variables aren't working, try connecting manually with your Supabase credentials.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Supabase URL</label>
          <input 
            type="text" 
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://your-project-id.supabase.co"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Supabase Anon Key</label>
          <input 
            type="text" 
            value={manualKey}
            onChange={(e) => setManualKey(e.target.value)}
            placeholder="your-anon-key"
            className="w-full p-2 border rounded"
          />
        </div>

        <button 
          onClick={handleManualConnect}
          disabled={!manualUrl || !manualKey || connectionState.isConnecting}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          Test Manual Connection
        </button>
      </div>

      {/* Troubleshooting Tips */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold text-lg mb-2">Troubleshooting Tips</h2>
        
        <ul className="list-disc pl-5 space-y-2">
          <li>Make sure your Supabase project is active and not paused.</li>
          <li>Verify that you're using the <strong>anon/public</strong> key, not the service_role key.</li>
          <li>Check that your API key hasn't expired or been revoked.</li>
          <li>Confirm that your .env file is properly formatted without extra spaces or quotes.</li>
          <li>After updating your .env file, restart your development server.</li>
          <li>Try clearing your browser cache or using an incognito window.</li>
          <li>Check your browser console for additional error details.</li>
        </ul>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;
