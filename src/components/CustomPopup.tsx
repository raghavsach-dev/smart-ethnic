'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type PopupType = 'success' | 'error' | 'warning' | 'info';

interface CustomPopupProps {
  isOpen: boolean;
  type: PopupType;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function CustomPopup({
  isOpen,
  type,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000
}: CustomPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Allow animation to complete
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'info':
        return <AlertCircle className="h-6 w-6 text-blue-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`relative p-4 rounded-lg shadow-lg border ${getBackgroundColor()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing popup state
export function useCustomPopup() {
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    type: PopupType;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    message: ''
  });

  const showPopup = (type: PopupType, message: string) => {
    setPopupState({
      isOpen: true,
      type,
      message
    });
  };

  const hidePopup = () => {
    setPopupState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const showSuccess = (message: string) => showPopup('success', message);
  const showError = (message: string) => showPopup('error', message);
  const showWarning = (message: string) => showPopup('warning', message);
  const showInfo = (message: string) => showPopup('info', message);

  return {
    popupState,
    showPopup,
    hidePopup,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}
