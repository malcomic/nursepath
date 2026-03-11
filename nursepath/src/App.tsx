import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './api';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import GuideDetailPage from './pages/GuideDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/OrderSuccessPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardHomePage from './pages/admin/AdminDashboardHomePage';
import AdminGuidesPage from './pages/admin/AdminGuidesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import StudentReviewsPage from './pages/StudentReviewsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';

// Styles
import './App.css';

/**
 * Main Application Component
 * 
 * Handles:
 * - Authentication token initialization
 * - Route configuration with BrowserRouter
 * - Protected route logic for admin pages
 * - Loading states during initialization
 */
function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize application
   * - Load auth token from localStorage on app start
   * - Set up any initial state
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        // Load auth token from localStorage
        api.loadAuthToken();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        // Always set loading to false and initialized to true, even on error
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    // Initialize immediately (synchronous operation)
    initializeApp();
  }, []);

  // Show loading state during initialization
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ScholarWriters...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/guides/:id" element={<GuideDetailPage />} />
        <Route path="/purchase/:id" element={<CheckoutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/reviews" element={<StudentReviewsPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            api.getAuthToken() ? (
              <AdminDashboardHomePage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route
          path="/admin/guides"
          element={
            api.getAuthToken() ? (
              <AdminGuidesPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route
          path="/admin/categories"
          element={
            api.getAuthToken() ? (
              <AdminCategoriesPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route
          path="/admin/orders"
          element={
            api.getAuthToken() ? (
              <AdminOrdersPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route
          path="/admin/settings"
          element={
            api.getAuthToken() ? (
              <AdminSettingsPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route
          path="/admin/reviews"
          element={
            api.getAuthToken() ? (
              <AdminReviewsPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Legacy Routes - Redirect to new routes */}
        <Route path="/catalog" element={<Navigate to="/services" replace />} />
        <Route path="/order-success" element={<Navigate to="/payment-success" replace />} />

        {/* Catch-all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
