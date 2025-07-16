import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { Product, Review } from '../types';
import { apiService } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>({});

  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (slug) {
      loadProduct();
      loadReviews();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      const productData = await apiService.getProductBySlug(slug!);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const reviewsData = await apiService.getProductReviews(slug!);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-purple-600">Products</Link>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={product.images[currentImageIndex] || 'https://images.pexels.com/photos/1191537/pexels-photo-1191537.jpeg'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              
              {/* Navigation buttons */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Tags */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full uppercase font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Thumbnail images */}
            {product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-purple-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviews || 0} reviews)
                  </span>
                </div>
                <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.featured && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{Math.round(product.price * 1.2).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                (Price inclusive of all taxes)
              </p>
            </div>

            {/* Variants */}
            {Object.keys(product.variants).length > 0 && (
              <div className="space-y-4">
                {Object.entries(product.variants).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key}
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedVariant({ ...selectedVariant, [key]: value })}
                        className={`px-4 py-2 border rounded-md ${
                          selectedVariant[key] === value
                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {value}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleToggleWishlist}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-sm font-medium">15 Day Exchange</div>
                  <div className="text-xs text-gray-500">On Online Orders</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-sm font-medium">1 Year Warranty</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-sm font-medium">Free Shipping</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Customer Reviews</h3>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-gray-800">Anonymous User</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;