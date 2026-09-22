import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  MapPin, Clock, Users, Star, Heart, Share2, ChevronDown, ChevronUp,
  Check, X, Calendar, Hotel, Utensils, Car, Camera, Shield,
  ChevronLeft, ChevronRight, Phone, MessageCircle, Zap, Award,
  Sunrise, Sunset, Globe, BadgeCheck, Flame, ArrowRight, Info, Gift, Mountain, Waves
} from 'lucide-react';
import packages from '../data/packages';
import { useApp } from '../context/AppContext';
import { StarRating, PriceTag, Badge, HotelStars } from '../components/ui/GlassCard';

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, { color: string; icon: React.ReactNode }> = {
    Easy:     { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <Waves size={12} /> },
    Moderate: { color: 'bg-amber-100 text-amber-700 border-amber-200',      icon: <Mountain size={12} /> },
    Hard:     { color: 'bg-red-100 text-red-700 border-red-200',             icon: <Flame size={12} /> },
  };
  const cfg = map[level] ?? map.Easy;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      {cfg.icon} {level}
    </span>
  );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl px-3 py-2 shadow-sm text-sm text-navy-900 font-medium">
      <span className="text-brand-blue">{icon}</span>
      {label}
    </div>
  );
}

export default function PackageDetail() {
  const { slug } = useParams();
  const pkg = packages.find(p => p.slug === slug) || packages[0];
  const { addToWishlist, removeFromWishlist, isWishlisted, setCurrentBooking, addNotification } = useApp();
  const navigate = useNavigate();

  const [activeImage, setActiveImage]       = useState(0);
  const [expandedDay, setExpandedDay]       = useState<number | null>(1);
  const [selectedDate, setSelectedDate]     = useState('');
  const [adults, setAdults]                 = useState(2);
  const [children, setChildren]             = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [activeTab, setActiveTab]           = useState<'overview' | 'itinerary' | 'hotels' | 'inclusions' | 'policy'>('overview');
  const [copied, setCopied]                 = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  if (!pkg) return null;

  const totalPrice =
    pkg.price.adult * adults +
    pkg.price.child * children +
    selectedAddons.reduce((sum, id) => sum + (pkg.addons.find(a => a.id === id)?.price || 0), 0);

  const toggleAddon = (id: string) =>
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

  const handleBookNow = () => {
    if (!selectedDate) { addNotification('Please select a travel date'); return; }
    setCurrentBooking({ packageId: pkg.id, travelDate: selectedDate, adults, children, selectedAddons, totalAmount: totalPrice });
    navigate('/book/details');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS = [
    { id: 'overview'   as const, label: 'Overview',   icon: <Globe size={15} /> },
    { id: 'itinerary'  as const, label: 'Itinerary',  icon: <Calendar size={15} /> },
    { id: 'hotels'     as const, label: 'Hotels',     icon: <Hotel size={15} /> },
    { id: 'inclusions' as const, label: 'Inclusions', icon: <Check size={15} /> },
    { id: 'policy'     as const, label: 'Policy',     icon: <Shield size={15} /> },
  ];

  const stats = [
    { icon: <Clock size={18} />,    label: 'Duration',   value: `${pkg.duration.days}D / ${pkg.duration.nights}N` },
    { icon: <Users size={18} />,    label: 'Group Size', value: `Max ${pkg.groupSize.max}` },
    { icon: <Utensils size={18} />, label: 'Meals',      value: pkg.mealPlan },
    { icon: <Star size={18} />,     label: 'Rating',     value: `${pkg.rating} (${pkg.reviewCount})` },
  ];

  const HIGHLIGHT_GRADIENTS = [
    'linear-gradient(135deg,#dbeafe,#eff6ff)',
    'linear-gradient(135deg,#fef3c7,#fffbeb)',
    'linear-gradient(135deg,#d1fae5,#ecfdf5)',
    'linear-gradient(135deg,#fce7f3,#fdf2f8)',
    'linear-gradient(135deg,#ede9fe,#f5f3ff)',
    'linear-gradient(135deg,#ccfbf1,#f0fdfa)',
    'linear-gradient(135deg,#e0f2fe,#f0f9ff)',
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb]">

      {/* ══ HERO ══ */}
      <div ref={heroRef} className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={pkg.images[activeImage]} alt={pkg.title} className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </motion.div>

        {/* Thumbnail strip */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {pkg.images.map((img, i) => (
            <motion.button key={i} onClick={() => setActiveImage(i)}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shadow-lg ${activeImage === i ? 'border-white scale-110' : 'border-white/40 opacity-70'}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>

        {/* Nav arrows */}
        {pkg.images.length > 1 && (
          <>
            <button onClick={() => setActiveImage(i => Math.max(0, i - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10 shadow-lg">
              <ChevronLeft size={22} />
            </button>
            <button onClick={() => setActiveImage(i => Math.min(pkg.images.length - 1, i + 1))}
              className="absolute right-20 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10 shadow-lg">
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Breadcrumb */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute top-5 left-5 flex items-center gap-2 text-white/80 text-sm z-10">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/packages" className="hover:text-white transition-colors">Packages</Link>
          <ChevronRight size={14} />
          <span className="text-white font-medium truncate max-w-[200px]">{pkg.title}</span>
        </motion.div>

        {/* Actions */}
        <div className="absolute top-5 right-[80px] flex items-center gap-2 z-10">
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={() => isWishlisted(pkg.id) ? removeFromWishlist(pkg.id) : addToWishlist(pkg.id, 'Package')}
            className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all shadow-lg ${isWishlisted(pkg.id) ? 'bg-rose-500 border-rose-400 text-white' : 'bg-white/20 border-white/30 text-white hover:bg-rose-500/80'}`}>
            <Heart size={18} className={isWishlisted(pkg.id) ? 'fill-current' : ''} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg">
            {copied ? <BadgeCheck size={18} className="text-emerald-300" /> : <Share2 size={18} />}
          </motion.button>
        </div>

        {/* Title block */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-[17%] px-5 sm:px-10 pb-10 z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {pkg.tags?.slice(0, 4).map(tag => (
              <span key={tag} className="bg-brand-blue/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">{tag}</span>
            ))}
            <DifficultyBadge level={pkg.difficulty || 'Easy'} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white leading-tight drop-shadow-xl mb-2">{pkg.title}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <MapPin size={14} className="text-brand-orange" />{pkg.destinations.join(' → ')}
            </div>
            <div className="w-1 h-1 rounded-full bg-white/50" />
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={14} fill={s <= Math.round(pkg.rating) ? '#f59e0b' : 'none'} stroke={s <= Math.round(pkg.rating) ? '#f59e0b' : '#ffffff80'} />
              ))}
              <span className="text-white/80 text-xs ml-1">{pkg.rating} ({pkg.reviewCount} reviews)</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══ FLOATING STATS BAR ══ */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mt-8">
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}
              className="bg-white rounded-2xl p-4 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] border border-white/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/10 to-brand-orange/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                <div className="text-sm font-bold text-navy-900">{s.value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tab Nav */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden">
              <div className="flex overflow-x-auto">
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center ${activeTab === tab.id ? 'text-brand-blue' : 'text-gray-500 hover:text-navy-900'}`}>
                    {tab.icon} {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">

              {activeTab === 'overview' && (
                <motion.div key="overview" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.10)] border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center">
                        <Globe size={16} className="text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-navy-900">Trip Overview</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">{pkg.overview}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-orange-500 flex items-center justify-center">
                        <Zap size={16} className="text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-navy-900">Trip Highlights</h2>
                    </div>
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pkg.highlights.map((h, i) => (
                        <motion.div key={i} variants={fadeUp} whileHover={{ y: -6, scale: 1.02 }}
                          style={{ background: HIGHLIGHT_GRADIENTS[i % HIGHLIGHT_GRADIENTS.length], boxShadow: '0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)' }}
                          className="relative rounded-2xl p-4 border border-white/80 overflow-hidden group cursor-default">
                          <span className="absolute -top-3 -right-3 text-[80px] font-black opacity-[0.06] select-none leading-none text-navy-900">{i + 1}</span>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <Check size={14} className="text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-navy-900 leading-snug">{h}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <InfoChip icon={<Clock size={15} />}    label={`${pkg.duration.days} Days / ${pkg.duration.nights} Nights`} />
                    <InfoChip icon={<Utensils size={15} />} label={pkg.mealPlan} />
                    <InfoChip icon={<Users size={15} />}    label={`Min ${pkg.groupSize.min} – Max ${pkg.groupSize.max}`} />
                    <InfoChip icon={<Camera size={15} />}   label={pkg.category} />
                    <InfoChip icon={<Car size={15} />}      label="AC Vehicle" />
                    <InfoChip icon={<Shield size={15} />}   label="Verified Tour" />
                  </div>
                </motion.div>
              )}

              {activeTab === 'itinerary' && (
                <motion.div key="itinerary" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.3 }}>
                  <div className="relative">
                    <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-brand-blue via-brand-orange to-emerald-400 rounded-full" />
                    <div className="space-y-4">
                      {pkg.itinerary.map((day, idx) => (
                        <motion.div key={day.day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                          className="relative pl-16">
                          <div className={`absolute left-0 top-4 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg z-10 transition-all ${expandedDay === day.day ? 'bg-gradient-to-br from-brand-blue to-blue-700 text-white scale-110' : 'bg-white text-navy-900 border-2 border-gray-200'}`}>
                            {day.day}
                          </div>
                          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] border border-gray-100">
                            <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}>
                              <div>
                                <div className="font-bold text-navy-900">{day.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                                  {day.meals.length > 0 && <span className="flex items-center gap-1"><Utensils size={11} /> {day.meals.join(' + ')}</span>}
                                  {day.hotel && <span className="flex items-center gap-1"><Hotel size={11} /> {day.hotel}</span>}
                                </div>
                              </div>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedDay === day.day ? 'bg-brand-blue/10 text-brand-blue' : 'bg-gray-100 text-gray-400'}`}>
                                {expandedDay === day.day ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>
                            </button>
                            <AnimatePresence>
                              {expandedDay === day.day && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                  <div className="px-4 pb-5 pt-1 border-t border-gray-100">
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{day.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {day.pickup && (
                                        <div className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg font-medium">
                                          <Sunrise size={12} /> Pickup: {day.pickup}
                                        </div>
                                      )}
                                      {day.drop && (
                                        <div className="flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-lg font-medium">
                                          <Sunset size={12} /> Drop: {day.drop}
                                        </div>
                                      )}
                                    </div>
                                    <div className="space-y-3 ml-1">
                                      {day.activities.map((act, j) => (
                                        <div key={j} className="flex gap-3 items-start">
                                          <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 flex-shrink-0" />
                                            {j < day.activities.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1 min-h-[20px]" />}
                                          </div>
                                          <div className="flex-1 pb-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="text-xs bg-gray-100 text-gray-500 font-mono px-2 py-0.5 rounded-md font-medium">{act.time}</span>
                                              <span className="text-sm font-semibold text-navy-900">{act.activity}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><MapPin size={10} /> {act.location}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex flex-wrap gap-3 text-xs text-gray-500">
                                      <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg border"><Car size={11} className="text-brand-blue" /> {day.transport}</span>
                                      {day.hotel && <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg border"><Hotel size={11} className="text-brand-orange" /> {day.hotel}</span>}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hotels' && (
                <motion.div key="hotels" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.3 }} className="space-y-5">
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800">
                    <Info size={15} className="flex-shrink-0" />
                    Every Zemtro_tour package includes premium vetted accommodations. Your room and breakfast are fully reserved and guaranteed.
                  </div>
                  {pkg.hotels.map((hotel, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }} className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.14)] border border-gray-100">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-44 h-40 sm:h-auto flex-shrink-0">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r" />
                          <div className="absolute top-3 left-3">
                            <span className="bg-amber-400 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full shadow">{hotel.category}★</span>
                          </div>
                        </div>
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h3 className="font-bold text-navy-900 text-lg leading-tight">{hotel.name}</h3>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5"><MapPin size={12} className="text-brand-orange" /> {hotel.location}</div>
                            </div>
                            <HotelStars count={hotel.category} />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mb-3">
                            <span>🛏️ {hotel.roomType}</span>
                            <span>✅ Check-in {hotel.checkIn}</span>
                            <span>📤 Check-out {hotel.checkOut}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.map(a => (
                              <span key={a} className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-medium">✓ {a}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'inclusions' && (
                <motion.div key="inclusions" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.3 }}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] border border-gray-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><Check size={16} className="text-emerald-600" /></div>
                        <h3 className="font-bold text-emerald-700">What's Included</h3>
                      </div>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((inc, i) => (
                          <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2.5 text-sm text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check size={11} className="text-emerald-600" />
                            </span>
                            {inc}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] border border-gray-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><X size={16} className="text-red-500" /></div>
                        <h3 className="font-bold text-red-600">Not Included</h3>
                      </div>
                      <ul className="space-y-3">
                        {pkg.exclusions.map((exc, i) => (
                          <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2.5 text-sm text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <X size={11} className="text-red-500" />
                            </span>
                            {exc}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'policy' && (
                <motion.div key="policy" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Shield size={16} className="text-brand-blue" /></div>
                    <h2 className="text-lg font-bold text-navy-900">Cancellation Policy</h2>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 leading-relaxed">{pkg.cancellationPolicy}</div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: '🔒', label: 'Secure Payments', sub: 'SSL encrypted checkout' },
                      { icon: '✅', label: 'Best Price Guarantee', sub: 'No hidden charges' },
                      { icon: '📞', label: '24/7 Support', sub: '+91 9329781327' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-navy-900">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT: BOOKING CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="relative bg-white rounded-3xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.20)] border border-gray-100 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-brand-blue via-brand-orange to-emerald-400" />
                {pkg.discount && (
                  <div className="absolute top-3 right-4 bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-2xl shadow-lg rotate-2">
                    {pkg.discount}% OFF
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-1">
                    <div className="text-2xl font-black text-navy-900">
                      ₹{pkg.price.adult.toLocaleString('en-IN')}
                      <span className="text-sm font-normal text-gray-400 ml-1">/ person</span>
                    </div>
                    {pkg.price.originalPrice && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-gray-400 line-through">₹{pkg.price.originalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                          Save ₹{(pkg.price.originalPrice - pkg.price.adult).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Twin sharing · Taxes included</p>
                  </div>
                  <div className="h-px bg-gray-100 my-4" />

                  {/* Date */}
                  <div className="mb-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Travel Date</label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-navy-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue appearance-none">
                        <option value="">Select a date</option>
                        {pkg.availableDates.map(d => (
                          <option key={d} value={d}>{new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Adults',   value: adults,   min: 1, max: 20, setter: setAdults },
                      { label: 'Children', value: children, min: 0, max: 10, setter: setChildren },
                    ].map(g => (
                      <div key={g.label}>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">{g.label}</label>
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                          <button onClick={() => g.setter(Math.max(g.min, g.value - 1))} className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold text-lg">-</button>
                          <span className="flex-1 text-center font-bold text-navy-900 text-sm">{g.value}</span>
                          <button onClick={() => g.setter(Math.min(g.max, g.value + 1))} className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold text-lg">+</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add-ons */}
                  {pkg.addons.length > 0 && (
                    <div className="mb-4">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1"><Gift size={12} /> Add-ons</label>
                      <div className="space-y-2">
                        {pkg.addons.map(addon => (
                          <label key={addon.id}
                            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${selectedAddons.includes(addon.id) ? 'bg-brand-blue/5 border-brand-blue/30' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                            <input type="checkbox" checked={selectedAddons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} className="accent-brand-orange w-4 h-4" />
                            <span className="text-lg">{addon.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-navy-900 truncate">{addon.name}</div>
                              <div className="text-xs text-gray-400 truncate">{addon.description}</div>
                            </div>
                            <span className="text-xs font-black text-brand-blue whitespace-nowrap">+₹{addon.price.toLocaleString('en-IN')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Breakdown */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 mb-4 border border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Adults × {adults}</span><span className="font-medium">₹{(pkg.price.adult * adults).toLocaleString('en-IN')}</span></div>
                    {children > 0 && <div className="flex justify-between text-gray-600"><span>Children × {children}</span><span className="font-medium">₹{(pkg.price.child * children).toLocaleString('en-IN')}</span></div>}
                    {selectedAddons.map(id => {
                      const addon = pkg.addons.find(a => a.id === id);
                      return addon ? <div key={id} className="flex justify-between text-gray-600"><span>{addon.name}</span><span className="font-medium">₹{addon.price.toLocaleString('en-IN')}</span></div> : null;
                    })}
                    <div className="h-px bg-gray-200 my-1" />
                    <div className="flex justify-between font-black text-navy-900 text-base"><span>Total</span><span className="text-brand-blue">₹{totalPrice.toLocaleString('en-IN')}</span></div>
                  </div>

                  {/* CTAs */}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBookNow}
                    className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(37,99,235,0.5)] transition-all"
                    style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb,#3b82f6)' }}>
                    Book Now <ArrowRight size={16} />
                  </motion.button>

                  <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/919329781327?text=Hi%20Zemtro_tour%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.title)}%20package`}
                    target="_blank" rel="noreferrer"
                    className="mt-3 w-full py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.4)] transition-all"
                    style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>
                    <MessageCircle size={16} /> WhatsApp Enquiry
                  </motion.a>

                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                    <span>🔒 Secure</span><span>·</span><span>✅ Best Price</span><span>·</span>
                    <a href="tel:+919329781327" className="font-semibold text-brand-blue hover:underline">📞 9329781327</a>
                  </div>
                </div>
              </motion.div>

              {/* Trust card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="bg-gradient-to-br from-navy-900 to-blue-900 rounded-2xl p-5 text-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.30)]">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={18} className="text-brand-orange" />
                  <span className="font-bold text-sm">Why Choose Zemtro_tour?</span>
                </div>
                <ul className="space-y-2">
                  {['✅ 500+ happy travellers','🏨 Premium vetted hotels','🚐 Comfortable AC transport','📞 24/7 trip support','💯 Transparent pricing'].map((item, i) => (
                    <li key={i} className="text-xs text-white/80">{item}</li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-white/20">
                  <a href="tel:+919329781327" className="flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-orange-300 transition-colors">
                    <Phone size={14} /> +91 9329781327
                  </a>
                  <p className="text-xs text-white/50 mt-0.5">Umsohkhlur, Shillong, Meghalaya</p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
