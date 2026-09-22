import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Users, ChevronDown, Heart, Star, SlidersHorizontal, X } from 'lucide-react';
import packages from '../data/packages';
import { useApp } from '../context/AppContext';
import { StarRating, PriceTag, SectionHeader, Badge } from '../components/ui/GlassCard';

const DESTINATIONS = ['All', 'Rajasthan', 'Kerala', 'Goa', 'Kashmir', 'Himachal Pradesh', 'Uttarakhand', 'Ladakh', 'North India', 'Andaman', 'Gujarat', 'Madhya Pradesh'];
const CATEGORIES = ['All', 'Heritage & Culture', 'Beach & Nature', 'Snow & Adventure', 'Himalayan Adventure', 'Wildlife Safari', 'Pilgrimage & Trek', 'Island & Beach', 'Bike & Adventure'];
const DURATIONS = ['All', '1-3 Days', '4-6 Days', '7-10 Days', '10+ Days'];
const SORTS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Duration'];

export default function Packages() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('destination') || '');
  const [dest, setDest] = useState('All');
  const [category, setCategory] = useState('All');
  const [duration, setDuration] = useState('All');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100000);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState('Recommended');
  const [showFilters, setShowFilters] = useState(false);
  const { addToWishlist, removeFromWishlist, isWishlisted } = useApp();

  const filtered = useMemo(() => {
    let result = [...packages];
    if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.destinations.some(d => d.toLowerCase().includes(search.toLowerCase())));
    if (dest !== 'All') result = result.filter(p => p.destination === dest || p.destinations.includes(dest));
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (rating > 0) result = result.filter(p => p.rating >= rating);
    result = result.filter(p => p.price.adult >= priceMin && p.price.adult <= priceMax);
    if (duration !== 'All') {
      result = result.filter(p => {
        const d = p.duration.days;
        if (duration === '1-3 Days') return d <= 3;
        if (duration === '4-6 Days') return d >= 4 && d <= 6;
        if (duration === '7-10 Days') return d >= 7 && d <= 10;
        return d > 10;
      });
    }
    if (sort === 'Price: Low to High') result.sort((a, b) => a.price.adult - b.price.adult);
    else if (sort === 'Price: High to Low') result.sort((a, b) => b.price.adult - a.price.adult);
    else if (sort === 'Rating') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'Duration') result.sort((a, b) => a.duration.days - b.duration.days);
    return result;
  }, [search, dest, category, duration, priceMin, priceMax, rating, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-hero text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Tour Packages</h1>
          <p className="text-white/70 text-lg">{filtered.length} packages across India's finest destinations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search packages, destinations..." value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 bg-white" />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-field bg-white w-auto">
            {SORTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium border transition-all
              ${showFilters ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-navy-900 border-gray-200 hover:border-brand-blue'}`}>
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        {/* Destination quick filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
          {DESTINATIONS.map(d => (
            <button key={d} onClick={() => setDest(d)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${dest === d ? 'bg-brand-blue text-white shadow-blue' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue'}`}>
              {d}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <motion.aside animate={{ width: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy-900">Filters</h3>
                <button onClick={() => { setDest('All'); setCategory('All'); setDuration('All'); setRating(0); setPriceMin(0); setPriceMax(100000); }}
                  className="text-xs text-brand-blue hover:underline">Clear All</button>
              </div>

              {/* Category */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)} className="accent-brand-blue" />
                      <span className="text-sm text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Duration</h4>
                <div className="space-y-2">
                  {DURATIONS.map(d => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="duration" checked={duration === d} onChange={() => setDuration(d)} className="accent-brand-blue" />
                      <span className="text-sm text-gray-700">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Min: ₹{priceMin.toLocaleString('en-IN')}</label>
                    <input type="range" min={0} max={100000} step={1000} value={priceMin}
                      onChange={e => setPriceMin(Number(e.target.value))}
                      className="w-full accent-brand-blue" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Max: ₹{priceMax.toLocaleString('en-IN')}</label>
                    <input type="range" min={0} max={100000} step={1000} value={priceMax}
                      onChange={e => setPriceMax(Number(e.target.value))}
                      className="w-full accent-brand-blue" />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Minimum Rating</h4>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setRating(r)}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-all
                        ${rating === r ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {r === 0 ? 'All' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Results */}
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-4">{filtered.length} packages found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((pkg, i) => (
                <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <PackageListCard pkg={pkg}
                    onWishlist={() => isWishlisted(pkg.id) ? removeFromWishlist(pkg.id) : addToWishlist(pkg.id, 'Package')}
                    wishlisted={isWishlisted(pkg.id)} />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No packages found</h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageListCard({ pkg, onWishlist, wishlisted }: { pkg: any; onWishlist: () => void; wishlisted: boolean }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 border border-gray-100">
      <div className="relative h-44 overflow-hidden">
        <img src={pkg.thumbnail} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {pkg.trending && <span className="badge-orange text-xs">🔥 Trending</span>}
        </div>
        <button onClick={(e) => { e.preventDefault(); onWishlist(); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all
            ${wishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-500'}`}>
          <Heart size={14} className={wishlisted ? 'fill-current' : ''} />
        </button>
        <div className="absolute bottom-3 left-3 bg-navy-900/80 text-white text-xs px-2 py-0.5 rounded-full">
          {pkg.duration.days}D/{pkg.duration.nights}N
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <MapPin size={12} className="text-brand-blue" />
          <span className="text-brand-blue text-xs">{pkg.destinations.slice(0, 3).join(' · ')}</span>
        </div>
        <h3 className="font-bold text-navy-900 text-base leading-snug mb-2 line-clamp-2">{pkg.title}</h3>
        <StarRating rating={pkg.rating} showCount count={pkg.reviewCount} />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <PriceTag price={pkg.price.adult} originalPrice={pkg.price.originalPrice} />
          <Link to={`/packages/${pkg.slug}`} className="btn-primary py-1.5 px-3 text-sm">View</Link>
        </div>
      </div>
    </div>
  );
}
