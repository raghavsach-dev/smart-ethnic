'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import AddressConfirmationModal from '@/components/AddressConfirmationModal';
import OrderConfirmationModal from '@/components/OrderConfirmationModal';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import CustomPopup, { useCustomPopup } from '@/components/CustomPopup';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  const { popupState, showError, hidePopup } = useCustomPopup();

  // Generate order ID: {userName(First 4 chars)}{random 5 digits}
  const generateOrderId = (userName: string): string => {
    const namePrefix = userName.substring(0, 4).toUpperCase();
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `${namePrefix}${randomDigits}`;
  };

  // Create order document in Firebase
  const createOrder = async (addressData: { address: string; phone: string; pinCode: string }) => {
    if (!user?.email || cartItems.length === 0) {
      console.log('Cannot create order: user email or cart items missing', { userEmail: user?.email, cartItemsCount: cartItems.length });
      return null;
    }

    const orderId = generateOrderId(user.firstName);
    console.log('Generated order ID:', orderId);

    const orderData = {
      orderId,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: addressData.phone,
        address: addressData.address,
        pinCode: addressData.pinCode
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        size: item.size,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      pricing: {
        subtotal,
        shipping,
        total
      },
      status: 'Placed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Order data to save:', orderData);

    try {
      // Save to both paths: users/{userEmail}/orders/{orderId} and orders/{orderId}
      const userOrderRef = doc(db, 'users', user.email, 'orders', orderId);
      const globalOrderRef = doc(db, 'orders', orderId);

      await Promise.all([
        setDoc(userOrderRef, orderData),
        setDoc(globalOrderRef, orderData)
      ]);

      console.log('Order saved successfully to both user and global collections with ID:', orderId);
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  // Show login modal if not logged in (after auth loading is complete)
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      setIsAuthModalOpen(true);
    }
  }, [isLoggedIn, authLoading]);

  // Debug: Log when modal state changes
  useEffect(() => {
    console.log('Modal state changed:', { isOrderConfirmationOpen, completedOrderId });
  }, [isOrderConfirmationOpen, completedOrderId]);

  const handleQuantityChange = (id: string, size: string, newQuantity: number) => {
    updateQuantity(id, size, newQuantity);
  };

  const handleRemoveItem = (id: string, size: string) => {
    removeFromCart(id, size);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      // Show login modal if not logged in
      setIsAuthModalOpen(true);
      return;
    }

    // Show address confirmation modal
    setIsAddressModalOpen(true);
  };

  const handleAddressConfirm = async (addressData: { address: string; phone: string; pinCode: string }) => {
    setIsAddressModalOpen(false);
    setCheckoutLoading(true);

    try {
      console.log('Creating order with address data:', addressData);
      // Create order in Firebase
      const orderId = await createOrder(addressData);
      console.log('Order created with ID:', orderId);

      if (orderId) {
      // Clear cart after successful order
        await clearCart();
        console.log('Cart cleared, showing order confirmation modal');

        // Show order confirmation modal
        console.log('About to set completedOrderId to:', orderId);
        setCompletedOrderId(orderId);
        console.log('About to set isOrderConfirmationOpen to true');
        setIsOrderConfirmationOpen(true);
        console.log('Order confirmation modal should be open now, state should be:', { isOrderConfirmationOpen: true, completedOrderId: orderId });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      showError('Failed to place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleOrderConfirmationClose = () => {
    setIsOrderConfirmationOpen(false);
    router.push('/');
  };

  const handleViewOrders = () => {
    setIsOrderConfirmationOpen(false);
    router.push('/orders');
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

    return (
    <div className="min-h-screen bg-white flex flex-col">
        <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {cartItems.length === 0 ? (
          // Empty cart state
          <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-8">
              <ShoppingBag className="h-24 w-24 text-accent-brown mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-primary-dark mb-4">Your Cart is Empty</h1>
              <p className="text-accent-brown text-lg max-w-md mx-auto">
                Looks like you haven&apos;t added any items to your cart yet.
                Start shopping to fill it up!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-primary-dark text-cream px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-brown transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Continue Shopping
              </Link>
              <Link
                href="/categories"
                className="border-2 border-primary-dark text-primary-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark hover:text-cream transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Browse Categories
              </Link>
            </div>
          </div>
      </div>
        ) : (
          // Cart with items
          <>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="flex items-center gap-2 text-primary-dark hover:text-secondary-brown transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-primary-dark">Shopping Cart</h1>
          </div>
          <span className="text-accent-brown">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size || 'default'}`} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="ml-6 flex-grow">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="text-lg font-semibold text-primary-dark hover:text-secondary-brown transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-accent-brown text-sm capitalize">{item.category}</p>
                    <p className="text-primary-dark text-sm">Size: {item.size || 'Default'}</p>
                    <p className="text-primary-dark font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.size || 'Default', item.quantity - 1)}
                      className="p-1 rounded-md border border-gray-300 hover:border-primary-dark hover:text-primary-dark transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-8 text-center font-medium">{item.quantity}</span>

                    <button
                      onClick={() => handleQuantityChange(item.id, item.size || 'Default', item.quantity + 1)}
                      className="p-1 rounded-md border border-gray-300 hover:border-primary-dark hover:text-primary-dark transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="ml-6 text-right">
                    <p className="text-lg font-semibold text-primary-dark">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.size || 'Default')}
                      className="text-red-500 hover:text-red-700 transition-colors mt-1"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mt-4 text-right">
              <button
                onClick={() => clearCart()}
                className="text-red-500 hover:text-red-700 transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-primary-dark mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-accent-brown">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-accent-brown">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>

                {subtotal < 999 && (
                  <p className="text-xs text-accent-brown">
                    Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full mt-8 bg-primary-dark text-cream py-4 px-6 rounded-lg font-semibold text-lg hover:bg-accent-brown transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkoutLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : isLoggedIn ? (
                  'Place Order'
                ) : (
                  'Login to Checkout'
                )}
              </button>

              {!isLoggedIn && (
                <p className="text-center text-sm text-accent-brown mt-4">
                  Please log in to complete your purchase
                </p>
              )}

              {/* Security Note */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1L3 4v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V4l-7-3zm3.5 7.5l-4 4-2-2 1.5-1.5 0.5 0.5 2.5-2.5 1.5 1.5z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Secure Checkout</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Address Confirmation Modal */}
      <AddressConfirmationModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={handleAddressConfirm}
        loading={checkoutLoading}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isOrderConfirmationOpen}
        orderId={completedOrderId}
        onClose={handleOrderConfirmationClose}
        onViewOrders={handleViewOrders}
      />

      {/* Custom Popup */}
      <CustomPopup
        isOpen={popupState.isOpen}
        type={popupState.type}
        message={popupState.message}
        onClose={hidePopup}
      />
    </div>
  );
}
