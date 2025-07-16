import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'bestseller':
        return 'bg-yellow-500';
      case 'trending':
        return 'bg-red-500';
      case 'new in':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Link to={`/product/${product.slug || product.id}`}>
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/1191537/pexels-photo-1191537.jpeg'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Tags */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.tags.map((tag, index) => (
            <span
              key={index}
              className={`${getTagColor(tag)} text-white text-xs px-2 py-1 rounded-full uppercase font-medium`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart 
            className={`h-4 w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
          />
        </button>

        {/* Quick actions */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-purple-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mt-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviews || 0} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.featured && (
              <span className="text-sm text-gray-500 line-through">
                ₹{Math.round(product.price * 1.2).toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {product.inStock ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          <span>Check delivery date</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;