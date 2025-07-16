import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const categories = [
    { name: 'Rings', path: '/category/rings' },
    { name: 'Earrings', path: '/category/earrings' },
    { name: 'Bracelets & Bangles', path: '/category/bracelets' },
    { name: 'Necklaces & Pendants', path: '/category/necklaces' },
    { name: 'Mangalsutras', path: '/category/mangalsutras' },
    { name: 'Solitaires', path: '/category/solitaires' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <span>Store: Inorbit Mall</span>
          <span>Delivering to 500081</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CL</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Jewellery - Inventory</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for Gold Jewellery, Diamond Jewellery and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full">
              <Heart className="h-6 w-6 text-gray-600" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full">
                  <User className="h-6 w-6 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.firstname}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  {user?.role === 'Admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="py-3 px-2 hover:bg-purple-800 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Services</span>
              <span className="text-sm">Gold</span>
              <span className="text-sm">Stores</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="block py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;