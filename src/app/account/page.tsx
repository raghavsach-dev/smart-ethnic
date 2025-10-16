'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Hash, Edit, LogOut, ShoppingCart, Package } from 'lucide-react';

export default function Account() {
  const { user, logout, isLoggedIn, updateProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    firstName: '',
    lastName: ''
  });
  const [contactForm, setContactForm] = useState({
    phone: '',
    pinCode: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      return;
    }
    setLoading(false);
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (user) {
      setPersonalForm({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
      setContactForm({
        phone: user.phone || '',
        pinCode: user.pinCode || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleEditPersonal = () => {
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      await updateProfile({
        firstName: personalForm.firstName,
        lastName: personalForm.lastName
      });
      setIsEditingPersonal(false);
    } catch (error) {
      console.error('Error updating personal info:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPersonalEdit = () => {
    setPersonalForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
    setIsEditingPersonal(false);
  };

  const handleEditContact = () => {
    setIsEditingContact(true);
  };

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      await updateProfile({
        phone: contactForm.phone,
        pinCode: contactForm.pinCode,
        address: contactForm.address
      });
      setIsEditingContact(false);
    } catch (error) {
      console.error('Error updating contact info:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelContactEdit = () => {
    setContactForm({
      phone: user?.phone || '',
      pinCode: user?.pinCode || '',
      address: user?.address || ''
    });
    setIsEditingContact(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-dark"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to access your account.</p>
          <Link
            href="/"
            className="bg-primary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-brown transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
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
            </div>

            <div className="text-sm text-gray-600">
              My Account
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 min-h-[120px] flex items-center">
            <div className="flex items-center gap-6 w-full">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-dark to-accent-brown rounded-full flex items-center justify-center shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-primary-dark mb-2">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-gray-600 mb-4">
                  Manage your account and preferences
                </p>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 bg-primary-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-brown transition-colors"
                  >
                    <Package className="h-5 w-5" />
                    Orders
                  </Link>

                  <Link
                    href="/cart"
                    className="flex items-center gap-2 bg-secondary-brown text-primary-dark px-4 py-2 rounded-lg font-medium hover:bg-accent-brown hover:text-white transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary-dark flex items-center gap-3">
                    <User className="h-6 w-6" />
                    Personal Information
                  </h2>
                  {!isEditingPersonal ? (
                    <button
                      onClick={handleEditPersonal}
                      className="flex items-center gap-2 text-primary-dark hover:text-secondary-brown transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelPersonalEdit}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePersonal}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg font-medium hover:bg-primary-dark/80 transition-colors"
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    {isEditingPersonal ? (
                      <input
                        type="text"
                        value={personalForm.firstName}
                        onChange={(e) => setPersonalForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                        {user?.firstName}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    {isEditingPersonal ? (
                      <input
                        type="text"
                        value={personalForm.lastName}
                        onChange={(e) => setPersonalForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                        {user?.lastName || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary-dark flex items-center gap-3">
                    <Phone className="h-6 w-6" />
                    Contact Information
                  </h2>
                  {!isEditingContact ? (
                    <button
                      onClick={handleEditContact}
                      className="flex items-center gap-2 text-primary-dark hover:text-secondary-brown transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelContactEdit}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveContact}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg font-medium hover:bg-primary-dark/80 transition-colors"
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </label>
                    {isEditingContact ? (
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                        {user?.phone || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Pin Code
                    </label>
                    {isEditingContact ? (
                      <input
                        type="text"
                        value={contactForm.pinCode}
                        onChange={(e) => setContactForm(prev => ({ ...prev, pinCode: e.target.value }))}
                        className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                        placeholder="Enter pin code"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                        {user?.pinCode || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </label>
                    {isEditingContact ? (
                      <textarea
                        value={contactForm.address}
                        onChange={(e) => setContactForm(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                        {user?.address || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* Account Status */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary-dark mb-6">Account Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-dark mb-1">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                    </div>
                    <div className="text-gray-600">Member since</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">Verified</div>
                    <div className="text-gray-600">Account type</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">✓</div>
                    <div className="text-gray-600">Email verified</div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
