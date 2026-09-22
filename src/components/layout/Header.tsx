import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Heart, User, Search, Globe, ChevronDown, Phone,
  MapPin, Package, Car, Building2, Compass, Tag, BookOpen, Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/zemtro_tour_logo.png';

const navLinks = [
  {
    label: 'Destinations',
    href: '/destinations',
    icon: <Globe size={16} />,
    mega: true,
    items: [
      { label: 'Rajasthan', href: '/destinations/rajasthan', icon: '🏰' },
      { label: 'Kerala', href: '/destinations/kerala', icon: '🌴' },
      { label: 'Goa', href: '/destinations/goa', icon: '🏖️' },
      { label: 'Kashmir', href: '/destinations/kashmir', icon: '🏔️' },
      { label: 'Manali', href: '/destinations/manali', icon: '❄️' },
      { label: 'Ladakh', href: '/destinations/leh-ladakh', icon: '🛕' },
    ]
  },
  {
    label: 'Packages',
    href: '/packages',
    icon: <Package size={16} />,
    mega: false,
  },
  {
    label: 'City Tours',
    href: '/city-tours',
    icon: <Compass size={16} />,
    mega: false,
  },
  {
    label: 'Car Rental',
    href: '/car-rental',
    icon: <Car size={16} />,
    mega: false,
  },
  {
    label: 'Hotels',
    href: '/hotels',
    icon: <Building2 size={16} />,
    mega: false,
  },
  {
    label: 'Offers',
    href: '/offers',
    icon: <Tag size={16} />,
    mega: false,
  },
  {
    label: 'Blog',
    href: '/blog',
    icon: <BookOpen size={16} />,
    mega: false,
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const { isMenuOpen, setIsMenuOpen, wishlist, isLoggedIn, user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setMegaOpen(null);
  }, [location.pathname]);

  const navBg = isHome
    ? scrolled
      ? 'bg-white/95 backdrop-blur-xl shadow-glass border-b border-white/50'
      : 'bg-transparent'
    : 'bg-white/95 backdrop-blur-xl shadow-glass border-b border-white/50';

  const textColor = isHome && !scrolled ? 'text-white' : 'text-navy-900';
  const logoColor = isHome && !scrolled ? 'text-white' : 'text-brand-blue';

  return (
    <>
      {/* Top Bar */}
      {!isHome && (
        <div className="bg-brand-blue text-white text-xs py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a href="tel:+919329781327" className="flex items-center gap-1 hover:text-brand-orange transition-colors">
                <Phone size={12} /> +91 9329781327
              </a>
              <a href="https://wa.me/919329781327" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors">
                <span>💬 WhatsApp: +91 9329781327</span>
              </a>
              <span className="hidden sm:flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" /> 4.9 Rating · 50,000+ Happy Travelers</span>
            </div>
            <div className="flex items-center gap-3">
              <span>🌏 English</span>
              <span>₹ INR</span>
            </div>
          </div>
        </div>
      )}

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isHome ? '' : 'relative'} ${navBg}`}
        style={{ top: isHome ? 0 : 'auto' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={logoImg}
                alt="Zemtro_tour Logo"
                className="w-10 h-10 object-cover rounded-xl shadow-orange group-hover:scale-105 transition-transform bg-white border border-white/40"
              />
              <div>
                <span className={`text-2xl font-display font-bold tracking-tight ${logoColor} transition-colors`}>
                  Zemtro<span className="text-brand-orange">_tour</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <div key={link.label} className="relative"
                  onMouseEnter={() => link.mega && setMegaOpen(link.label)}
                  onMouseLeave={() => setMegaOpen(null)}>
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${textColor} hover:text-brand-orange hover:bg-white/10
                      ${location.pathname.startsWith(link.href) && link.href !== '/' ? 'text-brand-orange' : ''}`}>
                    {link.label}
                    {link.mega && <ChevronDown size={14} className={`transition-transform ${megaOpen === link.label ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Mega dropdown */}
                  {link.mega && (
                    <AnimatePresence>
                      {megaOpen === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-card-hover border border-gray-100 p-3">
                          <div className="grid grid-cols-2 gap-1">
                            {link.items?.map(item => (
                              <Link key={item.label} to={item.href}
                                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors text-sm text-navy-900 font-medium">
                                <span>{item.icon}</span>
                                {item.label}
                              </Link>
                            ))}
                            <Link to="/destinations"
                              className="col-span-2 flex items-center justify-center gap-1 p-2 mt-1 rounded-xl bg-brand-blue/5 text-brand-blue text-xs font-semibold hover:bg-brand-blue/10 transition-colors">
                              View All Destinations <ChevronDown size={12} className="-rotate-90" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => navigate('/packages')}
                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                  ${textColor} hover:text-brand-orange hover:bg-white/10 transition-all`}>
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link to="/dashboard"
                className={`relative hidden md:flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-all
                  ${textColor} hover:text-rose-500 hover:bg-white/10`}>
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* User */}
              {isLoggedIn ? (
                <Link to="/dashboard"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-orange text-white text-sm font-semibold hover:bg-orange-600 transition-all shadow-orange">
                  <img src={user?.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                  <span className="max-w-20 truncate">{user?.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <button
                  onClick={() => useApp().login()}
                  className="hidden md:flex btn-primary text-sm px-4 py-2">
                  <User size={16} /> Login
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2 rounded-xl ${textColor} hover:bg-white/10 transition-all`}>
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(link => (
                  <div key={link.label}>
                    <Link to={link.href}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-navy-900 font-medium hover:bg-gray-50 transition-colors">
                      <span className="text-brand-blue">{link.icon}</span>
                      {link.label}
                    </Link>
                    {link.mega && link.items && (
                      <div className="ml-8 mt-1 space-y-1">
                        {link.items.map(item => (
                          <Link key={item.label} to={item.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            {item.icon} {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <Link to="/dashboard" className="btn-primary justify-center">
                    <User size={16} /> My Account
                  </Link>
                  <Link to="/trip-builder" className="btn-outline justify-center">
                    <MapPin size={16} /> Plan Custom Trip
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
