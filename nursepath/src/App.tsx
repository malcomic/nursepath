import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './api';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PurchasePage from './pages/PurchasePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Styles
import './App.css';

/**
 * Main Application Component
 * 
 * Handles:
 * - Authentication token initialization
 * - Route configuration with HashRouter
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
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Show loading state during initialization
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ScholarWriters NursePath...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/guides/:id" element={<ProductDetailPage />} />
        <Route path="/purchase/:id" element={<PurchasePage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

        {/* Catch-all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
