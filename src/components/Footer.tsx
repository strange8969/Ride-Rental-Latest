import { Link } from 'react-router-dom';
import { Bike, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Bike className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-bold">RideRental</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted partner for bike and scooter rentals. Ride your dream vehicle today with our premium rental services.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">+91 8827326825</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">riderental68@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sports-bikes" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Sports Bikes
                </Link>
              </li>
              <li>
                <Link to="/normal-bikes" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Normal Bikes
                </Link>
              </li>
              <li>
                <Link to="/scooties" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Scooties
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-yellow-400 mt-1" />
                <span className="text-sm text-gray-300">
                   VIT Bhopal, Kothri Kalan, Sehore,<br />
                   Madhya Pradesh
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">+91 8827326825</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">riderental68@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 RideRental. All rights reserved. | Designed for premium bike rental experience.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;