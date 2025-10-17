'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Contact() {
  const { user, isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedOrder: '',
    subject: '',
    message: ''
  });
  const [userOrders, setUserOrders] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState('');

  // Handle URL parameters for pre-selected subject and order
  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    const orderParam = searchParams.get('order');

    if (subjectParam || orderParam) {
      setFormData(prev => ({
        ...prev,
        subject: subjectParam || prev.subject,
        selectedOrder: orderParam || prev.selectedOrder
      }));
    }
  }, [searchParams]);

  // Auto-fill form data when user is logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    } else {
      // Clear form data when user logs out
      setFormData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      }));
    }
  }, [isLoggedIn, user]);

  // Fetch user orders when logged in
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (isLoggedIn && user?.email) {
        try {
          const ordersRef = collection(db, 'users', user.email, 'orders');
          const ordersSnap = await getDocs(ordersRef);
          const orderIds = ordersSnap.docs.map(doc => doc.data().orderId);
          setUserOrders(orderIds);
        } catch (error) {
          console.error('Error fetching user orders:', error);
          setUserOrders([]);
        }
      } else {
        setUserOrders([]);
      }
    };

    fetchUserOrders();
  }, [isLoggedIn, user?.email]);

  // Countdown timer for redirect
  useEffect(() => {
    if (showSuccessDialog && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccessDialog && countdown === 0) {
      // Redirect to home page
      window.location.href = '/';
    }
  }, [showSuccessDialog, countdown]);

  const generateEnquiryId = (): string => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    if (isLoggedIn && user?.firstName) {
      const userPrefix = user.firstName.substring(0, 4).toUpperCase();
      return `${userPrefix}QUE${randomDigits}`;
    } else {
      return `SMESQUE${randomDigits}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const enquiryId = generateEnquiryId();

      const enquiryData = {
        enquiryId,
        ...formData,
        userId: user?.id || null,
        isLoggedIn,
        createdAt: new Date(),
        status: 'Pending'
      };

      // Save to Firebase
      const enquiryRef = doc(db, 'queries', enquiryId);
      await setDoc(enquiryRef, enquiryData);

      // Reset form
      setFormData({
        firstName: isLoggedIn && user ? user.firstName || '' : '',
        lastName: isLoggedIn && user ? user.lastName || '' : '',
        email: isLoggedIn && user ? user.email || '' : '',
        phone: isLoggedIn && user ? user.phone || '' : '',
        selectedOrder: '',
        subject: '',
        message: ''
      });

      // Show success dialog with countdown
      setSubmittedEnquiryId(enquiryId);
      setShowSuccessDialog(true);
      setCountdown(5);

    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-dark mb-4">Contact Us</h1>
          <p className="text-lg text-primary-dark/80 max-w-2xl mx-auto">
            Get in touch with us for any questions about our premium ethnic wear collection.
            We&apos;re here to help you find the perfect traditional outfit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-primary-dark mb-6">Get In Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-dark p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-cream" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-dark mb-1">Email Us</h3>
                    <a
                      href="mailto:smartethnic97@gmail.com"
                      className="text-primary-dark/80 hover:text-accent-brown transition-colors"
                    >
                      smartethnic97@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-dark p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-cream" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-dark mb-1">Call Us</h3>
                    <a
                      href="tel:9825965551"
                      className="text-primary-dark/80 hover:text-accent-brown transition-colors"
                    >
                      +91 9825965551
                    </a>
                    <p className="text-sm text-primary-dark/70 mt-1">Mon - Sat: 10 AM - 8 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-dark p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-cream" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-dark mb-1">Visit Us</h3>
                    <p className="text-primary-dark/80">
                      India
                    </p>
                    <p className="text-sm text-primary-dark/70 mt-1">
                      Serving customers across Delhi NCR and pan-India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-dark p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-cream" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-dark mb-1">Business Hours</h3>
                    <div className="text-primary-dark/80 space-y-1">
                      <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                      <p>Sunday: 11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-primary-dark mb-4">Why Choose Smart Ethnic?</h3>
              <ul className="space-y-3 text-primary-dark/80">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-dark font-semibold">✓</span>
                  <span>Premium quality fabrics and craftsmanship</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-dark font-semibold">✓</span>
                  <span>Authentic traditional designs with modern comfort</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-dark font-semibold">✓</span>
                  <span>Fast and reliable shipping across India</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-dark font-semibold">✓</span>
                  <span>Easy returns and exchange policy</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-dark font-semibold">✓</span>
                  <span>Personalized styling consultation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-primary-dark mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-primary-dark mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={isLoggedIn}
                    required
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors ${
                      isLoggedIn
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'focus:ring-2 focus:ring-secondary-brown focus:border-transparent'
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-primary-dark mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={isLoggedIn}
                    required
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors ${
                      isLoggedIn
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'focus:ring-2 focus:ring-secondary-brown focus:border-transparent'
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-dark mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoggedIn}
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors ${
                    isLoggedIn
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'focus:ring-2 focus:ring-secondary-brown focus:border-transparent'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-primary-dark mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={isLoggedIn}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors ${
                    isLoggedIn
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'focus:ring-2 focus:ring-secondary-brown focus:border-transparent'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-primary-dark mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-brown focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Information</option>
                  <option value="size">Size & Fit Questions</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="custom">Custom Orders</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Order Dropdown - Only show for logged-in users with orders */}
              {isLoggedIn && userOrders.length > 0 && (
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-primary-dark mb-2">
                    Order
                  </label>
                  <select
                    id="order"
                    name="order"
                    value={formData.selectedOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, selectedOrder: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-brown focus:border-transparent outline-none transition-colors"
                  >
                    <option value="">Select an order (optional)</option>
                    {userOrders.map((orderId) => (
                      <option key={orderId} value={orderId}>
                        Order #{orderId}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary-dark mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-brown focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-dark text-cream py-4 px-6 rounded-lg font-semibold text-lg hover:bg-accent-brown transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
            <p className="text-gray-600 mb-4">
              You will be contacted by our team shortly.
            </p>

            {/* Enquiry ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Your Enquiry ID:</p>
              <p className="text-lg font-mono font-semibold text-primary-dark">{submittedEnquiryId}</p>
            </div>

            {/* Countdown */}
            <div className="text-gray-500">
              <p className="text-sm">Redirecting to home page in</p>
              <p className="text-2xl font-bold text-primary-dark mt-1">{countdown} seconds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
