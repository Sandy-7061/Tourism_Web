import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Users, Star, Heart, Share2, ChevronDown, ChevronUp,
  Check, X, Calendar, Hotel, Utensils, Car, Camera, Shield, ChevronLeft, ChevronRight, Phone
} from 'lucide-react';
import packages from '../data/packages';
import { useApp } from '../context/AppContext';
import { StarRating, PriceTag, Badge, HotelStars } from '../components/ui/GlassCard';

export default function PackageDetail() {
  const { slug } = useParams();
  const pkg = packages.find(p => p.slug === slug) || packages[0];
  const { addToWishlist, removeFromWishlist, isWishlisted, setCurrentBooking, addNotification } = useApp();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  if (!pkg) return null;

  const totalPrice = (pkg.price.adult * adults) + (pkg.price.child * children) +
    selectedAddons.reduce((sum, id) => sum + (pkg.addons.find(a => a.id === id)?.price || 0), 0);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleBookNow = () => {
    if (!selectedDate) { addNotification('Please select a travel date'); return; }
    setCurrentBooking({
      packageId: pkg.id,
      travelDate: selectedDate,
      adults,
      children,
      selectedAddons,
      totalAmount: totalPrice,
    });
    navigate('/book/details');
  };

  const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 last:border-0">
      <button className="w-full flex items-center justify-between py-4 text-left" onClick={() => setExpandedSection(expandedSection === id ? null : id)}>
        <div className="flex items-center gap-3 font-bold text-navy-900 text-lg">
          {icon} {title}
        </div>
        {expandedSection === id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      {expandedSection === id && <div className="pb-5">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-72 md:h-[480px] bg-navy-900 overflow-hidden">
        <img src={pkg.images[activeImage]} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Nav arrows */}
        {pkg.images.length > 1 && (
          <>
            <button onClick={() => setActiveImage(i => Math.max(0, i - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setActiveImage(i => Math.min(pkg.images.length - 1, i + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {pkg.images.map((_, i) => (
            <button key={i} onClick={() => setActiveImage(i)}
              className={`w-2 h-2 rounded-full transition-all ${activeImage === i ? 'bg-white w-6' : 'bg-white/50'}`} />
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-white/80 text-sm">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/packages" className="hover:text-white">Packages</Link>
          <span>/</span>
          <span className="text-white">{pkg.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title card */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-wrap gap-2 mb-3">
                {pkg.tags.slice(0, 4).map(tag => <Badge key={tag} variant="blue">{tag}</Badge>)}
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 mb-3">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1"><MapPin size={14} className="text-brand-blue" /> {pkg.destinations.join(' → ')}</div>
                <div className="flex items-center gap-1"><Clock size={14} className="text-brand-blue" /> {pkg.duration.days} Days / {pkg.duration.nights} Nights</div>
                <div className="flex items-center gap-1"><Users size={14} className="text-brand-blue" /> Max {pkg.groupSize.max} people</div>
                <div className="flex items-center gap-1"><Utensils size={14} className="text-brand-blue" /> {pkg.mealPlan}</div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <StarRating rating={pkg.rating} showCount count={pkg.reviewCount} />
                <div className="flex gap-2">
                  <button onClick={() => isWishlisted(pkg.id) ? removeFromWishlist(pkg.id) : addToWishlist(pkg.id, 'Package')}
                    className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl border transition-all
                      ${isWishlisted(pkg.id) ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    <Heart size={14} className={isWishlisted(pkg.id) ? 'fill-current' : ''} /> Wishlist
                  </button>
                  <button className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* Overview, Itinerary, Hotels, Inclusions, etc. */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <Section id="overview" title="Overview" icon={<span>🌟</span>}>
                <p className="text-gray-600 leading-relaxed">{pkg.overview}</p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-3">Highlights</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pkg.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" /> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              {/* Full Itinerary */}
              <Section id="itinerary" title="Day-by-Day Itinerary" icon={<Calendar size={20} className="text-brand-blue" />}>
                <div className="space-y-3">
                  {pkg.itinerary.map(day => (
                    <div key={day.day} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}>
                        <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-navy-900">{day.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{day.meals.join(' + ') || 'No meals included'} · {day.hotel || 'Travel day'}</div>
                        </div>
                        {expandedDay === day.day ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </button>
                      {expandedDay === day.day && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mt-3 mb-4">{day.description}</p>
                          {day.pickup && <div className="text-xs bg-brand-blue/10 text-brand-blue px-3 py-2 rounded-lg mb-3">📍 Pickup: {day.pickup}</div>}
                          {day.drop && <div className="text-xs bg-brand-orange/10 text-brand-orange px-3 py-2 rounded-lg mb-3">📍 Drop: {day.drop}</div>}
                          <div className="space-y-3">
                            {day.activities.map((act, j) => (
                              <div key={j} className="flex gap-3 items-start">
                                <div className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-mono flex-shrink-0 w-20 text-center mt-0.5">
                                  {act.time}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-navy-900">{act.activity}</div>
                                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                    <MapPin size={10} /> {act.location}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3 text-xs">
                            <div className="flex items-center gap-1 text-gray-500"><Hotel size={12} /> {day.hotel || 'N/A'}</div>
                            <div className="flex items-center gap-1 text-gray-500"><Car size={12} /> {day.transport}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              {/* Hotel Details */}
              <Section id="hotels" title="Hotel Details" icon={<Hotel size={20} className="text-brand-blue" />}>
                <div className="space-y-4">
                  {pkg.hotels.map((hotel, i) => (
                    <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-xl">
                      <img src={hotel.image} alt={hotel.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-navy-900">{hotel.name}</h4>
                          <HotelStars count={hotel.category} />
                        </div>
                        <div className="text-sm text-gray-500 mb-2">{hotel.location} · {hotel.checkIn} to {hotel.checkOut} · {hotel.roomType}</div>
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities.slice(0, 5).map(a => <span key={a} className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-full">{a}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Inclusions & Exclusions */}
              <Section id="inclusions" title="Inclusions & Exclusions" icon={<Check size={20} className="text-emerald-500" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-emerald-700 mb-3 flex items-center gap-1"><Check size={16} /> Included</h4>
                    <ul className="space-y-2">
                      {pkg.inclusions.map(inc => (
                        <li key={inc} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={10} className="text-emerald-600" />
                          </span>
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-1"><X size={16} /> Excluded</h4>
                    <ul className="space-y-2">
                      {pkg.exclusions.map(exc => (
                        <li key={exc} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X size={10} className="text-red-500" />
                          </span>
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Cancellation Policy */}
              <Section id="cancellation" title="Cancellation Policy" icon={<Shield size={20} className="text-brand-blue" />}>
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">{pkg.cancellationPolicy}</div>
              </Section>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-card-hover border border-gray-100">
                <PriceTag price={pkg.price.adult} originalPrice={pkg.price.originalPrice} large />
                <p className="text-gray-400 text-xs mt-1 mb-5">per person (twin sharing)</p>

                {/* Date Picker */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-navy-900 mb-2 block">Travel Date</label>
                  <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field">
                    <option value="">Select a date</option>
                    {pkg.availableDates.map(d => (
                      <option key={d} value={d}>{new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</option>
                    ))}
                  </select>
                </div>

                {/* Guests */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-sm font-semibold text-navy-900 mb-2 block">Adults</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-6 h-6 bg-gray-100 rounded-full text-sm font-bold">-</button>
                      <span className="flex-1 text-center font-medium">{adults}</span>
                      <button onClick={() => setAdults(Math.min(20, adults + 1))} className="w-6 h-6 bg-gray-100 rounded-full text-sm font-bold">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-navy-900 mb-2 block">Children</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-6 h-6 bg-gray-100 rounded-full text-sm font-bold">-</button>
                      <span className="flex-1 text-center font-medium">{children}</span>
                      <button onClick={() => setChildren(Math.min(10, children + 1))} className="w-6 h-6 bg-gray-100 rounded-full text-sm font-bold">+</button>
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                {pkg.addons.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-navy-900 mb-2">Add-ons</h4>
                    <div className="space-y-2">
                      {pkg.addons.map(addon => (
                        <label key={addon.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" checked={selectedAddons.includes(addon.id)}
                            onChange={() => toggleAddon(addon.id)} className="accent-brand-orange w-4 h-4" />
                          <span className="text-lg">{addon.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-navy-900">{addon.name}</div>
                            <div className="text-xs text-gray-400">{addon.description}</div>
                          </div>
                          <span className="text-sm font-bold text-brand-blue">+₹{addon.price.toLocaleString('en-IN')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price breakdown */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Adults × {adults}</span><span>₹{(pkg.price.adult * adults).toLocaleString('en-IN')}</span></div>
                  {children > 0 && <div className="flex justify-between"><span className="text-gray-600">Children × {children}</span><span>₹{(pkg.price.child * children).toLocaleString('en-IN')}</span></div>}
                  {selectedAddons.map(id => {
                    const addon = pkg.addons.find(a => a.id === id);
                    return addon ? <div key={id} className="flex justify-between"><span className="text-gray-600">{addon.name}</span><span>₹{addon.price.toLocaleString('en-IN')}</span></div> : null;
                  })}
                  <div className="flex justify-between font-bold text-navy-900 border-t border-gray-200 pt-2">
                    <span>Total</span><span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button onClick={handleBookNow} className="w-full btn-primary justify-center text-base py-4">
                  Book Now — ₹{totalPrice.toLocaleString('en-IN')}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">No credit card required for advance booking</p>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                  <span>🔒 Secure</span>
                  <span>✅ Best Price</span>
                  <span>📞 <a href="tel:+919876543210" className="hover:underline">Call Us</a></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
