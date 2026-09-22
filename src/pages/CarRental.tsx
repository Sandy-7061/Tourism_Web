import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Car, Users, Fuel, SlidersHorizontal, Star, MapPin, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import cars from '../data/cars';
import { PriceTag, StarRating, SectionHeader } from '../components/ui/GlassCard';
import { useApp } from '../context/AppContext';

const CAR_TYPES = ['All', 'Hatchback', 'Sedan', 'SUV', 'Luxury', 'Tempo Traveller', 'Bus'];
const FUEL_TYPES = ['All', 'CNG', 'Diesel', 'Petrol', 'Electric'];

export default function CarRental() {
  const [carType, setCarType] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [minSeats, setMinSeats] = useState(0);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');
  const { setCurrentBooking } = useApp();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return cars.filter(c => {
      if (carType !== 'All' && c.category !== carType) return false;
      if (fuelFilter !== 'All' && c.fuel !== fuelFilter) return false;
      if (minSeats > 0 && c.capacity < minSeats) return false;
      return true;
    });
  }, [carType, fuelFilter, minSeats]);

  const handleBook = (carId: string) => {
    setCurrentBooking({ carId, travelDate: date });
    navigate('/book/details');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-hero text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Car Rental</h1>
          <p className="text-white/70 text-lg">20+ vehicles · Experienced drivers · Transparent pricing</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white shadow-card">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue" />
              <input type="text" placeholder="Pickup city" value={pickup} onChange={e => setPickup(e.target.value)} className="input-field pl-9" />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-orange" />
              <input type="text" placeholder="Drop city" value={drop} onChange={e => setDrop(e.target.value)} className="input-field pl-9" />
            </div>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue" />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field pl-9" />
            </div>
            <button className="btn-primary justify-center"><Search size={18} /> Search Cars</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-sm font-semibold text-navy-900 flex items-center gap-1 mr-2"><Car size={16} /> Type:</span>
          {CAR_TYPES.map(t => (
            <button key={t} onClick={() => setCarType(t)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
                ${carType === t ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm font-semibold text-navy-900 flex items-center gap-1 mr-2"><Fuel size={16} /> Fuel:</span>
          {FUEL_TYPES.map(f => (
            <button key={f} onClick={() => setFuelFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
                ${fuelFilter === f ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((car, i) => (
            <motion.div key={car.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 border border-gray-100">
                <div className="relative h-40 overflow-hidden bg-gray-50">
                  <img src={car.images[0]} alt={car.name} className="w-full h-full object-contain p-4" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      car.fuel === 'Electric' ? 'bg-emerald-100 text-emerald-700' :
                      car.fuel === 'CNG' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {car.fuel}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-navy-900 mb-1">{car.name}</h3>
                  <div className="text-xs text-gray-400 mb-2">{car.category} · {car.model}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Users size={12} /> {car.capacity} seats</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Car size={12} /> {car.transmission}</span>
                    {car.ac && <span className="flex items-center gap-1 text-xs text-gray-500">❄️ AC</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {car.amenities.slice(0, 3).map(f => (
                      <span key={f} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-lg font-bold text-navy-900">₹{car.pricePerKm}/km</div>
                      <div className="text-xs text-gray-400">Min {car.baseKm} km/day</div>
                    </div>
                    <button onClick={() => handleBook(car.id)} className="btn-primary py-2 px-3 text-sm">Book</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
