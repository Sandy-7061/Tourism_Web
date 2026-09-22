import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Users, Wifi, Car, Coffee } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import hotels from '../data/hotels';
import { PriceTag, StarRating, SectionHeader, HotelStars } from '../components/ui/GlassCard';
import { useApp } from '../context/AppContext';

const CITIES = ['All', 'Udaipur', 'Jaipur', 'Kochi', 'Goa', 'Shimla', 'Agra', 'Srinagar', 'Munnar', 'Manali', 'Rishikesh', 'Coorg', 'Jim Corbett'];
const TYPES = ['All', '3 Star', '4 Star', '5 Star'];

export default function Hotels() {
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [stars, setStars] = useState(0);
  const [search, setSearch] = useState('');
  const { addToWishlist, removeFromWishlist, isWishlisted } = useApp();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return hotels.filter(h => {
      if (city !== 'All' && h.destination !== city) return false;
      if (type !== 'All' && h.category !== Number(type.split(' ')[0])) return false;
      if (stars > 0 && h.category < stars) return false;
      if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.destination.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [city, type, stars, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-hero text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Hotels</h1>
          <p className="text-white/70 text-lg">Premium stays across India's most beautiful destinations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search hotels..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 bg-white" />
          </div>
          <select value={stars} onChange={e => setStars(Number(e.target.value))} className="input-field bg-white w-auto">
            <option value={0}>All Star Ratings</option>
            {[3, 4, 5].map(s => <option key={s} value={s}>{s}+ Stars</option>)}
          </select>
        </div>

        {/* City filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
                ${city === c ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-600 border-gray-200'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
                ${type === t ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-600 border-gray-200'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hotel, i) => (
            <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 border border-gray-100">
                <div className="relative h-52 overflow-hidden">
                  <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/90
                      ${hotel.type === 'Luxury' ? 'text-amber-700' : hotel.type === 'Heritage' ? 'text-rose-700' : 'text-gray-700'}`}>
                      {hotel.type}
                    </span>
                  </div>
                  <button onClick={() => isWishlisted(hotel.id) ? removeFromWishlist(hotel.id) : addToWishlist(hotel.id, 'Hotel')}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all
                      ${isWishlisted(hotel.id) ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-500'}`}>
                    ♥
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-navy-900 text-lg leading-snug">{hotel.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-400 mt-0.5">
                        <MapPin size={13} /> {hotel.destination}
                      </div>
                    </div>
                    <HotelStars count={hotel.category} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={hotel.rating} showCount count={hotel.reviewCount} />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {hotel.amenities.slice(0, 4).map(a => (
                      <span key={a} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-lg font-bold text-navy-900">₹{hotel.priceFrom.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-400">per night</div>
                    </div>
                    <Link to={`/hotels/${hotel.slug}`} className="btn-primary py-2 px-4 text-sm">View Hotel</Link>
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
