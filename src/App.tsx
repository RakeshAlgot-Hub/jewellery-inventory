import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, user, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app load
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Admin Route */}
            {isAuthenticated && user?.role === 'Admin' && (
              <Route path="/admin" element={<AdminPage />} />
            )}
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;