import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Search, MapPin, Calendar, Users, ChevronRight, Star, Heart, ArrowRight,
  Car, Building2, Compass, Package, Play, Shield, Award, Clock, TrendingUp,
  Zap, Globe, Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import packages from '../data/packages';
import destinations from '../data/destinations';
import { blogPosts } from '../data/blog';
import offers from '../data/offers';
import { StarRating, PriceTag, SectionHeader } from '../components/ui/GlassCard';
import ThreeHero from '../components/home/ThreeHero';

// Scroll-reveal wrapper
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'packages' | 'city' | 'car'>('packages');
  const [searchDest, setSearchDest] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuests, setSearchGuests] = useState(2);
  const navigate = useNavigate();
  const { addToWishlist, isWishlisted, removeFromWishlist } = useApp();

  const featuredPackages = packages.filter(p => p.featured).slice(0, 6);
  const trendingPackages = packages.filter(p => p.trending).slice(0, 4);
  const featuredDestinations = destinations.filter(d => d.featured);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchDest) params.set('destination', searchDest);
    if (searchDate) params.set('date', searchDate);
    if (searchGuests) params.set('guests', String(searchGuests));
    if (activeTab === 'packages') navigate(`/packages?${params}`);
    else if (activeTab === 'city') navigate(`/city-tours?${params}`);
    else if (activeTab === 'car') navigate(`/car-rental?${params}`);
  };

  const handleWishlist = (id: string) => {
    if (isWishlisted(id)) removeFromWishlist(id);
    else addToWishlist(id, 'Package');
  };

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=85"
            alt="India Travel Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/60 to-navy-900/90" />
          
          {/* Three.js 3D Animated Sky, Planes & Floating Travel Elements */}
          <ThreeHero />

          {/* Floating subtle ambient orbs */}
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl animate-float pointer-events-none" />
          <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32 pt-40">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-white text-sm font-medium mb-6 shadow-glass">
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              <span>India's #1 Premium Travel Platform</span>
              <span className="hidden sm:inline-block text-white/40">|</span>
              <span className="hidden sm:inline-block text-brand-orange font-semibold">✈️ 3D Flight Experience</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight max-w-4xl">
              Discover the
              <span className="block text-gradient-gold">Magic of India</span>
            </h1>
            <p className="text-xl text-white/80 mt-5 max-w-2xl leading-relaxed">
              Handcrafted travel experiences across 15+ states. From Himalayan peaks to tropical backwaters — your perfect Indian journey starts here.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-8 mb-10">
              {[
                { label: 'Happy Travelers', value: '50,000+' },
                { label: 'Tour Packages', value: '500+' },
                { label: 'Destinations', value: '150+' },
                { label: 'Years Experience', value: '12+' },
              ].map(stat => (
                <div key={stat.label} className="text-white">
                  <div className="text-3xl font-display font-bold text-brand-orange">{stat.value}</div>
                  <div className="text-sm text-white/70 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass rounded-3xl p-6 max-w-4xl shadow-2xl border border-white/30">
            {/* Tabs & Hotel notice */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'packages', label: '🏔️ Tour Packages', icon: <Package size={16} /> },
                  { key: 'city', label: '🏙️ City Tours', icon: <Compass size={16} /> },
                  { key: 'car', label: '🚗 Car Rental', icon: <Car size={16} /> },
                ].map(tab => (
                  <button key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer
                      ${activeTab === tab.key
                        ? 'bg-brand-orange text-white shadow-orange scale-105'
                        : 'bg-white/60 text-navy-800 hover:bg-white/90'
                      }`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-white/90 bg-navy-900/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <Building2 size={13} className="text-brand-orange" />
                <span>Hotels & Resorts included with every Package</span>
              </div>
            </div>

            {/* Search fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue" />
                <input
                  type="text"
                  placeholder={activeTab === 'car' ? 'Pickup city' : 'Where to?'}
                  value={searchDest}
                  onChange={e => setSearchDest(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              {activeTab === 'car' ? (
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-orange" />
                  <input type="text" placeholder="Drop city" className="input-field pl-10" />
                </div>
              ) : (
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue" />
                  <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} className="input-field pl-10" />
                </div>
              )}
              <div className="relative">
                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue" />
                <select value={searchGuests} onChange={e => setSearchGuests(Number(e.target.value))} className="input-field pl-10 appearance-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleSearch} className="btn-primary justify-center text-base py-3">
                <Search size={20} /> Search
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                tag="🌏 Where to Go"
                title="Popular Destinations"
                subtitle="Explore India's most beloved travel destinations"
              />
              <Link to="/destinations" className="hidden md:flex items-center gap-2 text-brand-blue font-semibold hover:gap-3 transition-all">
                All Destinations <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredDestinations.slice(0, 8).map((dest, i) => (
              <Reveal key={dest.id} delay={i * 0.05}>
                <Link to={`/destinations/${dest.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] block card-hover">
                  <img src={dest.thumbnail} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-display font-bold text-lg">{dest.name}</h3>
                    <p className="text-white/70 text-sm">{dest.state}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-brand-orange text-xs font-semibold">{dest.packageCount} packages</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2 py-0.5 text-white text-xs font-medium">
                    ★ {dest.rating}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING PACKAGES ===== */}
      <section className="section-pad bg-section-alt">
        <div className="max-w-7xl mx-auto container-pad">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                tag="🔥 Trending Now"
                title="Most Popular Tour Packages"
                subtitle="Handpicked experiences loved by thousands of travelers"
              />
              <Link to="/packages" className="hidden md:flex items-center gap-2 text-brand-blue font-semibold hover:gap-3 transition-all">
                All Packages <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPackages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.08}>
                <PackageCard pkg={pkg} onWishlist={handleWishlist} isWishlisted={isWishlisted(pkg.id)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <Reveal>
            <SectionHeader tag="🗂️ Explore By Type" title="Tour Categories" center />
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
            {[
              { label: 'Heritage & Culture', icon: '🏰', color: 'from-amber-50 to-orange-50', border: 'border-orange-100', href: '/packages?category=Heritage' },
              { label: 'Beach & Island', icon: '🏖️', color: 'from-blue-50 to-cyan-50', border: 'border-blue-100', href: '/packages?category=Beach' },
              { label: 'Hill Station', icon: '⛰️', color: 'from-green-50 to-emerald-50', border: 'border-green-100', href: '/packages?category=Hill' },
              { label: 'Wildlife Safari', icon: '🐯', color: 'from-yellow-50 to-amber-50', border: 'border-yellow-100', href: '/packages?category=Wildlife' },
              { label: 'Adventure Trek', icon: '🧗', color: 'from-red-50 to-rose-50', border: 'border-red-100', href: '/packages?category=Adventure' },
              { label: 'Pilgrimage', icon: '🛕', color: 'from-violet-50 to-purple-50', border: 'border-violet-100', href: '/packages?category=Pilgrimage' },
            ].map((cat, i) => (
              <Reveal key={cat.label} delay={i * 0.05}>
                <Link to={cat.href}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} 
                              hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center group`}>
                  <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="text-sm font-semibold text-navy-800">{cat.label}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFERS SECTION ===== */}
      <section className="section-pad bg-navy-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto container-pad relative">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <SectionHeader tag="🏷️ Hot Deals" title="Exclusive Offers & Discounts" />
              <Link to="/offers" className="hidden md:flex items-center gap-2 text-brand-orange font-semibold hover:gap-3 transition-all">
                All Offers <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {offers.filter(o => o.featured).map((offer, i) => (
              <Reveal key={offer.id} delay={i * 0.08}>
                <div className="glass rounded-2xl overflow-hidden group card-hover">
                  <div className="relative h-36 overflow-hidden">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
                    <div className="absolute top-3 left-3 bg-brand-orange text-white text-sm font-bold px-3 py-1 rounded-full">
                      {offer.type === 'flat' ? `₹${offer.discount.toLocaleString('en-IN')} OFF` : `${offer.discount}% OFF`}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-navy-900 mb-1">{offer.title}</h4>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{offer.description}</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-brand-blue/10 text-brand-blue text-xs font-mono font-bold px-3 py-1 rounded-lg">{offer.code}</code>
                      <button
                        onClick={() => navigator.clipboard?.writeText(offer.code)}
                        className="text-xs text-brand-blue hover:underline">Copy</button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAR RENTAL PROMO ===== */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="bg-gradient-to-r from-brand-blue to-navy-800 rounded-4xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative z-10">
              <Reveal>
                <div className="text-white">
                  <span className="badge-orange mb-4 inline-block">🚗 Car Rental</span>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Travel on Your Own Terms</h2>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    Choose from 20+ vehicles — from budget hatchbacks to luxury sedans and tempo travellers. 
                    Pick-up and drop at any location across India.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {['AC vehicles with experienced drivers', 'Flexible pickup & drop points', 'Transparent pricing — no hidden charges', '24/7 roadside assistance'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/car-rental" className="btn-primary inline-flex">
                    Book a Car <ArrowRight size={18} />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80"
                    alt="Car Rental" className="w-full max-w-md rounded-2xl shadow-2xl object-cover" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY US / REVIEWS ===== */}
      <section className="section-pad bg-section-alt">
        <div className="max-w-7xl mx-auto container-pad">
          <Reveal>
            <SectionHeader tag="⭐ Why Zemtro_tour" title="Trusted by 50,000+ Travelers" center />
          </Reveal>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mb-16">
            {[
              { icon: <Shield size={28} className="text-brand-blue" />, title: '100% Safe & Secure', desc: 'PCI-DSS compliant payment gateway' },
              { icon: <Award size={28} className="text-brand-orange" />, title: 'Best Price Guarantee', desc: 'We match any lower price you find' },
              { icon: <Clock size={28} className="text-emerald-500" />, title: '24/7 Support', desc: 'Always available when you travel' },
              { icon: <TrendingUp size={28} className="text-violet-500" />, title: '12+ Years Experience', desc: 'Crafting journeys since 2012' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 text-center card-hover">
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <h4 className="font-bold text-navy-900 mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Malhotra', location: 'Delhi', rating: 5, review: 'Absolutely magical Kerala trip! The houseboat experience was a dream. Zemtro_tour took care of every detail perfectly. Will definitely book again!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80', pkg: 'Kerala Backwaters & Beach Bliss' },
              { name: 'Rohit Verma', location: 'Mumbai', rating: 5, review: 'The Manali snow trip was epic! Well-organized, friendly driver, great hotel. The Rohtang Pass was covered in snow — exactly what we wanted!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', pkg: 'Manali Snow Adventure' },
              { name: 'Ananya Gupta', location: 'Bangalore', rating: 5, review: 'Kashmir in March was breathtaking — Dal Lake frozen, Gulmarg snow-covered. Everything was perfectly arranged. Highly recommend Zemtro_tour!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80', pkg: 'Kashmir Paradise' },
            ].map((review, i) => (
              <Reveal key={review.name} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 card-hover">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-navy-900">{review.name}</div>
                      <div className="text-gray-400 text-sm">{review.location}</div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">"{review.review}"</p>
                  <div className="badge-blue text-xs">{review.pkg}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI TRIP PLANNER ===== */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-blue rounded-4xl p-8 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute text-white text-8xl font-bold opacity-20 select-none"
                  style={{ left: `${(i % 5) * 22}%`, top: `${Math.floor(i / 5) * 28}%` }}>✈</div>
              ))}
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm mb-6">
                <Zap size={14} className="text-brand-orange" /> AI-Powered Trip Planning
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Build Your Perfect<br />Custom Journey
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                Tell us your dream destination, travel dates, and budget. Our AI-powered trip builder will craft a personalized itinerary in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/trip-builder" className="btn-primary text-lg px-8 py-4">
                  <Globe size={20} /> Start Building Your Trip
                </Link>
                <Link to="/packages" className="btn-ghost text-lg px-8 py-4">
                  <Package size={20} /> Browse Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRAVEL BLOG ===== */}
      <section className="section-pad bg-section-alt">
        <div className="max-w-7xl mx-auto container-pad">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <SectionHeader tag="✍️ Travel Stories" title="From Our Travel Blog" />
              <Link to="/blog" className="hidden md:flex items-center gap-2 text-brand-blue font-semibold hover:gap-3 transition-all">
                All Articles <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.filter(b => b.featured).map((post, i) => (
              <Reveal key={post.id} delay={i * 0.1}>
                <Link to={`/blog/${post.slug}`} className="group block glass rounded-2xl overflow-hidden card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="badge-orange">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-medium text-navy-900">{post.author.name}</div>
                        <div className="text-xs text-gray-400">{post.readTime} min read</div>
                      </div>
                    </div>
                    <h3 className="font-bold text-navy-900 text-lg leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== Package Card component (used on Home and Packages page) =====
function PackageCard({ pkg, onWishlist, isWishlisted }: { pkg: any; onWishlist: (id: string) => void; isWishlisted: boolean }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card card-hover group border border-gray-100">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={pkg.thumbnail} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {pkg.trending && <span className="badge-orange">🔥 Trending</span>}
          {pkg.featured && !pkg.trending && <span className="badge-blue">⭐ Featured</span>}
        </div>

        {/* Wishlist */}
        <button onClick={(e) => { e.preventDefault(); onWishlist(pkg.id); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all
            ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-rose-50 hover:text-rose-500'}`}>
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>

        {/* Duration */}
        <div className="absolute bottom-3 left-3 bg-navy-900/80 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
          {pkg.duration.days}D / {pkg.duration.nights}N
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={13} className="text-brand-blue" />
          <span className="text-brand-blue text-xs font-semibold">{pkg.destinations.join(' → ')}</span>
        </div>
        <h3 className="font-display font-bold text-navy-900 text-lg leading-snug mb-2 line-clamp-2">{pkg.title}</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <StarRating rating={pkg.rating} showCount count={pkg.reviewCount} />
          <span className="text-gray-300">·</span>
          <span className="text-gray-500 text-xs">{pkg.category}</span>
        </div>

        {/* Highlights preview */}
        <div className="flex flex-wrap gap-1 mb-3">
          {pkg.highlights.slice(0, 3).map((h: string) => (
            <span key={h} className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-lg">{h.slice(0, 25)}</span>
          ))}
        </div>

        {/* Included Hotel Stay details */}
        {pkg.hotels && pkg.hotels.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-navy-800 bg-amber-50/70 border border-amber-200/60 px-2.5 py-1.5 rounded-xl mb-4">
            <Building2 size={13} className="text-brand-orange shrink-0" />
            <span className="font-semibold text-brand-orange">Hotel Included:</span>
            <span className="truncate text-navy-700">{pkg.hotels[0].category}★ {pkg.hotels[0].name}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <PriceTag price={pkg.price.adult} originalPrice={pkg.price.originalPrice} />
          <Link to={`/packages/${pkg.slug}`}
            className="btn-primary py-2 px-4 text-sm">
            View <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
