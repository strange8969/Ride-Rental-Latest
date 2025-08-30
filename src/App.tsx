import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SupabaseStatusChecker from './components/SupabaseStatusChecker';
import TestPage from './components/TestPage';
import HomePage from './pages/HomePage';
import SportsBikePage from './pages/SportsBikePage';
import NormalBikePage from './pages/NormalBikePage';
import ScootyPage from './pages/ScootyPage';
import ContactPage from './pages/ContactPage';
import SetupContactsTable from './pages/SetupContactsTable';
import SetupPage from './pages/SetupPage';
import SupabaseFixPage from './pages/SupabaseFixPage';
import { checkSupabaseEnv } from './utils/checkEnv';

function App() {
  // Get the basename from the current URL if it's a subdomain
  const getBasename = () => {
    // For development environment, use empty string
    if (window.location.hostname === 'localhost') return '/';
    
    // For production with subdomains, extract the path
    const urlParts = window.location.pathname.split('/');
    if (urlParts.length > 1 && urlParts[1] !== '') {
      return `/${urlParts[1]}`;
    }
    return '/';
  };

  // Check Supabase environment variables on app startup
  useEffect(() => {
    const envStatus = checkSupabaseEnv();
    console.log('Supabase environment check:', envStatus.isValid ? 'OK' : 'Failed');
    
    // Skip database connection test to avoid blocking the UI
    console.log('Skipping Supabase connection test to prevent blocking');
  }, []);

  return (
    <Router basename={getBasename()}>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/sports-bikes" element={<SportsBikePage />} />
          <Route path="/normal-bikes" element={<NormalBikePage />} />
          <Route path="/scooties" element={<ScootyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/setup-contacts" element={<SetupContactsTable />} />
          <Route path="/setup-supabase" element={<SetupPage />} />
          <Route path="/fix-supabase" element={<SupabaseFixPage />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
        {/* Add Supabase Status Checker in development mode */}
        {import.meta.env.DEV && <SupabaseStatusChecker />}
      </div>
    </Router>
  );
}

export default App;