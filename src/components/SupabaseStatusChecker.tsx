import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { runAllSupabaseTests } from '../utils/debugSupabase';

const SupabaseStatusChecker = () => {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    message: string;
    error: any;
    details: any;
    testsPassed: boolean;
  }>({
    isConnected: false,
    message: 'Checking connection...',
    error: null,
    details: null,
    testsPassed: false
  });

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('Running comprehensive Supabase tests...');
        
        // Log environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        console.log('Environment check:');
        console.log('- VITE_SUPABASE_URL:', supabaseUrl || 'NOT SET');
        console.log('- VITE_SUPABASE_ANON_KEY:', hasSupabaseKey ? 'Set (hidden)' : 'NOT SET');
        
        // If environment variables are missing, show error
        if (!supabaseUrl || !hasSupabaseKey) {
          setStatus({
            isConnected: false,
            message: 'Environment variables missing',
            error: 'VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY not set in .env file',
            details: { supabaseUrl: !!supabaseUrl, hasSupabaseKey },
            testsPassed: false
          });
          return;
        }
        
        // Run comprehensive tests
        const testResults = await runAllSupabaseTests();
        
        if (testResults.allPassed) {
          setStatus({
            isConnected: true,
            message: 'All tests passed! Supabase is working correctly.',
            error: null,
            details: testResults.tests,
            testsPassed: true
          });
        } else {
          // Find the first failed test
          const tests = testResults.tests;
          let errorMessage = 'Connection tests failed';
          let errorDetails = null;
          
          if (tests.connection && !tests.connection.success) {
            errorMessage = 'Connection failed: ' + tests.connection.error;
            errorDetails = tests.connection.details;
          } else if (tests.tableCheck && !tests.tableCheck.success) {
            errorMessage = 'Table check failed: ' + tests.tableCheck.error;
            errorDetails = tests.tableCheck.details;
          } else if (tests.insertTest && !tests.insertTest.success) {
            errorMessage = 'Insert test failed: ' + tests.insertTest.error;
            errorDetails = tests.insertTest.details;
          }
          
          setStatus({
            isConnected: false,
            message: errorMessage,
            error: errorDetails,
            details: testResults.tests,
            testsPassed: false
          });
        }
      } catch (err: any) {
        console.error('Unexpected error during Supabase tests:', err);
        setStatus({
          isConnected: false,
          message: `Error: ${err.message}`,
          error: err,
          details: null,
          testsPassed: false
        });
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black bg-opacity-90 text-white rounded-lg shadow-lg z-50 max-w-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Supabase Status</h3>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      </div>
      
      <div className="flex items-center mt-2">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            status.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
        <span>{status.isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      <p className="mt-1 text-sm">{status.message}</p>
      
      {showAll && (
        <div className="mt-3 border-t border-gray-700 pt-2">
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(JSON.stringify(status.details, null, 2));
                alert('Debug info copied to clipboard!');
              }}
              className="text-xs bg-blue-700 px-2 py-1 rounded hover:bg-blue-600"
            >
              Copy Debug Info
            </button>
            
            <a
              href="https://app.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-emerald-700 px-2 py-1 rounded hover:bg-emerald-600"
            >
              Open Supabase Dashboard
            </a>
          </div>
          
          {status.error && (
            <details className="mt-2" open>
              <summary className="cursor-pointer text-xs text-red-300">Error details</summary>
              <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-auto max-h-28">
                {JSON.stringify(status.error, null, 2)}
              </pre>
            </details>
          )}
          
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-blue-300">All test results</summary>
            <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(status.details, null, 2)}
            </pre>
          </details>
          
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-yellow-300">Environment</summary>
            <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-auto max-h-28">
              {`VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL || 'not set'}\nVITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '[hidden for security]' : 'not set'}`}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default SupabaseStatusChecker;
