import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Implement Razorpay checkout logic
    console.log('Initiating checkout...');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful jewelry to your cart to get started!</p>
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Shopping Cart ({items.length})
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <span className="text-green-700 text-sm">
                    See it Before You Buy It - Experience our designs in detail via video call
                  </span>
                  <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                    SEE IT LIVE
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                    <img
                      src={item.product.images[0] || 'https://images.pexels.com/photos/1191537/pexels-photo-1191537.jpeg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{Math.round(item.product.price * 1.2).toLocaleString()}
                        </span>
                        <span className="text-sm text-green-600">
                          Save ₹{Math.round(item.product.price * 0.2).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-2">
                        Delivery by - 26th Jul
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">You Saved</span>
                  <span className="text-green-600">-₹{Math.round(getTotalPrice() * 0.2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon Discount</span>
                  <button className="text-purple-600 hover:text-purple-700 text-sm">
                    Apply Coupon
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping (Standard)</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total Cost</span>
                    <span className="text-lg font-bold">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span>📍 Delivering to 500081</span>
                  <button className="ml-auto text-purple-600 hover:text-purple-700">
                    Change Pincode
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                PLACE ORDER
              </button>

              <div className="mt-6 grid grid-cols-4 gap-4 text-center text-xs text-gray-600">
                <div>
                  <div className="mb-1">🔄</div>
                  <div>15 Day Exchange</div>
                  <div>On Online Orders</div>
                </div>
                <div>
                  <div className="mb-1">🛡️</div>
                  <div>1 Year Warranty</div>
                </div>
                <div>
                  <div className="mb-1">✅</div>
                  <div>100% Certified</div>
                </div>
                <div>
                  <div className="mb-1">♾️</div>
                  <div>Lifetime Exchange</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;