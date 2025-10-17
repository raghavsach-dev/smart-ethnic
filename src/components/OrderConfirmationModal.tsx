'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
  onViewOrders: () => void;
}

export default function OrderConfirmationModal({
  isOpen,
  orderId,
  onClose,
  onViewOrders
}: OrderConfirmationModalProps) {
  const [showTick, setShowTick] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    console.log('OrderConfirmationModal props received:', { isOpen, orderId });
    if (isOpen) {
      console.log('OrderConfirmationModal opening with orderId:', orderId);
      // Start tick animation after modal opens
      setTimeout(() => setShowTick(true), 200);
      // Show content after tick animation
      setTimeout(() => setShowContent(true), 600);
    } else {
      // Reset states when closing
      setShowTick(false);
      setShowContent(false);
    }
  }, [isOpen, orderId]);

  // Debug: Log if modal should render
  console.log('OrderConfirmationModal render check:', { isOpen, shouldRender: isOpen && !showTick && !showContent });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          {/* Animated Tick */}
          <div className="flex justify-center mb-6">
            <div
              className={`relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center transition-all duration-500 ${
                showTick ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping"></div>
            </div>
          </div>

          {/* Content with fade-in */}
          <div
            className={`transition-all duration-500 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>

            <p className="text-gray-600 mb-6">
              Thank you for your order. We&apos;ll send you shipping updates at every step.
            </p>

            {/* Order ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="text-lg font-mono font-bold text-gray-900">
                {orderId}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={onViewOrders}
                className="flex-1 px-4 py-3 bg-primary-dark text-white rounded-lg hover:bg-accent-brown transition-colors font-medium"
              >
                My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
