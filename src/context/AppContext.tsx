import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem, Booking, Traveller } from '../types';

// ===== MOCK BOOKINGS =====
const mockBookings: Booking[] = [
  {
    id: 'BKG-2024-001', packageId: 'pkg-001', type: 'Package', status: 'Upcoming',
    bookingDate: '2024-01-10', travelDate: '2024-02-17',
    travellers: [
      { firstName: 'Rahul', lastName: 'Sharma', age: 32, gender: 'Male', type: 'Adult' },
      { firstName: 'Priya', lastName: 'Sharma', age: 29, gender: 'Female', type: 'Adult' },
    ],
    totalAmount: 41998, paidAmount: 10000, paymentMode: 'Advance', couponApplied: 'HONEYMOON15',
    discountAmount: 6300, addons: ['addon-001', 'addon-002'], reference: 'WAN-2024-00001',
  },
  {
    id: 'BKG-2024-002', packageId: 'pkg-002', type: 'Package', status: 'Completed',
    bookingDate: '2023-11-15', travelDate: '2023-12-22',
    travellers: [
      { firstName: 'Rahul', lastName: 'Sharma', age: 32, gender: 'Male', type: 'Adult' },
    ],
    totalAmount: 24999, paidAmount: 24999, paymentMode: 'Full', couponApplied: undefined,
    discountAmount: 0, addons: [], reference: 'WAN-2023-00145',
  },
  {
    id: 'BKG-2024-003', carId: 'car-004', type: 'Car', status: 'Upcoming',
    bookingDate: '2024-01-20', travelDate: '2024-02-10',
    travellers: [{ firstName: 'Rahul', lastName: 'Sharma', age: 32, gender: 'Male', type: 'Adult' }],
    totalAmount: 7998, paidAmount: 7998, paymentMode: 'Full',
    discountAmount: 0, addons: [], reference: 'WAN-2024-00052',
  },
];

// ===== INTERFACES =====
interface AppContextType {
  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (id: string, type: WishlistItem['type']) => void;
  removeFromWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  
  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  
  // Active booking flow
  currentBooking: Partial<Booking> & {
    packageId?: string;
    carId?: string;
    hotelId?: string;
    travelDate?: string;
    adults?: number;
    children?: number;
    selectedAddons?: string[];
    coupon?: string;
    discountAmount?: number;
    totalAmount?: number;
    selectedRoom?: string;
    paymentMode?: 'Full' | 'Advance';
    travellers?: Traveller[];
  };
  setCurrentBooking: (booking: Partial<AppContextType['currentBooking']>) => void;
  resetCurrentBooking: () => void;
  
  // Search params
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // UI state
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  
  // Mock user
  user: { name: string; email: string; phone: string; avatar: string } | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  
  // Notifications
  notifications: string[];
  addNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    { id: 'pkg-002', type: 'Package', addedAt: '2024-01-10' },
    { id: 'hotel-001', type: 'Hotel', addedAt: '2024-01-12' },
  ]);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [currentBooking, setCurrentBookingState] = useState<AppContextType['currentBooking']>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  const user = isLoggedIn ? {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  } : null;

  const addToWishlist = (id: string, type: WishlistItem['type']) => {
    if (!wishlist.find(w => w.id === id)) {
      setWishlist(prev => [...prev, { id, type, addedAt: new Date().toISOString().split('T')[0] }]);
      addNotification('Added to wishlist! ❤️');
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
    addNotification('Removed from wishlist');
  };

  const isWishlisted = (id: string) => wishlist.some(w => w.id === id);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const setCurrentBooking = (booking: Partial<AppContextType['currentBooking']>) => {
    setCurrentBookingState(prev => ({ ...prev, ...booking }));
  };

  const resetCurrentBooking = () => setCurrentBookingState({});

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AppContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist, isWishlisted,
      bookings, addBooking,
      currentBooking, setCurrentBooking, resetCurrentBooking,
      searchQuery, setSearchQuery,
      isMenuOpen, setIsMenuOpen,
      user, isLoggedIn, login, logout,
      notifications, addNotification,
    }}>
      {children}
      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((n, i) => (
          <div key={i} className="bg-navy-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-slide-up">
            {n}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
