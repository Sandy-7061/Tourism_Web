import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Destinations from './pages/Destinations';
import Hotels from './pages/Hotels';
import CarRental from './pages/CarRental';
import CityTours from './pages/CityTours';
import Offers from './pages/Offers';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Dashboard from './pages/Dashboard';
import TripBuilder from './pages/TripBuilder';
import BookingFlow from './pages/BookingFlow';
import BookingConfirmation from './pages/BookingConfirmation';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Home — has transparent header */}
          <Route path="/" element={<Layout><Home /></Layout>} />

          {/* Listings */}
          <Route path="/packages" element={<Layout><Packages /></Layout>} />
          <Route path="/packages/:slug" element={<Layout><PackageDetail /></Layout>} />
          <Route path="/destinations" element={<Layout><Destinations /></Layout>} />
          <Route path="/destinations/:slug" element={<Layout><Destinations /></Layout>} />
          <Route path="/hotels" element={<Layout><Hotels /></Layout>} />
          <Route path="/hotels/:slug" element={<Layout><Hotels /></Layout>} />
          <Route path="/car-rental" element={<Layout><CarRental /></Layout>} />
          <Route path="/city-tours" element={<Layout><CityTours /></Layout>} />
          <Route path="/city-tours/:slug" element={<Layout><CityTours /></Layout>} />
          <Route path="/offers" element={<Layout><Offers /></Layout>} />

          {/* Blog */}
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />

          {/* Booking flow */}
          <Route path="/book/details" element={<Layout><BookingFlow /></Layout>} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />

          {/* User */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/trip-builder" element={<Layout><TripBuilder /></Layout>} />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-6">✈️</div>
                  <h1 className="text-4xl font-display font-bold text-navy-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go to Home</a>
                </div>
              </div>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
