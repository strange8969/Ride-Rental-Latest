import React from 'react';
import SupabaseConnectionFixer from '../components/SupabaseConnectionFixer';

const SupabaseFixPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Supabase Connection Fixer</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">What This Tool Does:</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Tests your current Supabase connection</li>
            <li>Validates your API key format</li>
            <li>Helps you fix common connection issues</li>
            <li>Provides guidance on troubleshooting</li>
          </ul>
          
          <div className="mt-6 p-4 bg-yellow-800/30 border border-yellow-700/50 rounded-lg">
            <h3 className="font-semibold text-yellow-300 mb-2">Important Notes:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-yellow-100">
              <li>Make sure your Supabase project is active and not paused</li>
              <li>After updating your .env file, restart your development server</li>
              <li>Your API key should be in JWT format (eyJ...)</li>
              <li>Ensure your database has the required tables</li>
            </ul>
          </div>
        </div>
        
        <SupabaseConnectionFixer />
        
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>If you continue to have issues, please check the Supabase documentation or contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseFixPage;
