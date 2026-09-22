import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Phone, Mail, Instagram, Facebook, Twitter, Youtube, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-brand-orange to-orange-400">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white">Ready for your next adventure?</h3>
            <p className="text-white/80 mt-1">Join 50,000+ happy travelers who've explored India with Wanderly.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/packages" className="bg-white text-brand-orange font-bold px-6 py-3 rounded-2xl hover:bg-orange-50 transition-all shadow-lg flex items-center gap-2">
              Explore Packages <ArrowRight size={18} />
            </Link>
            <Link to="/trip-builder" className="bg-white/20 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2">
              Build Custom Trip
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-orange rounded-xl flex items-center justify-center">
                <Globe size={18} className="text-white" />
              </div>
              <span className="text-2xl font-display font-bold">Wander<span className="text-brand-orange">ly</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              India's premium travel booking platform. We craft unforgettable journeys across every corner of incredible India — from the Himalayas to the backwaters.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: <Instagram size={18} />, href: '#' },
                { icon: <Facebook size={18} />, href: '#' },
                { icon: <Twitter size={18} />, href: '#' },
                { icon: <Youtube size={18} />, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-brand-orange transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><Mail size={14} /> hello@wanderly.in</div>
              <div className="flex items-center gap-2"><MapPin size={14} /> 123 Travel Street, Bhopal, MP 462001</div>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-white mb-4">Destinations</h4>
            <ul className="space-y-2">
              {['Rajasthan', 'Kerala', 'Goa', 'Kashmir', 'Manali', 'Ladakh', 'Uttarakhand', 'Andaman'].map(d => (
                <li key={d}>
                  <Link to={`/destinations/${d.toLowerCase()}`} className="text-gray-400 text-sm hover:text-brand-orange transition-colors">
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                { label: 'Tour Packages', href: '/packages' },
                { label: 'City Tours', href: '/city-tours' },
                { label: 'Car Rental', href: '/car-rental' },
                { label: 'Hotels', href: '/hotels' },
                { label: 'Attractions', href: '/attractions' },
                { label: 'Custom Trip Builder', href: '/trip-builder' },
                { label: 'Offers & Deals', href: '/offers' },
                { label: 'Travel Blog', href: '/blog' },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-gray-400 text-sm hover:text-brand-orange transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                'About Us', 'Contact Us', 'FAQ',
                'Terms & Conditions', 'Privacy Policy',
                'Cancellation Policy', 'Refund Policy',
                'Partner with Us',
              ].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-brand-orange transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">© 2024 Wanderly Travel Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span>🔒 SSL Secured</span>
            <span>✅ IATA Certified</span>
            <span>💳 Safe Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
