import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Download, Share2, Home, Calendar, MapPin, Users, Phone } from 'lucide-react';
import { formatINR, formatDate } from '../utils/helpers';

export default function BookingConfirmation() {
  const { state } = useLocation() as { state: { booking: any; pkg: any } };
  const { booking, pkg } = state || {};

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">No booking found</h2>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4 py-16">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl shadow-glass-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center text-white">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} className="text-emerald-500" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold mb-2">Booking Confirmed! 🎉</h1>
            <p className="text-white/80">Your adventure awaits — get ready for an unforgettable journey!</p>
          </div>

          <div className="p-8">
            {/* Booking Reference */}
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm mb-2">Booking Reference</p>
              <div className="text-3xl font-mono font-bold text-brand-blue tracking-widest">{booking.reference}</div>
              <p className="text-gray-400 text-xs mt-2">Save this for your records</p>
            </div>

            {/* Package info */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <div className="flex gap-4">
                {pkg && <img src={pkg.thumbnail} alt={pkg.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />}
                <div>
                  <h3 className="font-bold text-navy-900 mb-1">{pkg?.title || 'Tour Package'}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(booking.travelDate)}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {booking.travellers.length} Travellers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Booking Date', value: formatDate(booking.bookingDate) },
                { label: 'Travel Date', value: formatDate(booking.travelDate) },
                { label: 'Payment Mode', value: booking.paymentMode === 'Full' ? 'Full Payment' : '30% Advance Paid' },
                { label: 'Amount Paid', value: formatINR(booking.paidAmount) },
                { label: 'Lead Traveller', value: `${booking.travellers[0]?.firstName} ${booking.travellers[0]?.lastName}` },
                { label: 'Status', value: '✅ Confirmed' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                  <div className="font-semibold text-navy-900 text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Balance due */}
            {booking.paymentMode === 'Advance' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-800 text-sm font-medium">
                  ⚠️ Balance due: {formatINR(booking.totalAmount - booking.paidAmount)} — to be paid before your travel date
                </p>
              </div>
            )}

            {/* Next steps */}
            <div className="mb-6">
              <h4 className="font-bold text-navy-900 mb-3">What's Next?</h4>
              <div className="space-y-2">
                {[
                  'Booking confirmation sent to your email',
                  'Tour manager will call you within 24 hours',
                  'Detailed itinerary PDF will be shared 3 days before departure',
                  'Driver details will be shared on travel day morning',
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-brand-blue font-semibold mb-1"><Phone size={16} /> Need help?</div>
              <p className="text-sm text-gray-600">Call us anytime at <a href="tel:+919876543210" className="font-bold">+91 98765 43210</a> or email <a href="mailto:support@wanderly.in" className="font-bold">support@wanderly.in</a></p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/dashboard" className="flex-1 btn-primary justify-center">
                <Home size={18} /> My Trips
              </Link>
              <button className="flex-1 btn-outline justify-center" onClick={() => window.print()}>
                <Download size={18} /> Download Invoice
              </button>
              <button className="flex-1 btn-outline justify-center">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
