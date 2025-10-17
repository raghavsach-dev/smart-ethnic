'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, ArrowRight, Check, User, Phone, MapPin, Lock, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { generateOTP, storeOTP } from '@/lib/airtable';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'email' | 'otp' | 'signup' | 'success';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AuthStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState<string>('');

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    pinCode: ''
  });

  const { verifyOTP: verifyAuth, completeSignup } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('email');
      setError('');
      setShowOtp(false);
      setGeneratedOTP('');
      // Reset form data
      setFormData({
        email: '',
        otp: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        pinCode: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      // Generate random 6-digit OTP
      const otp = generateOTP();

      // Store OTP in component state for validation
      setGeneratedOTP(otp);

      // Also store in Airtable for logging/tracking (don't await to avoid blocking UI)
      storeOTP(formData.email, otp).catch(error => {
        console.error('Failed to store OTP in Airtable:', error);
        // Don't show error to user - OTP still works locally
      });

      setShowOtp(true);
      setError('OTP sent! Please check your email for the verification code.');

    } catch (error: unknown) {
      console.error('Send OTP error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.otp) {
        setError('Please enter the OTP');
        setLoading(false);
        return;
      }

      // Validate OTP against stored OTP in state
      const isValid = formData.otp === generatedOTP;

      if (!isValid) {
        setError('Invalid OTP. Please check your email and try again.');
        setLoading(false);
        return;
      }

      // OTP is valid, proceed with authentication
      const result = await verifyAuth(formData.email, formData.otp);

      if (result.needsSignup) {
        setCurrentStep('signup');
        setError('');
      } else {
        setCurrentStep('success');
        setTimeout(() => {
          onClose();
          router.push('/account');
        }, 2000);
      }
    } catch (error: unknown) {
      console.error('Verify OTP error:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.phone || !formData.address) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      await completeSignup(formData.email, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        pinCode: formData.pinCode
      });

      setCurrentStep('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: unknown) {
      console.error('Complete signup error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-primary-dark/5 to-accent-brown/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep === 'email' && <Sparkles className="h-6 w-6 text-accent-brown" />}
              {currentStep === 'otp' && <Lock className="h-6 w-6 text-accent-brown" />}
              {currentStep === 'signup' && <Heart className="h-6 w-6 text-accent-brown" />}
              {currentStep === 'success' && <Check className="h-6 w-6 text-green-600" />}
              <h2 className="text-2xl font-bold text-primary-dark">
                {currentStep === 'email' && 'Welcome Back'}
                {currentStep === 'otp' && 'Enter Code'}
                {currentStep === 'signup' && 'Complete Setup'}
                {currentStep === 'success' && 'Welcome!'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-2 right-16 opacity-10">
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {error && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              currentStep === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          {currentStep === 'email' && !showOtp && (
            <div className="space-y-6">
              {/* Welcome illustration */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-dark to-accent-brown rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600 text-base font-medium">
                  Sign in to your account or create a new one
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-gray-500">Secure & Encrypted</span>
                </div>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent-brown" />
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none placeholder-gray-400 text-base transition-all hover:border-gray-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-dark text-white py-4 px-6 rounded-xl font-semibold hover:bg-accent-brown transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-base"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {currentStep === 'email' && showOtp && (
            <div className="space-y-6">
              {/* OTP illustration */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-brown to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600 text-base font-medium">
                  Check your email for the verification code
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-gray-500">Secure verification</span>
                </div>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    We&apos;ve sent a 6-digit code to <strong className="text-primary-dark">{formData.email}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4 text-accent-brown" />
                    Enter 6-digit Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleChange({ target: { name: 'otp', value } } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none placeholder-gray-400 text-center text-xl font-mono tracking-widest transition-all"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOtp(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 cursor-pointer text-base"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || formData.otp.length !== 6}
                    className="flex-1 bg-primary-dark text-white py-3 px-6 rounded-xl font-semibold hover:bg-accent-brown transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-base"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      'Verify Code'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 'signup' && (
            <form onSubmit={handleCompleteSignup} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-brown to-primary-dark rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  Let&apos;s set up your account
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Lock className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-gray-500">Secure setup</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-accent-brown" />
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none placeholder-gray-400 transition-all text-sm"
                      placeholder="First name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-accent-brown" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none placeholder-gray-400 transition-all text-sm"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Phone className="h-3 w-3 text-accent-brown" />
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none placeholder-gray-400 transition-all text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-accent-brown" />
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-3 w-3" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none placeholder-gray-400 transition-all resize-none text-sm"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold hover:bg-accent-brown transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Complete Setup
                  </>
                )}
              </button>
            </form>
          )}

          {currentStep === 'success' && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Welcome!</h3>
              <p className="text-gray-600 text-lg mb-4">You have been successfully logged in.</p>
              <div className="flex items-center justify-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-500">Secure session active</span>
              </div>
            </div>
          )}
        </div>

        {/* Trust indicators footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-green-600" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-green-600" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-accent-brown" />
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
