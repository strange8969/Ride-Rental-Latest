import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import shineImg from '../img/sp1256789e3e35c30f.avif';
import activaImg from '../img/activa-6g-right-front-three-quarter-3.avif';
import pulsar150Img from '../img/pulsar150.avif';


const HomePage = () => {
  const rentalOptions = [
    {
      title: 'Sports Bike',
      price: '₹600',
      period: 'day',
      image: pulsar150Img,
      description: 'High-performance bikes for thrill seekers',
      link: '/sports-bikes',
      buttonText: 'View Sports Bikes'
    },
    {
      title: 'Normal Bike',
      price: '₹450',
      period: 'day',
      image: shineImg,
      description: 'Comfortable rides for daily commuting',
      link: '/normal-bikes',
      buttonText: 'View Normal Bikes'
    },
    {
      title: 'Scooty',
      price: '₹400',
      period: 'day',
      image: activaImg,
      description: 'Easy and convenient city transportation',
      link: '/scooties',
      buttonText: 'View Scooties'
    }
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: 'Instant Booking',
      description: 'Book your ride in just a few clicks'
    },
    {
      icon: <Shield className="h-8 w-8 text-yellow-400" />,
      title: 'Fully Insured',
      description: 'All vehicles are fully insured for your safety'
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-400" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-black py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center text-center">
            <span className="animate-pulse mr-2">🔥</span>
            <p className="font-bold text-sm sm:text-base">
              LIMITED TIME OFFER: 10% OFF on Pulsar bikes + Get 35% OFF on WEEKLY BOOKINGS! 
              <Link to="/sports-bikes" className="underline hover:text-white ml-2 whitespace-nowrap">
                Book Now
              </Link>
            </p>
            <span className="animate-pulse ml-2">🔥</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${pulsar150Img})`
        }}
      >
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Ride Your Dream – 
            <span className="text-yellow-400"> Rent Today!</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
            Experience the freedom of the road with our premium collection of bikes and scooters
          </p>
          <Link
            to="/sports-bikes"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/25"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Rental Options */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Choose Your Ride
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Select from our premium collection of vehicles, each maintained to the highest standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rentalOptions.map((option, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden hover:shadow-yellow-400/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-yellow-400/50"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                    <span className="text-lg font-bold">{option.price}</span>
                    <span className="text-sm">/{option.period}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{option.title}</h3>
                  <p className="text-gray-300 mb-6">{option.description}</p>
                  <Link
                    to={option.link}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-yellow-400/25"
                  >
                    {option.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose RideRental?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We provide the best rental experience with premium vehicles and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/10"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book your perfect ride today and experience the freedom of the open road
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/25"
          >
            Contact Us Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;