import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Package, Heart, Settings, LogOut, Bell, Download, ChevronRight,
  Calendar, MapPin, Clock, Star, CreditCard, Phone, Mail, Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import packages from '../data/packages';
import hotels from '../data/hotels';
import { formatDate, formatINR } from '../utils/helpers';

const TABS = [
  { id: 'bookings', label: 'My Trips', icon: <Package size={18} /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
  { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
];

const STATUS_COLORS: Record<string, string> = {
  Upcoming: 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-600',
};

export default function Dashboard() {
  const [tab, setTab] = useState('bookings');
  const { user, bookings, wishlist, removeFromWishlist, logout } = useApp();

  const getPackageName = (id?: string) => id ? (packages.find(p => p.id === id)?.title || 'Unknown Package') : 'Unknown';
  const getHotelName = (id?: string) => id ? (hotels.find(h => h.id === id)?.name || 'Unknown Hotel') : 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-hero text-white py-12 pt-20">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-5">
          <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-full border-4 border-white/30 object-cover" />
          <div>
            <h1 className="text-3xl font-display font-bold">{user?.name}</h1>
            <p className="text-white/70">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-white/70">
              <span>⭐ {bookings.length} Trips Booked</span>
              <span>·</span>
              <span>❤️ {wishlist.length} Wishlisted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-48 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-2xl p-3 shadow-card sticky top-24">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left mb-1
                    ${tab === t.id ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile tab bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all
                  ${tab === t.id ? 'text-brand-blue' : 'text-gray-400'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 mb-24 md:mb-0">
            {/* BOOKINGS */}
            {tab === 'bookings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-navy-900 mb-5">My Trips</h2>
                <div className="space-y-4">
                  {bookings.map(booking => {
                    const pkg = booking.packageId ? packages.find(p => p.id === booking.packageId) : null;
                    return (
                      <div key={booking.id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {pkg && (
                            <img src={pkg.thumbnail} alt={pkg.title}
                              className="w-full sm:w-28 h-28 rounded-xl object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-bold text-navy-900 text-lg">
                                  {booking.packageId ? getPackageName(booking.packageId) : `Car Rental`}
                                </h3>
                                <p className="text-sm text-gray-400">Ref: {booking.reference}</p>
                              </div>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[booking.status]}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(booking.travelDate)}</span>
                              <span className="flex items-center gap-1"><User size={14} /> {booking.travellers.length} Travellers</span>
                              <span className="flex items-center gap-1"><CreditCard size={14} /> {formatINR(booking.totalAmount)}</span>
                            </div>
                            {booking.paymentMode === 'Advance' && (
                              <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 mb-3">
                                ⚠️ Balance due: {formatINR(booking.totalAmount - booking.paidAmount)}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button className="btn-outline py-1.5 px-3 text-sm flex items-center gap-1">
                                <Download size={14} /> Invoice
                              </button>
                              {booking.status === 'Upcoming' && (
                                <button className="text-sm px-3 py-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
                                  Cancel
                                </button>
                              )}
                              {booking.packageId && (
                                <button className="text-sm px-3 py-1.5 rounded-xl border border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5 transition-all">
                                  View Details
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {bookings.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">✈️</div>
                      <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                      <p className="text-gray-500 mb-6">Start exploring and book your first adventure!</p>
                      <a href="/packages" className="btn-primary">Explore Packages</a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* WISHLIST */}
            {tab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-navy-900 mb-5">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500">Heart packages and hotels to save them here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map(item => {
                      const pkg = packages.find(p => p.id === item.id);
                      const hotel = hotels.find(h => h.id === item.id);
                      const entity = pkg || hotel;
                      if (!entity) return null;
                      return (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100">
                          <div className="relative h-40 overflow-hidden">
                            <img src={pkg ? pkg.thumbnail : (hotel as any)?.images?.[0]} alt=""
                              className="w-full h-full object-cover" />
                            <button onClick={() => removeFromWishlist(item.id)}
                              className="absolute top-3 right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-rose-600 transition-all">
                              ×
                            </button>
                          </div>
                          <div className="p-4">
                            <div className="text-xs text-brand-orange font-semibold mb-1">{item.type}</div>
                            <h3 className="font-bold text-navy-900">{pkg?.title || hotel?.name}</h3>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-navy-900 font-bold">
                                {pkg ? `₹${pkg.price.adult.toLocaleString('en-IN')}` : `₹${(hotel as any)?.pricePerNight?.toLocaleString('en-IN')}`}
                              </span>
                              <span className="text-gray-400 text-xs">{pkg ? '/person' : '/night'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* PROFILE */}
            {tab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-navy-900 mb-5">Profile Settings</h2>
                <div className="bg-white rounded-2xl p-6 shadow-card space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                    <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold text-navy-900">{user?.name}</h3>
                      <p className="text-gray-400 text-sm">Member since 2022 · Premium Traveler</p>
                    </div>
                    <button className="ml-auto btn-outline py-2 px-3 text-sm flex items-center gap-1">
                      <Edit2 size={14} /> Edit Photo
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'First Name', value: user?.name.split(' ')[0], type: 'text' },
                      { label: 'Last Name', value: user?.name.split(' ')[1] || '', type: 'text' },
                      { label: 'Email', value: user?.email, type: 'email' },
                      { label: 'Phone', value: user?.phone, type: 'tel' },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="text-sm font-semibold text-navy-900 mb-2 block">{field.label}</label>
                        <input type={field.type} defaultValue={field.value} className="input-field" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold text-navy-900 mb-2 block">Address</label>
                      <input type="text" defaultValue="New Delhi, India" className="input-field" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button className="btn-primary">Save Changes</button>
                    <button className="btn-outline">Change Password</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {tab === 'notifications' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-navy-900 mb-5">Notifications</h2>
                <div className="space-y-3">
                  {[
                    { icon: '✈️', title: 'Trip reminder: Rajasthan Heritage tour in 7 days', time: '2 hours ago', unread: true },
                    { icon: '🏷️', title: 'New offer: FESTIVE22 — 22% off all packages', time: '1 day ago', unread: true },
                    { icon: '📄', title: 'Your invoice BKG-2024-001 is ready for download', time: '2 days ago', unread: false },
                    { icon: '⭐', title: 'Share your review of Kerala Backwaters tour', time: '5 days ago', unread: false },
                    { icon: '📞', title: 'Tour manager will call you tomorrow at 10 AM', time: '1 week ago', unread: false },
                  ].map((n, i) => (
                    <div key={i} className={`bg-white rounded-2xl p-4 shadow-card border flex items-start gap-4 transition-all
                      ${n.unread ? 'border-brand-blue/20 bg-brand-blue/5' : 'border-gray-100'}`}>
                      <span className="text-2xl flex-shrink-0">{n.icon}</span>
                      <div className="flex-1">
                        <p className={`text-sm ${n.unread ? 'font-semibold text-navy-900' : 'text-gray-700'}`}>{n.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 bg-brand-blue rounded-full flex-shrink-0 mt-1" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
