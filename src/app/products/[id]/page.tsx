'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, Product } from '@/lib/firebase';
import { Star, ShoppingCart, Truck, Shield, RotateCcw, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import AuthModal from '@/components/auth/AuthModal';
import CustomPopup, { useCustomPopup } from '@/components/CustomPopup';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { isLoggedIn } = useAuth();
  const { getTotalItems, addToCart } = useCart();
  const { popupState, showWarning, showSuccess, hidePopup } = useCustomPopup();

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    // Require size selection if sizes are available
    if (sizes.length > 0 && !selectedSize) {
      showWarning('Please select a size before adding to cart.');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: parseInt(product.price),
      image: product.image,
      category: product.collectionId || 'Uncategorized',
      size: selectedSize || 'Default'
    });

    // Show success message
    showSuccess(`Added ${quantity} ${product.name} (${selectedSize || 'Default'}) to cart!`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      console.log('Fetching product with ID:', params.id);

      try {
        const foundProduct = await getProductById(params.id as string);
        console.log('Found product:', foundProduct);

        if (foundProduct) {
          // Add discount information
          const discountPercent = Math.floor(Math.random() * 6) + 5; // 5-10%
          const originalPrice = Math.round(parseInt(foundProduct.price) / (1 - discountPercent / 100));

          setProduct({
            ...foundProduct,
            discountPercent,
            originalPrice
          });
        } else {
          console.log('Product not found, trying alternative approach');
          // Try to get from top products as fallback
          const { getTopProducts } = await import('@/lib/firebase');
          const topProducts = await getTopProducts();
          const fallbackProduct = topProducts.find(p => p.id === params.id);

          if (fallbackProduct) {
            console.log('Found product in fallback:', fallbackProduct);
            const discountPercent = Math.floor(Math.random() * 6) + 5;
            const originalPrice = Math.round(parseInt(fallbackProduct.price) / (1 - discountPercent / 100));

            setProduct({
              ...fallbackProduct,
              discountPercent,
              originalPrice
            });
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-dark"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/products"
            className="bg-primary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-brown transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Smart Ethnic Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-48 h-16 relative">
                <Image
                  src="/logo.png"
                  alt="Smart Ethnic Logo"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Fallback if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </Link>

            {/* Account and Cart Icons */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {/* User Profile Icon */}
                  <Link
                    href="/account"
                    className="text-primary-dark hover:text-accent-brown transition-colors cursor-pointer"
                    title="Go to Account"
                  >
                    <User className="h-6 w-6" />
                  </Link>
                </>
              ) : (
                /* Account Icon - Opens Auth Modal */
                <button
                  onClick={openAuthModal}
                  className="flex items-center space-x-2 text-primary-dark hover:text-accent-brown transition-colors p-2 rounded-lg hover:bg-primary-dark/10 cursor-pointer"
                  aria-label="Open authentication"
                  title="Login / Sign Up"
                >
                  <User className="h-6 w-6 text-primary-dark" />
                </button>
              )}

              {/* Cart Icon - Only visible when logged in */}
              {isLoggedIn && (
                <Link href="/cart" className="text-primary-dark hover:text-accent-brown transition-colors relative">
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-brown text-primary-dark rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative lg:col-span-5">
            <div className="relative h-[620px] md:h-[780px] lg:h-[850px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/600/600';
                }}
              />
            </div>

            {/* Discount Badge */}
            {product.discountPercent && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg font-bold text-sm">
                {product.discountPercent}% OFF
              </div>
            )}

          </div>

          {/* Product Details */}
          <div className="space-y-6 lg:col-span-7">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary-dark">
                  ₹{parseInt(product.price).toLocaleString()}
                </span>
                {product.originalPrice && product.discountPercent && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {product.discountPercent && (
                <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Save ₹{(product.originalPrice! - parseInt(product.price)).toLocaleString()} ({product.discountPercent}% off)
                </div>
              )}
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-primary-dark mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary-dark bg-primary-dark text-white'
                          : 'border-gray-300 hover:border-primary-dark'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold text-primary-dark mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-dark transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-dark transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-dark text-white py-4 px-6 rounded-lg font-semibold hover:bg-accent-brown transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <ShoppingCart className="h-6 w-6" />
              Add to Cart - ₹{(parseInt(product.price) * quantity).toLocaleString()}
            </button>

            {/* Product Info */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary-dark">Free Delivery</h4>
                  <p className="text-sm text-gray-600">Free delivery on orders above ₹999</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary-dark">Easy Returns</h4>
                  <p className="text-sm text-gray-600">10 day return policy</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary-dark">Secure Payment</h4>
                  <p className="text-sm text-gray-600">100% secure payment</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-primary-dark mb-4">Product Details</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Product ID:</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{product.collectionId}</span>
                </div>
                {product.material && (
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                )}
                {sizes.length > 0 && (
                  <div className="flex justify-between">
                    <span>Available Sizes:</span>
                    <span className="font-medium">{product.sizes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Auth Modal */}
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
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
