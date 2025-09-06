import React from 'react';
import VehicleGrid from '../components/VehicleGrid';
import BookingModal from '../components/BookingModal';
import activaImg from '../img/activa-6g-right-front-three-quarter-3.avif';
import zestImg from '../img/tvs-scooty-zest66bb1c222451f.avif';

const ScootyPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<any>(null);

  const scooties = [
    {
      id: 1,
      name: 'Honda Activa 6G',
      image: activaImg,
      price: '₹450/day',
      specs: {
        engine: '109cc',
        power: '7.79 HP',
        mileage: '55 kmpl',
        type: 'Scooter'
      }
    },
    {
      id: 2,
      name: 'TVS Zest 110',
      image: zestImg,
      price: '₹400/day',
      specs: {
        engine: '109cc',
        power: '7.47 HP',
        mileage: '62 kmpl',
        type: 'Scooter'
      }
    },
    
  ];

  const handleBookNow = (vehicle: any) => {
    const bookingData = {
      category: 'Scooty',
      model: vehicle.name,
      pricePerDay: parseInt(vehicle.price.replace('₹', '').replace('/day', ''))
    };
    setSelectedVehicle(bookingData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 pt-20">
        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-center items-center text-center gap-2">
              <div className="flex items-center">
                <span className="animate-pulse mr-2 text-xl">🛵</span>
                <p className="font-bold text-lg">WEEKLY DEAL:</p>
              </div>
              <p className="font-semibold">
                Book any Scooty for a WEEK and save 35% on your rental!
              </p>
              <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                Best Value
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Scooties
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Easy-to-ride scooters perfect for city navigation and short trips. Convenient, economical, and user-friendly.
            </p>
          </div>

          {/* Vehicle Grid */}
          <VehicleGrid vehicles={scooties} onBookNow={handleBookNow} />
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bookingData={selectedVehicle}
      />
    </>
  );
};

export default ScootyPage;