import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign, ArrowRight, ArrowLeft, Check, Zap, Plus, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const DESTINATIONS = [
  { name: 'Rajasthan', emoji: '🏰', desc: 'Heritage palaces & desert' },
  { name: 'Kerala', emoji: '🌴', desc: 'Backwaters & beaches' },
  { name: 'Goa', emoji: '🏖️', desc: 'Beaches & nightlife' },
  { name: 'Kashmir', emoji: '❄️', desc: 'Paradise on Earth' },
  { name: 'Manali', emoji: '⛰️', desc: 'Snow & adventure' },
  { name: 'Ladakh', emoji: '🛕', desc: 'High altitude desert' },
  { name: 'Uttarakhand', emoji: '🏔️', desc: 'Yoga & Himalayas' },
  { name: 'Andaman', emoji: '🐠', desc: 'Islands & diving' },
  { name: 'Meghalaya', emoji: '🌿', desc: 'Living root bridges' },
  { name: 'Tamil Nadu', emoji: '🛖', desc: 'Temples & culture' },
  { name: 'Hampi', emoji: '🗿', desc: 'Ancient ruins' },
  { name: 'Varanasi', emoji: '🕯️', desc: 'Spiritual India' },
];

const INTERESTS = [
  { id: 'culture', label: 'Culture & Heritage', emoji: '🏛️' },
  { id: 'beach', label: 'Beaches', emoji: '🏖️' },
  { id: 'adventure', label: 'Adventure Sports', emoji: '🧗' },
  { id: 'wildlife', label: 'Wildlife Safari', emoji: '🐯' },
  { id: 'spiritual', label: 'Spiritual & Pilgrimage', emoji: '🛕' },
  { id: 'food', label: 'Food & Local Culture', emoji: '🍛' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'wellness', label: 'Wellness & Ayurveda', emoji: '🧘' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'history', label: 'History & Architecture', emoji: '🏰' },
];

const STEPS = ['Destination', 'Travel Dates', 'Group', 'Interests & Budget', 'Your Plan'];

const mockItinerary = (dest: string, days: number, interests: string[]) => [
  { day: 1, title: `Arrive in ${dest}`, activities: ['Airport/Station pickup', 'Hotel check-in', 'Evening orientation walk', 'Welcome dinner at local restaurant'] },
  { day: 2, title: `Explore ${dest} City`, activities: ['Morning sightseeing — top landmarks', 'Guided heritage walk', 'Local market visit', 'Cultural show in the evening'] },
  { day: 3, title: 'Day Excursion', activities: ['Excursion to nearby attraction', 'Scenic photography spots', 'Village or forest walk', 'Sunset viewpoint'] },
  ...(days > 4 ? [{ day: 4, title: 'Leisure & Deep Dive', activities: ['Optional adventure activity', 'Local cooking class', 'Shopping for souvenirs', 'Rooftop dinner'] }] : []),
  { day: days, title: 'Departure', activities: ['Late breakfast', 'Last-minute shopping', 'Check-out', 'Drop at airport/station'] },
];

export default function TripBuilder() {
  const [step, setStep] = useState(0);
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState(5);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState(15000);
  const [interests, setInterests] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDest = (name: string) => {
    setSelectedDests(prev => prev.includes(name) ? prev.filter(d => d !== name) : [...prev, name]);
  };

  const toggleInterest = (id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const generateItinerary = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2500));
    setLoading(false);
    setGenerated(true);
    setStep(4);
  };

  const itinerary = generated ? mockItinerary(selectedDests[0] || 'India', days, interests) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-hero text-white py-12 pt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-4">
            <Zap size={14} className="text-brand-orange" /> AI-Powered Trip Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Build Your Perfect Trip</h1>
          <p className="text-white/70 text-lg">Answer a few questions — get a personalized itinerary in seconds</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto scrollbar-hide">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${i === step ? 'bg-brand-blue text-white' : i < step ? 'text-emerald-600' : 'text-gray-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${i < step ? 'bg-emerald-100 text-emerald-600' : i === step ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                  {i < step ? <Check size={10} /> : i + 1}
                </span>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 w-5 flex-shrink-0 ${i < step ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* STEP 0: Destination */}
              {step === 0 && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Where do you want to go?</h2>
                  <p className="text-gray-500 mb-6">Select one or more destinations</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {DESTINATIONS.map(d => (
                      <button key={d.name} onClick={() => toggleDest(d.name)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all hover:border-brand-blue
                          ${selectedDests.includes(d.name) ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="text-3xl mb-2">{d.emoji}</div>
                        <div className="font-semibold text-navy-900 text-sm">{d.name}</div>
                        <div className="text-xs text-gray-400">{d.desc}</div>
                        {selectedDests.includes(d.name) && (
                          <div className="mt-2 w-4 h-4 bg-brand-blue rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1: Travel Dates */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">When are you travelling?</h2>
                  <p className="text-gray-500 mb-6">Select your start date and trip duration</p>
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Start Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        className="input-field max-w-xs" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-4 block">Number of Days: <span className="text-brand-blue font-bold text-lg">{days}</span></label>
                      <div className="flex gap-3 flex-wrap">
                        {[3, 5, 7, 10, 14, 21].map(d => (
                          <button key={d} onClick={() => setDays(d)}
                            className={`px-5 py-3 rounded-xl font-semibold text-sm border-2 transition-all
                              ${days === d ? 'bg-brand-blue text-white border-brand-blue' : 'border-gray-200 text-gray-600 hover:border-brand-blue'}`}>
                            {d} Days
                          </button>
                        ))}
                      </div>
                      <div className="mt-4">
                        <input type="range" min={1} max={30} value={days} onChange={e => setDays(Number(e.target.value))}
                          className="w-full max-w-sm accent-brand-blue" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Group */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Who's travelling?</h2>
                  <p className="text-gray-500 mb-6">Tell us about your group size</p>
                  <div className="space-y-5 max-w-sm">
                    {[
                      { label: 'Adults', value: adults, set: setAdults, min: 1, max: 20 },
                      { label: 'Children (under 12)', value: children, set: setChildren, min: 0, max: 10 },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="font-semibold mb-3 block">{field.label}</label>
                        <div className="flex items-center gap-4">
                          <button onClick={() => field.set(Math.max(field.min, field.value - 1))}
                            className="w-10 h-10 bg-gray-100 rounded-xl text-xl font-bold hover:bg-gray-200 transition-colors">−</button>
                          <span className="text-2xl font-bold text-navy-900 w-8 text-center">{field.value}</span>
                          <button onClick={() => field.set(Math.min(field.max, field.value + 1))}
                            className="w-10 h-10 bg-brand-blue text-white rounded-xl text-xl font-bold hover:bg-navy-800 transition-colors">+</button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <label className="font-semibold mb-2 block">Type of Trip</label>
                      <div className="flex flex-wrap gap-2">
                        {['Solo', 'Couple', 'Family', 'Friends', 'Corporate Group'].map(t => (
                          <button key={t} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-brand-blue transition-all">
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Interests & Budget */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">What are your interests & budget?</h2>
                  <p className="text-gray-500 mb-6">We'll personalize your itinerary based on this</p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Interests (select all that apply)</h3>
                      <div className="flex flex-wrap gap-2">
                        {INTERESTS.map(i => (
                          <button key={i.id} onClick={() => toggleInterest(i.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                              ${interests.includes(i.id) ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-brand-orange'}`}>
                            {i.emoji} {i.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Budget per person: <span className="text-brand-blue font-bold text-xl">₹{budget.toLocaleString('en-IN')}</span></h3>
                      <input type="range" min={5000} max={100000} step={2500} value={budget} onChange={e => setBudget(Number(e.target.value))}
                        className="w-full max-w-md accent-brand-blue" />
                      <div className="flex justify-between text-xs text-gray-400 max-w-md mt-1">
                        <span>₹5,000 (Budget)</span>
                        <span>₹50,000 (Luxury)</span>
                        <span>₹1,00,000 (Ultra)</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {[{ label: 'Budget', value: 8000 }, { label: 'Mid-range', value: 18000 }, { label: 'Premium', value: 35000 }, { label: 'Luxury', value: 75000 }].map(b => (
                          <button key={b.label} onClick={() => setBudget(b.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                              ${budget === b.value ? 'bg-brand-blue text-white border-brand-blue' : 'border-gray-200 text-gray-600'}`}>
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Accommodation Preference</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Hostel', 'Budget Hotel', '3-Star Hotel', '4-Star Hotel', '5-Star Resort', 'Heritage Haveli', 'Homestay'].map(a => (
                          <button key={a} className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-brand-blue transition-all">
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Generated Itinerary */}
              {step === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-navy-900">Your Personalized Itinerary</h2>
                      <p className="text-gray-500 text-sm">{selectedDests.join(', ')} · {days} Days · {adults + children} People · ₹{budget.toLocaleString('en-IN')}/person</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {itinerary.map((day) => (
                      <div key={day.day} className="border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-blue to-navy-800 text-white px-5 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-bold text-sm">{day.day}</div>
                          <h3 className="font-bold">{day.title}</h3>
                        </div>
                        <div className="p-4">
                          <ul className="space-y-2">
                            {day.activities.map((act, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full flex-shrink-0" />
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Estimated cost */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
                    <h4 className="font-bold text-emerald-800 mb-3">Estimated Budget</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      {[
                        { label: 'Accommodation', value: Math.round(budget * 0.35) },
                        { label: 'Transport', value: Math.round(budget * 0.25) },
                        { label: 'Meals', value: Math.round(budget * 0.2) },
                        { label: 'Activities', value: Math.round(budget * 0.2) },
                      ].map(item => (
                        <div key={item.label} className="bg-white rounded-xl p-3 text-center">
                          <div className="font-bold text-navy-900">₹{item.value.toLocaleString('en-IN')}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{item.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-emerald-200 flex justify-between font-bold text-emerald-800">
                      <span>Total per person</span>
                      <span>₹{budget.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/packages" className="btn-primary flex-1 justify-center">
                      Book This Trip <ArrowRight size={18} />
                    </Link>
                    <button onClick={() => { setStep(0); setGenerated(false); }} className="btn-outline flex-1 justify-center">
                      Start Over
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
                <ArrowLeft size={16} /> Back
              </button>
              {step < 3 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={step === 0 && selectedDests.length === 0}
                  className="btn-primary">
                  Continue <ArrowRight size={18} />
                </button>
              ) : (
                <button onClick={generateItinerary} disabled={loading}
                  className="btn-primary">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating your trip...
                    </span>
                  ) : (
                    <><Zap size={16} /> Generate Itinerary</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
