'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AddressConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addressData: { address: string; phone: string; pinCode: string }) => void;
  loading?: boolean;
}

export default function AddressConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false
}: AddressConfirmationModalProps) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    pinCode: ''
  });
  const [saving, setSaving] = useState(false);

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        address: user.address || '',
        phone: user.phone || '',
        pinCode: user.pinCode || ''
      });
    }
  }, [isOpen, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAddress = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateProfile({
        address: formData.address,
        phone: formData.phone,
        pinCode: formData.pinCode
      });
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    // Save address first if it has changed
    const hasChanged =
      formData.address !== (user?.address || '') ||
      formData.phone !== (user?.phone || '') ||
      formData.pinCode !== (user?.pinCode || '');

    if (hasChanged) {
      await handleSaveAddress();
    }

    onConfirm(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Confirm Delivery Address
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Please confirm your delivery address. You can edit it if needed.
          </p>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none resize-none"
              placeholder="Enter your full delivery address"
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Pin Code Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pin Code *
            </label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none"
              placeholder="Enter pin code"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !formData.address.trim() || !formData.phone.trim() || !formData.pinCode.trim()}
            className="flex-1 px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-accent-brown transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Confirm Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
