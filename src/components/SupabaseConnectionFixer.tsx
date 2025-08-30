import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface ConnectionResult {
  isConnected: boolean;
  message: string;
  error: any;
  details?: any;
}

const SupabaseConnectionFixer = () => {
  const [connectionResult, setConnectionResult] = useState<ConnectionResult>({
    isConnected: false,
    message: 'Testing connection...',
    error: null
  });
  
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Get the existing environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  useEffect(() => {
    // Initialize with current environment variables
    setCustomUrl(envUrl);
    testCurrentConnection();
  }, []);

  const testCurrentConnection = async () => {
    try {
      setConnectionResult({
        isConnected: false,
        message: 'Testing current Supabase configuration...',
        error: null
      });

      // Log the environment variables for debugging
      console.log('Current environment variables:');
      console.log('VITE_SUPABASE_URL:', envUrl);
      console.log('VITE_SUPABASE_ANON_KEY (first 10 chars):', envKey ? envKey.substring(0, 10) + '...' : 'Not set');

      // Check if environment variables are set
      if (!envUrl || !envKey) {
        setConnectionResult({
          isConnected: false,
          message: 'Missing Supabase environment variables',
          error: 'VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY not set in .env file'
        });
        return;
      }

      // Create a new Supabase client with current environment variables
      const supabase = createClient(envUrl, envKey);

      // Try a simple query to check if connection works
      const { data, error } = await supabase.from('bookings').select('id').limit(1);

      if (error) {
        throw error;
      }

      setConnectionResult({
        isConnected: true,
        message: 'Connected to Supabase successfully!',
        error: null,
        details: data
      });
    } catch (err: any) {
      console.error('Failed to connect to Supabase:', err);
      setConnectionResult({
        isConnected: false,
        message: 'Connection failed',
        error: err.message || err,
        details: err
      });
    }
  };

  const testCustomConnection = async () => {
    if (!customUrl || !customKey) {
      setConnectionResult({
        isConnected: false,
        message: 'Please provide both URL and API key',
        error: 'Missing URL or API key'
      });
      return;
    }

    try {
      setConnectionResult({
        isConnected: false,
        message: 'Testing custom Supabase configuration...',
        error: null
      });

      // Validate URL format
      if (!customUrl.startsWith('https://')) {
        throw new Error('URL must start with https://');
      }

      // Create a new Supabase client with custom credentials
      const supabase = createClient(customUrl, customKey);

      // Try a simple query to check if connection works
      const { data, error } = await supabase.from('bookings').select('id').limit(1);

      if (error) {
        throw error;
      }

      setConnectionResult({
        isConnected: true,
        message: 'Connected to Supabase successfully with custom credentials!',
        error: null,
        details: data
      });
    } catch (err: any) {
      console.error('Failed to connect to Supabase with custom credentials:', err);
      setConnectionResult({
        isConnected: false,
        message: 'Custom connection failed',
        error: err.message || err
      });
    }
  };

  const formatJWTForDisplay = (token: string) => {
    try {
      if (!token) return 'Not provided';
      
      // Split JWT into its parts
      const parts = token.split('.');
      if (parts.length !== 3) return 'Invalid format (not a JWT token)';
      
      // Show parts in a structured way
      return (
        <div className="font-mono text-xs break-all">
          <div className="bg-blue-900/30 p-1 rounded">
            <span className="text-blue-300">Header:</span> {parts[0].substring(0, 10)}...
          </div>
          <div className="bg-green-900/30 p-1 rounded mt-1">
            <span className="text-green-300">Payload:</span> {parts[1].substring(0, 10)}...
          </div>
          <div className="bg-purple-900/30 p-1 rounded mt-1">
            <span className="text-purple-300">Signature:</span> {parts[2].substring(0, 10)}...
          </div>
        </div>
      );
    } catch (e) {
      return 'Error parsing token';
    }
  };

  const getTokenInfo = (token: string) => {
    if (!token) return { isValid: false, message: 'No token provided' };
    
    // Check if it's in JWT format
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { 
        isValid: false, 
        message: 'Token is not in valid JWT format (should have 3 parts separated by dots)' 
      };
    }
    
    try {
      // Decode the payload (middle part)
      const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadStr);
      
      // Check if it has Supabase-specific fields
      if (!payload.iss || payload.iss !== 'supabase' || !payload.ref) {
        return { 
          isValid: false, 
          message: 'Token does not appear to be a valid Supabase JWT token',
          details: payload
        };
      }
      
      return {
        isValid: true,
        message: 'Token appears to be a valid Supabase JWT',
        details: {
          issuer: payload.iss,
          projectRef: payload.ref,
          role: payload.role,
          issuedAt: new Date(payload.iat * 1000).toISOString(),
          expires: new Date(payload.exp * 1000).toISOString()
        }
      };
    } catch (e) {
      return { 
        isValid: false, 
        message: 'Failed to decode token: ' + (e instanceof Error ? e.message : String(e))
      };
    }
  };

  const copyEnvFileContent = () => {
    const envContent = `# Supabase Configuration
# Updated on ${new Date().toISOString().split('T')[0]}

# The URL to your Supabase project
VITE_SUPABASE_URL=${customUrl}

# The anon/public key (safe to use in browser)
VITE_SUPABASE_ANON_KEY=${customKey}`;

    navigator.clipboard.writeText(envContent)
      .then(() => alert('Environment file content copied to clipboard!\n\nPaste this into your .env file and restart the development server.'))
      .catch(() => alert('Failed to copy to clipboard. Please manually create your .env file.'));
  };

  const tokenInfo = getTokenInfo(customKey || envKey);
  const tokenInfoCurrent = getTokenInfo(envKey);

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-xl max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">🛠️ Supabase Connection Fixer</h2>
      
      {/* Current connection status */}
      <div className={`p-4 ${connectionResult.isConnected ? 'bg-green-900/30' : 'bg-red-900/30'} rounded-lg mb-6`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${connectionResult.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">{connectionResult.isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <p className="mt-2">{connectionResult.message}</p>
        
        {connectionResult.error && (
          <details className="mt-3">
            <summary className="cursor-pointer text-red-300 hover:underline">View error details</summary>
            <pre className="bg-gray-900 p-2 mt-2 rounded text-xs overflow-auto max-h-48">
              {typeof connectionResult.error === 'string' 
                ? connectionResult.error 
                : JSON.stringify(connectionResult.error, null, 2)}
            </pre>
          </details>
        )}
        
        {connectionResult.details && (
          <details className="mt-3">
            <summary className="cursor-pointer text-blue-300 hover:underline">View connection details</summary>
            <pre className="bg-gray-900 p-2 mt-2 rounded text-xs overflow-auto max-h-48">
              {JSON.stringify(connectionResult.details, null, 2)}
            </pre>
          </details>
        )}
      </div>
      
      {/* Current environment variables */}
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Environment Variables</h3>
        
        <div className="mb-3">
          <p className="text-sm text-gray-300 mb-1">VITE_SUPABASE_URL:</p>
          <div className="bg-gray-800 p-2 rounded font-mono text-sm break-all">
            {envUrl || 'Not set'}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-300 mb-1">VITE_SUPABASE_ANON_KEY:</p>
          <div className="bg-gray-800 p-2 rounded font-mono text-sm break-all">
            {envKey 
              ? <>
                  {envKey.substring(0, 12)}...{envKey.substring(envKey.length - 8)}
                  <div className="mt-2">{formatJWTForDisplay(envKey)}</div>
                </>
              : 'Not set'}
          </div>
          
          {envKey && (
            <div className={`mt-2 p-2 rounded ${tokenInfoCurrent.isValid ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
              <p className="text-sm">
                {tokenInfoCurrent.isValid 
                  ? '✅ Valid Supabase JWT token format' 
                  : '❌ ' + tokenInfoCurrent.message}
              </p>
              
              {tokenInfoCurrent.isValid && tokenInfoCurrent.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-green-300 hover:underline">View token details</summary>
                  <div className="mt-1 bg-gray-900/50 p-2 rounded text-xs">
                    <p><span className="text-gray-400">Project:</span> {tokenInfoCurrent.details.projectRef}</p>
                    <p><span className="text-gray-400">Role:</span> {tokenInfoCurrent.details.role}</p>
                    <p><span className="text-gray-400">Issued:</span> {tokenInfoCurrent.details.issuedAt}</p>
                    <p><span className="text-gray-400">Expires:</span> {tokenInfoCurrent.details.expires}</p>
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <button 
            onClick={testCurrentConnection} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Test Current Connection
          </button>
        </div>
      </div>
      
      {/* Toggle for custom credentials form */}
      <div className="mb-6">
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors w-full"
        >
          {isVisible ? 'Hide Custom Configuration' : 'Try Custom Supabase Configuration'}
        </button>
      </div>
      
      {/* Custom credentials form */}
      {isVisible && (
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Custom Supabase Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="customUrl" className="block text-sm text-gray-300 mb-1">Supabase URL:</label>
              <input
                id="customUrl"
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://your-project-ref.supabase.co"
                className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20 outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="customKey" className="block text-sm text-gray-300 mb-1">Supabase Anon Key:</label>
              <input
                id="customKey"
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20 outline-none"
              />
            </div>
            
            {customKey && (
              <div className={`mt-2 p-2 rounded ${tokenInfo.isValid ? 'bg-green-900/30' : 'bg-yellow-900/30'}`}>
                <p className="text-sm">
                  {tokenInfo.isValid 
                    ? '✅ Valid Supabase JWT token format' 
                    : '⚠️ ' + tokenInfo.message}
                </p>
                
                {tokenInfo.isValid && tokenInfo.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-green-300 hover:underline">View token details</summary>
                    <div className="mt-1 bg-gray-900/50 p-2 rounded text-xs">
                      <p><span className="text-gray-400">Project:</span> {tokenInfo.details.projectRef}</p>
                      <p><span className="text-gray-400">Role:</span> {tokenInfo.details.role}</p>
                      <p><span className="text-gray-400">Issued:</span> {tokenInfo.details.issuedAt}</p>
                      <p><span className="text-gray-400">Expires:</span> {tokenInfo.details.expires}</p>
                    </div>
                  </details>
                )}
              </div>
            )}
            
            <div className="flex gap-3 mt-4">
              <button 
                onClick={testCustomConnection}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                disabled={!customUrl || !customKey}
              >
                Test Connection
              </button>
              
              <button 
                onClick={copyEnvFileContent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={!customUrl || !customKey}
              >
                Copy .env Content
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Help section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Troubleshooting Tips</h3>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Ensure your Supabase project is active and not paused</li>
            <li>Make sure the anon key is in the correct JWT format (should start with eyJ...)</li>
            <li>Check for typos in your URL or key</li>
            <li>After updating your .env file, restart your development server</li>
            <li>Verify the bookings table exists in your Supabase project</li>
            <li>Ensure Row Level Security policies are properly configured</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-400">
        <p>
          Note: Environment variables in Vite are embedded at build time. 
          After changing your .env file, you need to restart your development server for changes to take effect.
        </p>
      </div>
    </div>
  );
};

export default SupabaseConnectionFixer;
