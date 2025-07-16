import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCategoryStore } from '../../store/categoryStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { categories, loadCategories, setSelectedCategory } = useCategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories().catch(console.error);
  }, [loadCategories]);

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

  const handleCategoryClick = (categoryName: string) => {
    try {
      setSelectedCategory(categoryName);
      navigate(`/category/${categoryName.toLowerCase().replace(/ /g, '-')}`);
    } catch (error) {
      console.error('Error navigating to category:', error);
    }
  };

  const safeCategories = categories || [];
  const cartCount = getItemCount() || 0;
  const wishlistCount = wishlistItems?.length || 0;
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
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full">
                  <User className="h-6 w-6 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.firstname || 'User'}</span>
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
          <div className="flex items-center justify-between relative">
            <div className="hidden md:flex space-x-6">
              {safeCategories.slice(0, 5).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="py-3 px-2 hover:bg-purple-800 transition-colors text-sm"
                >
                  {category.name}
                </button>
              ))}
              {safeCategories.length > 5 && (
                <div 
                  className="relative"
                  onMouseEnter={() => setShowMoreDropdown(true)}
                  onMouseLeave={() => setShowMoreDropdown(false)}
                >
                  <button className="py-3 px-2 hover:bg-purple-800 transition-colors text-sm flex items-center">
                    More Jewellery
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  {showMoreDropdown && (
                    <div className="absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-md py-2 min-w-48 z-50">
                      {safeCategories.slice(5).map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.name)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
            {safeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  handleCategoryClick(category.name);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-gray-700 hover:text-purple-600"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;