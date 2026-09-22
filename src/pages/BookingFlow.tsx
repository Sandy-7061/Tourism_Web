import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, User, Users, CreditCard, Gift, ArrowLeft, Shield, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import packages from '../data/packages';
import { formatINR, generateBookingRef, applyDiscount } from '../utils/helpers';
import { Traveller } from '../types';

const STEPS = ['Travel Details', 'Traveller Info', 'Add-ons', 'Payment'];

export default function BookingFlow() {
  const navigate = useNavigate();
  const { currentBooking, setCurrentBooking, addBooking, addNotification, user } = useApp();
  const [step, setStep] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'Full' | 'Advance'>('Full');
  const [processing, setProcessing] = useState(false);

  const pkg = packages.find(p => p.id === currentBooking.packageId) || packages[0];
  const adults = currentBooking.adults || 2;
  const children = currentBooking.children || 0;
  const addons = currentBooking.selectedAddons || [];

  const baseAmount = (pkg.price.adult * adults) + (pkg.price.child * children) +
    addons.reduce((sum, id) => sum + (pkg.addons.find(a => a.id === id)?.price || 0), 0);
  const totalAmount = Math.max(0, baseAmount - discountAmount);
  const advanceAmount = Math.round(totalAmount * 0.3);

  // Traveller info
  const [travellers, setTravellers] = useState<Traveller[]>(
    Array.from({ length: adults + children }, (_, i) => ({
      firstName: i === 0 && user ? user.name.split(' ')[0] : '',
      lastName: i === 0 && user ? user.name.split(' ')[1] || '' : '',
      age: i < adults ? 28 : 10,
      gender: 'Male' as const,
      type: (i < adults ? 'Adult' : 'Child') as 'Adult' | 'Child',
    }))
  );

  const applyCoupon = () => {
    const result = applyDiscount(baseAmount, couponCode);
    if (result.valid) {
      setDiscountAmount(result.discount);
      setCouponApplied(true);
      addNotification(`Coupon applied! ₹${result.discount.toLocaleString('en-IN')} discount`);
    } else {
      addNotification('Invalid or expired coupon code');
    }
  };

  const handleConfirmPayment = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    const booking = {
      id: `BKG-2024-${Date.now()}`,
      packageId: pkg.id,
      type: 'Package' as const,
      status: 'Upcoming' as const,
      bookingDate: new Date().toISOString().split('T')[0],
      travelDate: currentBooking.travelDate || '',
      travellers,
      totalAmount,
      paidAmount: paymentMode === 'Full' ? totalAmount : advanceAmount,
      paymentMode,
      couponApplied: couponApplied ? couponCode : undefined,
      discountAmount,
      addons,
      reference: generateBookingRef(),
    };
    addBooking(booking);
    navigate('/booking-confirmation', { state: { booking, pkg } });
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all
            ${i === step ? 'bg-brand-blue text-white' : i < step ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${i < step ? 'bg-emerald-100 text-emerald-600' : i === step ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className="text-sm font-medium hidden sm:block">{s}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`h-0.5 w-8 ${i < step ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}
          className="flex items-center gap-2 text-gray-500 hover:text-navy-900 mb-6 transition-colors">
          <ArrowLeft size={18} /> {step === 0 ? 'Back to Package' : 'Previous Step'}
        </button>

        <h1 className="text-2xl font-display font-bold text-navy-900 mb-2">Complete Your Booking</h1>
        <p className="text-gray-500 mb-6">{pkg.title}</p>

        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

                {/* STEP 0: Travel Details */}
                {step === 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-card">
                    <h2 className="text-lg font-bold mb-5">Travel Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Travel Date</label>
                        <select className="input-field" value={currentBooking.travelDate || ''} onChange={e => setCurrentBooking({ travelDate: e.target.value })}>
                          <option value="">Select travel date</option>
                          {pkg.availableDates.map(d => (
                            <option key={d} value={d}>{new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Adults</label>
                          <select className="input-field" value={adults} onChange={e => setCurrentBooking({ adults: Number(e.target.value) })}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Children (under 12)</label>
                          <select className="input-field" value={children} onChange={e => setCurrentBooking({ children: Number(e.target.value) })}>
                            {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Child' : 'Children'}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Special Requirements</label>
                        <textarea placeholder="Vegetarian meals, wheelchair access, any allergies..." className="input-field h-24 resize-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: Traveller Info */}
                {step === 1 && (
                  <div className="bg-white rounded-2xl p-6 shadow-card">
                    <h2 className="text-lg font-bold mb-5">Traveller Information</h2>
                    <div className="space-y-6">
                      {travellers.map((t, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <User size={16} className="text-brand-blue" />
                            <h3 className="font-semibold">{t.type} {i + 1}</h3>
                            {i === 0 && <span className="badge-blue text-xs">Lead Traveller</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">First Name</label>
                              <input type="text" placeholder="First name" value={t.firstName}
                                onChange={e => { const arr = [...travellers]; arr[i] = { ...arr[i], firstName: e.target.value }; setTravellers(arr); }}
                                className="input-field" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
                              <input type="text" placeholder="Last name" value={t.lastName}
                                onChange={e => { const arr = [...travellers]; arr[i] = { ...arr[i], lastName: e.target.value }; setTravellers(arr); }}
                                className="input-field" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Age</label>
                              <input type="number" value={t.age} min={1} max={100}
                                onChange={e => { const arr = [...travellers]; arr[i] = { ...arr[i], age: Number(e.target.value) }; setTravellers(arr); }}
                                className="input-field" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Gender</label>
                              <select value={t.gender} onChange={e => { const arr = [...travellers]; arr[i] = { ...arr[i], gender: e.target.value as any }; setTravellers(arr); }} className="input-field">
                                <option>Male</option><option>Female</option><option>Other</option>
                              </select>
                            </div>
                          </div>
                          {i === 0 && (
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
                                <input type="tel" placeholder="+91 98765 43210" defaultValue={user?.phone} className="input-field" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                                <input type="email" placeholder="email@example.com" defaultValue={user?.email} className="input-field" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Add-ons & Coupon */}
                {step === 2 && (
                  <div className="bg-white rounded-2xl p-6 shadow-card space-y-6">
                    <h2 className="text-lg font-bold">Add-ons & Coupon</h2>
                    {pkg.addons.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Available Add-ons</h3>
                        <div className="space-y-3">
                          {pkg.addons.map(addon => (
                            <label key={addon.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                              <input type="checkbox" checked={addons.includes(addon.id)}
                                onChange={() => {
                                  const newAddons = addons.includes(addon.id) ? addons.filter(a => a !== addon.id) : [...addons, addon.id];
                                  setCurrentBooking({ selectedAddons: newAddons });
                                }} className="accent-brand-orange w-5 h-5" />
                              <span className="text-2xl">{addon.icon}</span>
                              <div className="flex-1">
                                <div className="font-semibold">{addon.name}</div>
                                <div className="text-sm text-gray-400">{addon.description}</div>
                              </div>
                              <span className="font-bold text-brand-blue">+{formatINR(addon.price)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Coupon */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2"><Gift size={18} className="text-brand-orange" /> Apply Coupon</h3>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Enter coupon code" value={couponCode}
                          onChange={e => setCouponCode(e.target.value.toUpperCase())}
                          className="input-field flex-1" disabled={couponApplied} />
                        <button onClick={applyCoupon} disabled={!couponCode || couponApplied}
                          className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${couponApplied ? 'bg-emerald-100 text-emerald-700' : 'btn-primary'}`}>
                          {couponApplied ? '✓ Applied' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && <p className="text-emerald-600 text-sm mt-2">🎉 You saved {formatINR(discountAmount)}!</p>}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {['EARLYBIRD60', 'HONEYMOON15', 'WEEKEND3000', 'FIRST1500'].map(code => (
                          <button key={code} onClick={() => { setCouponCode(code); }}
                            className="text-xs bg-brand-blue/5 text-brand-blue border border-brand-blue/20 px-3 py-1 rounded-lg font-mono hover:bg-brand-blue/10 transition-colors">
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Payment */}
                {step === 3 && (
                  <div className="bg-white rounded-2xl p-6 shadow-card space-y-5">
                    <h2 className="text-lg font-bold">Payment</h2>

                    {/* Payment Mode */}
                    <div>
                      <h3 className="font-semibold mb-3">Payment Mode</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${paymentMode === 'Full' ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200'}`}>
                          <input type="radio" name="payment" className="sr-only" checked={paymentMode === 'Full'} onChange={() => setPaymentMode('Full')} />
                          <div className="font-bold text-lg">{formatINR(totalAmount)}</div>
                          <div className="text-sm text-gray-500">Full Payment</div>
                          <div className="text-xs text-emerald-600 mt-1">Best value</div>
                        </label>
                        <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${paymentMode === 'Advance' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-200'}`}>
                          <input type="radio" name="payment" className="sr-only" checked={paymentMode === 'Advance'} onChange={() => setPaymentMode('Advance')} />
                          <div className="font-bold text-lg">{formatINR(advanceAmount)}</div>
                          <div className="text-sm text-gray-500">30% Advance</div>
                          <div className="text-xs text-gray-400 mt-1">Balance before travel</div>
                        </label>
                      </div>
                    </div>

                    {/* Mock Payment methods */}
                    <div>
                      <h3 className="font-semibold mb-3">Payment Method</h3>
                      <div className="space-y-2">
                        {[
                          { label: 'UPI (GPay, PhonePe, Paytm)', icon: <Smartphone size={20} />, desc: 'Instant, secure' },
                          { label: 'Credit / Debit Card', icon: <CreditCard size={20} />, desc: 'Visa, MC, RuPay' },
                          { label: 'Net Banking', icon: <Shield size={20} />, desc: 'All major banks' },
                        ].map((method, i) => (
                          <label key={method.label} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${i === 0 ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="paymethod" defaultChecked={i === 0} className="accent-brand-blue" />
                            <span className="text-brand-blue">{method.icon}</span>
                            <div>
                              <div className="font-medium text-sm">{method.label}</div>
                              <div className="text-xs text-gray-400">{method.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Mock UPI input */}
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Enter UPI ID</label>
                      <input type="text" placeholder="yourname@paytm" className="input-field" defaultValue="rahul@gpay" />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                      🔒 This is a mock payment demo. No real payment will be processed.
                    </div>

                    <button onClick={handleConfirmPayment} disabled={processing}
                      className="w-full btn-primary justify-center text-base py-4">
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>Pay {formatINR(paymentMode === 'Full' ? totalAmount : advanceAmount)} <ChevronRight size={18} /></>
                      )}
                    </button>
                  </div>
                )}

                {/* Navigation */}
                {step < 3 && (
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => setStep(s => s + 1)}
                      className="btn-primary">
                      Continue <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-card sticky top-24">
              <h3 className="font-bold mb-4">Order Summary</h3>
              <img src={pkg.thumbnail} alt={pkg.title} className="w-full h-32 object-cover rounded-xl mb-4" />
              <h4 className="font-semibold text-sm text-navy-900 mb-1">{pkg.title}</h4>
              <p className="text-xs text-gray-400 mb-4">{pkg.duration.days}D/{pkg.duration.nights}N · {currentBooking.travelDate || 'Date TBD'}</p>
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between"><span className="text-gray-500">Adults × {adults}</span><span>{formatINR(pkg.price.adult * adults)}</span></div>
                {children > 0 && <div className="flex justify-between"><span className="text-gray-500">Children × {children}</span><span>{formatINR(pkg.price.child * children)}</span></div>}
                {discountAmount > 0 && <div className="flex justify-between text-emerald-600"><span>Coupon Discount</span><span>-{formatINR(discountAmount)}</span></div>}
                <div className="flex justify-between font-bold text-navy-900 border-t border-gray-100 pt-2">
                  <span>Total</span><span>{formatINR(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
