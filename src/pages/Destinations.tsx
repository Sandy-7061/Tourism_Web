import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Grid, List, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import destinations from '../data/destinations';

const CATEGORIES = ['All', 'Heritage', 'Beach', 'Nature', 'Adventure', 'Spiritual', 'Hill Station', 'Wildlife'];

export default function Destinations() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = destinations.filter(d => {
    if (category !== 'All' && !d.popularFor.some(p => p.toLowerCase().includes(category.toLowerCase()))) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.state.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-hero text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Destinations</h1>
          <p className="text-white/70 text-lg">Explore {destinations.length}+ incredible destinations across India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + view mode */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 bg-white" />
          </div>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button onClick={() => setViewMode('grid')} className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-brand-blue text-white' : 'text-gray-500'}`}><Grid size={18} /></button>
            <button onClick={() => setViewMode('list')} className={`p-3 transition-all ${viewMode === 'list' ? 'bg-brand-blue text-white' : 'text-gray-500'}`}><List size={18} /></button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
                ${category === c ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-600 border-gray-200'}`}>
              {c}
            </button>
          ))}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((dest, i) => (
              <motion.div key={dest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/destinations/${dest.slug}`}
                  className="group block relative rounded-2xl overflow-hidden aspect-[3/4] card-hover">
                  <img src={dest.thumbnail} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-base leading-tight">{dest.name}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{dest.state}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-semibold">{dest.rating}</span>
                      <span className="text-white/50 text-xs ml-1">{dest.packageCount} pkgs</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/90 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{dest.popularFor[0]}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((dest, i) => (
              <motion.div key={dest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/destinations/${dest.slug}`}
                  className="group flex gap-5 bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all border border-gray-100 p-4">
                  <img src={dest.thumbnail} alt={dest.name} className="w-32 h-28 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-navy-900 text-lg">{dest.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MapPin size={13} /> {dest.state} · {dest.popularFor[0]}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" /> {dest.rating}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{dest.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {dest.popularFor?.slice(0, 4).map(t => (
                        <span key={t} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                      <span className="text-brand-blue text-xs font-semibold ml-auto">{dest.packageCount} packages →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
