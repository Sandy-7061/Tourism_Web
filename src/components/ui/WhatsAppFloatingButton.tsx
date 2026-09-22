import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/zemtro_tour_logo.png';

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '9329781327';
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent('Hi Zemtro_tour, I would like to inquire about tour packages and bookings.')}`;

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            className="mb-3 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 w-72 backdrop-blur-lg"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={logoImg}
                  alt="Zemtro_tour"
                  className="w-8 h-8 rounded-full object-cover bg-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Zemtro_tour Support</h4>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online Now
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Have questions or need a custom package? Chat with our travel expert right away!
            </p>

            <div className="space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                <MessageCircle size={16} /> Chat on WhatsApp (+91 {phoneNumber})
              </a>

              <a
                href={`tel:+91${phoneNumber}`}
                className="flex items-center justify-center gap-2 w-full bg-navy-900 hover:bg-brand-blue text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-all"
              >
                <Phone size={14} /> Call Us: +91 {phoneNumber}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-1.5 bg-navy-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-emerald-500/30 backdrop-blur-sm pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            WhatsApp: +91 {phoneNumber}
          </motion.div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-emerald-500/30"
          aria-label="Contact Zemtro_tour on WhatsApp or Call"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <>
              <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold">
                1
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
