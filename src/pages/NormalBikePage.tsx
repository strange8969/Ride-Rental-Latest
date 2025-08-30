import React from 'react';
import VehicleGrid from '../components/VehicleGrid';
import BookingModal from '../components/BookingModal';
import platinaImg from '../img/platina-110-right-front-three-quarter-8.avif';
import hfDeluxeImg from '../img/hf-deluxe-right-front-three-quarter.avif';
import splendorImg from '../img/hero-motocorp-splendor68541139c73c8.avif';
import passionImg from '../img/passion-plus-left-front-three-quarter-2.avif';
import shineImg from '../img/sp1256789e3e35c30f.avif';

const NormalBikePage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<any>(null);

  const normalBikes = [
    {
      id: 1,
      name: 'Honda Shine',
      image: shineImg,
      price: '₹450/day',
      specs: {
        engine: '124cc',
        power: '10.7 HP',
        mileage: '55 kmpl',
        type: 'Street'
      }
    },
    {
      id: 2,
      name: 'Bajaj Platina',
      image: platinaImg,
      price: '₹450/day',
      specs: {
        engine: '102cc',
        power: '8.1 HP',
        mileage: '70 kmpl',
        type: 'Street'
      }
    },
    {
      id: 3,
      name: 'Hero Splendor Plus',
      image: splendorImg,
      price: '₹450/day',
      specs: {
        engine: '97cc',
        power: '8.02 HP',
        mileage: '60 kmpl',
        type: 'Street'
      }
    },
    {
      id: 4,
      name: 'Hero Passion',
      image: passionImg,
      price: '₹450/day',
      specs: {
        engine: '109cc',
        power: '8.4 HP',
        mileage: '60 kmpl',
        type: 'Street'
      }
    },
   
    {
      id: 6,
      name: 'Hero HF Deluxe',
      image: hfDeluxeImg,
      price: '₹450/day',
      specs: {
        engine: '100cc',
        power: '12.4 HP',
        mileage: '50 kmpl',
        type: 'Street'
      }
    }
  ];

  const handleBookNow = (vehicle: any) => {
    const bookingData = {
      category: 'Normal Bike',
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
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-center items-center text-center gap-2">
              <div className="flex items-center">
                <span className="animate-pulse mr-2 text-xl">⚡</span>
                <p className="font-bold text-lg">WEEKLY SPECIAL:</p>
              </div>
              <p className="font-semibold">
                Book any Normal Bike for a WEEK and get 35% OFF!
              </p>
              <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                Save Big
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Normal Bikes
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Reliable and fuel-efficient bikes perfect for daily commuting and city rides. Comfort meets affordability.
            </p>
          </div>

          {/* Vehicle Grid */}
          <VehicleGrid vehicles={normalBikes} onBookNow={handleBookNow} />
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

export default NormalBikePage;