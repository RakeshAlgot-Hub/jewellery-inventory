import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, ArrowRight } from 'lucide-react';
import { Product, Category } from '../types';
import { apiService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);
      
      setFeaturedProducts(productsRes.filter(p => p.featured).slice(0, 8));
      setCategories(categoriesRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Discover Beautiful Jewelry
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Explore our exquisite collection of diamonds, gold, and precious stones crafted to perfection.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  to="/categories"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1191537/pexels-photo-1191537.jpeg"
                alt="Jewelry Collection"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold">
                <span className="text-sm">Up to 50% OFF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of jewelry categories, from elegant rings to stunning necklaces.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                  <img
                    src={`https://images.pexels.com/photos/${category.id === '1' ? '1191537' : category.id === '2' ? '1447333' : '1191537'}/pexels-photo-${category.id === '1' ? '1191537' : category.id === '2' ? '1447333' : '1191537'}.jpeg`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                    <span className="font-medium">Explore</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
              <p className="text-gray-600">Handpicked jewelry pieces just for you</p>
            </div>
            <Link
              to="/products"
              className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">15 Day Exchange</h3>
              <p className="text-gray-600 text-sm">On Online Orders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1 Year Warranty</h3>
              <p className="text-gray-600 text-sm">On All Products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">100% Certified</h3>
              <p className="text-gray-600 text-sm">Authentic Jewelry</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Lifetime Exchange</h3>
              <p className="text-gray-600 text-sm">Premium Service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;