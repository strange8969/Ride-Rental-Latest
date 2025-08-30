import SimpleConnectionTest from "../components/SimpleConnectionTest";
import BookingDiagnostic from "../components/BookingDiagnostic";
import DateTimeBookingTest from "../components/DateTimeBookingTest";
import NumberInputTest from "../components/NumberInputTest";

const TestPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Supabase Connection Test</h1>
      
      <SimpleConnectionTest />
      
      <div className="mt-8">
        <BookingDiagnostic />
      </div>
      
      <div className="mt-8">
        <DateTimeBookingTest />
      </div>
      
      <div className="mt-8">
        <NumberInputTest />
      </div>
      
      <div className="max-w-2xl mx-auto mt-12 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>Make sure your Supabase URL is correct: <code className="bg-gray-200 px-1 py-0.5 rounded">https://tybqzpwhefxrcfcsqqef.supabase.co</code></li>
          <li>Verify you're using the <strong>anon/public</strong> API key from your Supabase dashboard</li>
          <li>Check that your Supabase project is active (not in paused state)</li>
          <li>Ensure the <code className="bg-gray-200 px-1 py-0.5 rounded">bookings</code> table exists in your database</li>
          <li>Make sure Row Level Security policies are set up correctly</li>
        </ul>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800">Getting Your API Key</h3>
          <ol className="list-decimal pl-6 mt-2 space-y-1 text-sm text-yellow-700">
            <li>Go to <a href="https://supabase.com/dashboard" className="text-blue-600 underline">Supabase Dashboard</a></li>
            <li>Select your project: tybqzpwhefxrcfcsqqef</li>
            <li>Click on "Project Settings" (gear icon)</li>
            <li>Go to "API" in the sidebar</li>
            <li>Copy the "anon public" key (NOT the service_role key)</li>
            <li>Update your .env file with this key</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
