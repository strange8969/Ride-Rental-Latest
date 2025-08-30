import React from 'react';
import { Fuel, Zap, Settings, Calendar } from 'lucide-react';

interface Vehicle {
  id: number;
  name: string;
  image: string;
  price: string;
  specs: {
    engine: string;
    power: string;
    mileage: string;
    type: string;
  };
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onBookNow: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onBookNow }) => {
  const handleBookNow = () => {
    onBookNow(vehicle);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden hover:shadow-yellow-400/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-yellow-400/50">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full font-bold">
          <span className="font-bold">{vehicle.price}</span>
        </div>
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {vehicle.specs.type}
        </div>
        
        {/* Discount Badge for Pulsar bikes */}
        {vehicle.name.includes('Pulsar') && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-red-600 to-yellow-600 py-1.5 px-3 text-center">
            <div className="animate-pulse text-white font-bold text-sm">
              <span className="mr-1">🔥</span> 10% OFF on 24-hour bookings <span className="ml-1">🔥</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">{vehicle.name}</h3>
        
        {/* Specifications */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-yellow-400" />
            <div>
              <p className="text-xs text-gray-400">Engine</p>
              <p className="text-sm font-semibold text-gray-200">{vehicle.specs.engine}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <div>
              <p className="text-xs text-gray-400">Power</p>
              <p className="text-sm font-semibold text-gray-200">{vehicle.specs.power}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Fuel className="h-4 w-4 text-green-400" />
            <div>
              <p className="text-xs text-gray-400">Mileage</p>
              <p className="text-sm font-semibold text-gray-200">{vehicle.specs.mileage}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            <div>
              <p className="text-xs text-gray-400">Available</p>
              <p className="text-sm font-semibold text-green-600">Today</p>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg hover:shadow-yellow-400/25"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;