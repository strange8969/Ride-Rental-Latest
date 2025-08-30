import { useState } from 'react';
import VehicleGrid from '../components/VehicleGrid';
import BookingModal from '../components/BookingModal';
import pulsar150Img from '../img/pulsar150.avif';
import pulsar125Img from '../img/pulsar-125-left-front-three-quarter.avif';
import apacheImg from '../img/apache-160-right-side-view.avif';
import royalEnfieldImg from '../img/royal350.avif';


const SportsBikePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const sportsBikes = [
    {
      id: 1,
      name: 'Royal Enfield Bullet',
      image: royalEnfieldImg,
      price: '₹800/day',
      specs: {
        engine: '350cc',
        power: '18.6 HP',
        mileage: '40 kmpl',
        type: 'Sports'
      }
    },
    {
      id: 2,
      name: 'Bajaj Pulsar 150',
      image: pulsar150Img,
      price: '₹500/day',
      specs: {
        engine: '150cc',
        power: '25 HP',
        mileage: '35 kmpl',
        type: 'Sports'
      }
    },
    {
      id: 3,
      name:'Bajaj Pulsar 125',
      image: pulsar125Img,
      price: '₹500/day',
      specs: {
        engine: '125cc',
        power: '17.1 HP',
        mileage: '42 kmpl',
        type: 'Sports'
      }
    },
    {
      id: 4,
      name: 'TVS Apache RTR 160',
      image: apacheImg,
      price: '₹550/day',
      specs: {
        engine: '160cc',
        power: '24.5 HP',
        mileage: '38 kmpl',
        type: 'Sports'
      }
    },

    
  ];

  const handleBookNow = (vehicle: any) => {
    const bookingData = {
      category: 'Sports Bike',
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
        <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-black py-4 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-center items-center text-center gap-2">
              <div className="flex items-center">
                <span className="animate-pulse mr-2 text-xl">🔥</span>
                <p className="font-bold text-lg">SPECIAL OFFER:</p>
              </div>
              <p className="font-semibold">
                Get 10% OFF on Pulsar bikes + 35% OFF on WEEKLY BOOKINGS!
              </p>
              <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                Limited Time
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Sports Bikes
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the thrill of high-performance sports bikes. Perfect for adrenaline junkies and speed enthusiasts.
            </p>
          </div>

          {/* Vehicle Grid */}
          <VehicleGrid vehicles={sportsBikes} onBookNow={handleBookNow} />
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

export default SportsBikePage;