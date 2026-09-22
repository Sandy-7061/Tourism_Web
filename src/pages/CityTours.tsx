import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cityTours } from '../data/cityTours';
import { StarRating, PriceTag, SectionHeader } from '../components/ui/GlassCard';

const CITIES = ['All', 'Udaipur', 'Jaipur', 'Agra', 'Delhi', 'Mumbai', 'Varanasi', 'Goa', 'Kochi', 'Mysore', 'Jodhpur', 'Rishikesh', 'Manali'];

export default function CityTours() {
  const [city, setCity] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = cityTours.filter(t => {
    if (city !== 'All' && t.city !== city) return false;
    if (search && !t.city.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-hero text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">City Tours</h1>
          <p className="text-white/70 text-lg">Expert-guided day tours across India's most iconic cities</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search cities..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 bg-white" />
          </div>
        </div>

        {/* City filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${city === c ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour, i) => (
            <motion.div key={tour.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/city-tours/${tour.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={tour.thumbnail} alt={`${tour.city} Tour`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-display font-bold text-xl">{tour.city}</h3>
                    <div className="text-white/80 text-sm">{tour.duration} City Tour</div>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> {tour.rating}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tour.highlights.slice(0, 3).map(h => (
                      <span key={h} className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-lg">{h.slice(0, 22)}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Clock size={13} /> {tour.duration}</span>
                    <span className="flex items-center gap-1"><Users size={13} /> Max {tour.groupSize}</span>
                    <StarRating rating={tour.rating} showCount count={tour.reviewCount} />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <PriceTag price={tour.price} originalPrice={tour.originalPrice} suffix="/person" />
                    <span className="btn-primary py-2 px-4 text-sm">Book Tour</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
