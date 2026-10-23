import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ItineraryProvider } from './context/ItineraryContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { LoadingPage } from './components/common/LoadingStates';

// Tourist Pages
import DiscoverPage from './pages/tourist/DiscoverPage';
import AttractionDetailPage from './pages/tourist/AttractionDetailPage';
import ItineraryPage from './pages/tourist/ItineraryPage';
import MapPage from './pages/tourist/MapPage';
import AboutPage from './pages/tourist/AboutPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';

/**
 * Protected Route Wrapper for Admin Dashboard
 */
const ProtectedAdminRoute = ({ children }) => {
  const { admin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage message="Verifying admin credentials..." />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

/**
 * Layout wrapper for tourist-facing public pages
 */
const TouristLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-forest-200 selection:text-forest-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ItineraryProvider>
        <Router>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1c3d22',
                color: '#fdfbf7',
                borderRadius: '0.75rem',
                border: '1px solid #38663e',
                fontSize: '0.875rem',
                boxShadow: '0 10px 25px -5px rgba(19, 44, 24, 0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#8aa687',
                  secondary: '#132c18',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />

          <Routes>
            {/* Tourist Facing Routes */}
            <Route
              path="/"
              element={
                <TouristLayout>
                  <DiscoverPage />
                </TouristLayout>
              }
            />
            <Route
              path="/attraction/:id"
              element={
                <TouristLayout>
                  <AttractionDetailPage />
                </TouristLayout>
              }
            />
            <Route
              path="/itinerary"
              element={
                <TouristLayout>
                  <ItineraryPage />
                </TouristLayout>
              }
            />
            <Route
              path="/map"
              element={
                <TouristLayout>
                  <MapPage />
                </TouristLayout>
              }
            />
            <Route
              path="/about"
              element={
                <TouristLayout>
                  <AboutPage />
                </TouristLayout>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* 404 Catch All */}
            <Route
              path="*"
              element={
                <TouristLayout>
                  <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                      <div className="text-6xl mb-4">🧭</div>
                      <h2 className="text-2xl font-bold text-stone-900 mb-2">Page Not Found</h2>
                      <p className="text-stone-500 mb-6 text-sm">
                        The destination you are looking for does not exist or has been moved.
                      </p>
                      <a href="/" className="btn-primary inline-flex items-center gap-2">
                        Return to Discovery
                      </a>
                    </div>
                  </div>
                </TouristLayout>
              }
            />
          </Routes>
        </Router>
      </ItineraryProvider>
    </AuthProvider>
  );
}

export default App;
