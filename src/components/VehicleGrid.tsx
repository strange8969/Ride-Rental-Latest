import React from 'react';
import VehicleCard from './VehicleCard';

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

interface VehicleGridProps {
  vehicles: Vehicle[];
  onBookNow: (vehicle: Vehicle) => void;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, onBookNow }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onBookNow={onBookNow} />
      ))}
    </div>
  );
};

export default VehicleGrid;