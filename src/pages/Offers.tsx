import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Copy, Check, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import offers from '../data/offers';

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-hero text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Offers & Deals</h1>
          <p className="text-white/70 text-lg">Exclusive discounts to make your dream trip more affordable</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, i) => (
            <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all border border-gray-100 flex">
                <div className="relative w-40 flex-shrink-0 overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                    {offer.type === 'flat' ? `₹${offer.discount.toLocaleString('en-IN')} OFF` : `${offer.discount}% OFF`}
                  </div>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag size={14} className="text-brand-orange" />
                    <span className="text-xs font-semibold text-brand-orange uppercase">{offer.category}</span>
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg mb-1">{offer.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{offer.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <Calendar size={12} />
                    <span>Valid till {new Date(offer.validTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-3 py-2 flex-1">
                      <code className="font-mono font-bold text-brand-blue text-sm">{offer.code}</code>
                    </div>
                    <button onClick={() => handleCopy(offer.code)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all
                        ${copiedCode === offer.code ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-blue text-white hover:bg-navy-800'}`}>
                      {copiedCode === offer.code ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                    </button>
                    <Link to="/packages" className="btn-primary py-2 px-3 text-sm">
                      Use <ArrowRight size={14} />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Min. booking: ₹{offer.minAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
