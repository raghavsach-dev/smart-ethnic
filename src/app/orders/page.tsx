'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, ArrowLeft } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
  quantity: number;
  total: number;
}

interface Order {
  orderId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    pinCode: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  status: string;
  createdAt: any;
  updatedAt: any;
}

export default function Orders() {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/');
      return;
    }

    if (isLoggedIn && user?.email) {
      fetchOrders();
    }
  }, [isLoggedIn, user, loading, router]);

  const fetchOrders = async () => {
    if (!user?.email) return;

    try {
      setLoadingOrders(true);
      const ordersRef = collection(db, 'users', user.email, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({
          ...doc.data(),
          orderId: doc.id
        } as Order);
      });

      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isWithin10Days = (timestamp: any) => {
    if (!timestamp) return false;
    const orderDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 10;
  };

  const handleReturnRequest = (orderId: string) => {
    // Navigate to contact page with pre-selected subject and order
    const params = new URLSearchParams({
      subject: 'Returns & Exchanges',
      order: orderId
    });
    router.push(`/contact?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-dark"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-6 py-8 flex-grow">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary-dark hover:text-secondary-brown transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary-dark">My Orders</h1>
        </div>

        {loadingOrders ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-dark"></div>
          </div>
        ) : orders.length === 0 ? (
          // Empty orders state
          <div className="max-w-md mx-auto text-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-dark/10 to-secondary-brown/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-primary-dark" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your order history will appear here once you make your first purchase.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary-brown transition-colors duration-200 shadow-sm"
            >
              <Package className="h-4 w-4" />
              Start Shopping
            </Link>
          </div>
        ) : selectedOrder ? (
          // Order Details View
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-2 text-primary-dark hover:text-secondary-brown transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </button>

              {/* Order Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.orderId}</h2>
                  <div className="flex items-center gap-3">
                    {isWithin10Days(selectedOrder.createdAt) && (
                      <button
                        onClick={() => handleReturnRequest(selectedOrder.orderId)}
                        className="px-4 py-2 bg-orange-100 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        Return Request
                      </button>
                    )}
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Order Date:</span> {formatDate(selectedOrder.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span> ₹{selectedOrder.pricing.total.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">{selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{selectedOrder.user.address}</p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{selectedOrder.user.pinCode}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{selectedOrder.user.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(`/products/${item.id}`)}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium text-gray-900 truncate hover:text-primary-dark transition-colors">{item.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span>Size: {item.size}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900">₹{item.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal ({selectedOrder.items.length} items)</span>
                  <span className="font-medium">₹{selectedOrder.pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{selectedOrder.pricing.shipping === 0 ? 'Free' : `₹${selectedOrder.pricing.shipping}`}</span>
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{selectedOrder.pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Orders List View
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-dark/10 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary-dark" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                      <span className="text-sm text-gray-600">
                        ₹{order.pricing.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {isWithin10Days(order.createdAt) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReturnRequest(order.orderId);
                          }}
                          className="px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-md hover:bg-orange-200 transition-colors"
                        >
                          Return
                        </button>
                      )}
                      <div className="text-sm text-primary-dark font-medium hover:text-secondary-brown transition-colors">
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
