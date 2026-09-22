// ===== CORE TYPES =====

export interface Image {
  url: string;
  alt: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

// ===== PACKAGE TYPES =====

export interface ItineraryActivity {
  time: string;
  activity: string;
  location: string;
  type: 'sightseeing' | 'meal' | 'transport' | 'hotel' | 'leisure';
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: ItineraryActivity[];
  hotel: string;
  meals: string[];
  transport: string;
  pickup?: string;
  drop?: string;
  image: string;
}

export interface PackageHotel {
  name: string;
  category: 3 | 4 | 5;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  amenities: string[];
  image: string;
}

export interface PackageAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  destination: string;
  destinations: string[];
  category: string;
  thumbnail: string;
  images: string[];
  duration: { days: number; nights: number };
  price: { adult: number; child: number; originalPrice: number };
  discount: number;
  rating: number;
  reviewCount: number;
  groupSize: { min: number; max: number };
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  hotels: PackageHotel[];
  mealPlan: string;
  transport: string;
  pickupPoint: string;
  dropPoint: string;
  addons: PackageAddon[];
  cancellationPolicy: string;
  availableDates: string[];
  tags: string[];
  featured: boolean;
  trending: boolean;
}

// ===== DESTINATION TYPES =====

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  thumbnail: string;
  images: string[];
  description: string;
  bestTime: string;
  temperature: string;
  language: string;
  currency: string;
  attractions: string[];
  popularFor: string[];
  packageCount: number;
  rating: number;
  featured: boolean;
}

// ===== HOTEL TYPES =====

export interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  originalPrice: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  destination: string;
  category: 3 | 4 | 5;
  thumbnail: string;
  images: string[];
  description: string;
  address: string;
  location: { lat: number; lng: number };
  amenities: string[];
  rooms: RoomType[];
  priceFrom: number;
  rating: number;
  reviewCount: number;
  policies: { checkIn: string; checkOut: string; cancellation: string };
  featured: boolean;
}

// ===== CAR RENTAL TYPES =====

export interface Car {
  id: string;
  name: string;
  model: string;
  category: 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury' | 'Tempo Traveller' | 'Bus';
  thumbnail: string;
  images: string[];
  capacity: number;
  luggage: number;
  transmission: 'Manual' | 'Automatic';
  fuel: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  ac: boolean;
  driverAvailable: boolean;
  selfDrive: boolean;
  pricePerDay: number;
  pricePerKm: number;
  baseKm: number;
  amenities: string[];
  rating: number;
  featured: boolean;
}

// ===== CITY TOUR TYPES =====

export interface CityTourActivity {
  time: string;
  place: string;
  description: string;
  duration: string;
  entryFee: number;
}

export interface CityTour {
  id: string;
  city: string;
  slug: string;
  thumbnail: string;
  images: string[];
  description: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  groupSize: number;
  startTime: string;
  highlights: string[];
  activities: CityTourActivity[];
  includes: string[];
  pickupPoints: string[];
}

// ===== ATTRACTION TYPES =====

export interface Attraction {
  id: string;
  name: string;
  slug: string;
  destination: string;
  category: 'Historical' | 'Religious' | 'Nature' | 'Adventure' | 'Cultural' | 'Beach';
  thumbnail: string;
  images: string[];
  description: string;
  openingHours: string;
  closedOn: string;
  entryFee: { adult: number; child: number; foreign: number };
  timings: string;
  bestTime: string;
  rating: number;
  nearbyHotels: string[];
  nearbyTours: string[];
  tips: string[];
  location: string;
}

// ===== OFFER TYPES =====

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  type: 'percentage' | 'flat';
  minAmount: number;
  maxDiscount: number;
  validTill: string;
  category: 'All' | 'Packages' | 'Hotels' | 'Cars' | 'City Tours';
  image: string;
  featured: boolean;
}

// ===== BLOG TYPES =====

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: { name: string; avatar: string; bio: string };
  category: string;
  tags: string[];
  thumbnail: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

// ===== BOOKING TYPES =====

export interface Traveller {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  type: 'Adult' | 'Child';
}

export interface Booking {
  id: string;
  packageId?: string;
  carId?: string;
  hotelId?: string;
  type: 'Package' | 'Car' | 'Hotel';
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Processing';
  bookingDate: string;
  travelDate: string;
  travellers: Traveller[];
  totalAmount: number;
  paidAmount: number;
  paymentMode: 'Full' | 'Advance';
  couponApplied?: string;
  discountAmount: number;
  addons: string[];
  reference: string;
}

// ===== APP STATE TYPES =====

export interface WishlistItem {
  id: string;
  type: 'Package' | 'Hotel' | 'Car' | 'Attraction';
  addedAt: string;
}

export interface SearchFilters {
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  duration?: string;
  category?: string;
  hotelCategory?: number;
  meals?: string;
  sortBy?: string;
}

export interface CarSearchParams {
  pickup: string;
  drop: string;
  date: string;
  time: string;
  returnDate?: string;
  returnTime?: string;
  category?: string;
}
