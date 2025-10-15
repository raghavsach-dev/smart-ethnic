'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User, LogOut, Package } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import AuthModal from './auth/AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { getTotalItems } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };


  return (
    <header className="bg-secondary-brown text-primary-dark shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Smart Ethnic Logo"
              width={280}
              height={140}
              className="h-20 w-auto object-contain hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-primary-dark hover:text-accent-brown transition-colors font-medium text-lg">
              Home
            </Link>
            <Link href="/products" className="text-primary-dark hover:text-accent-brown transition-colors font-medium text-lg">
              Products
            </Link>
            <Link href="/categories" className="text-primary-dark hover:text-accent-brown transition-colors font-medium text-lg">
              Categories
            </Link>
            <Link href="/about" className="text-primary-dark hover:text-accent-brown transition-colors font-medium text-lg">
              About
            </Link>
            <Link href="/contact" className="text-primary-dark hover:text-accent-brown transition-colors font-medium text-lg">
              Contact
            </Link>
          </nav>

          {/* Account Icon, Cart */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-secondary-brown" />
                  <span className="text-sm font-medium hidden sm:block">
                    Hi, {user?.firstName}
                  </span>
                </div>

                {/* Admin Panel Link */}
                <a
                  href="/admin"
                  className="text-primary-dark hover:text-accent-brown transition-colors p-1 cursor-pointer"
                  title="Admin Panel"
                >
                  <Package className="h-5 w-5" />
                </a>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-primary-dark hover:text-accent-brown transition-colors p-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
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

            {/* Cart Button - Only visible when logged in */}
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-primary-dark hover:text-accent-brown transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-accent-brown pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-primary-dark hover:text-accent-brown transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-primary-dark hover:text-accent-brown transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-primary-dark hover:text-accent-brown transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-primary-dark hover:text-accent-brown transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-primary-dark hover:text-accent-brown transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-accent-brown pt-4 mt-4 space-y-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-2 text-primary-dark">
                      <User className="h-5 w-5 text-accent-brown" />
                      <span className="font-medium">Hi, {user?.firstName}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 text-primary-dark hover:text-accent-brown transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center space-x-2 text-primary-dark hover:text-accent-brown transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center space-x-2 text-primary-dark hover:text-accent-brown transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Cart ({getTotalItems()})</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-300 hover:text-red-100 transition-colors font-medium w-full text-left cursor-pointer"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="flex items-center space-x-2 text-primary-dark hover:text-accent-brown transition-colors font-medium w-full text-left cursor-pointer"
                  >
                    <User className="h-5 w-5" />
                    <span>Login / Sign Up</span>
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </header>
  );
}
