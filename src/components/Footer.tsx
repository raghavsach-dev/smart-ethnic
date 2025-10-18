import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary-brown text-primary-dark">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Mobile Layout - Everything stacked */}
        <div className="block md:hidden space-y-8">
          {/* Brand Section */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary-dark mb-3">Smart Ethnic</h3>
            <p className="text-primary-dark/80 mb-4 text-sm leading-relaxed">
              Premium quality men&apos;s ethnic wear combining traditional designs with modern comfort.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-primary-dark hover:text-accent-brown transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-dark hover:text-accent-brown transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-dark hover:text-accent-brown transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links and Contact in Mobile Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quick Links */}
            <div>
              <h4 className="text-base font-semibold text-primary-dark mb-3">Quick Links</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/" className="text-primary-dark/80 hover:text-accent-brown transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-primary-dark/80 hover:text-accent-brown transition-colors text-sm">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-primary-dark/80 hover:text-accent-brown transition-colors text-sm">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-primary-dark/80 hover:text-accent-brown transition-colors text-sm">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="-ml-2">
              <h4 className="text-base font-semibold text-primary-dark mb-3">Contact Us</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary-dark flex-shrink-0" />
                  <a
                    href="mailto:smartethnic97@gmail.com"
                    className="text-primary-dark/80 hover:text-accent-brown transition-colors text-xs break-all"
                  >
                    smartethnic97@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary-dark flex-shrink-0" />
                  <a
                    href="tel:9825965551"
                    className="text-primary-dark/80 hover:text-accent-brown transition-colors text-xs"
                  >
                    +91 9825965551
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-primary-dark mt-0.5 flex-shrink-0" />
                  <span className="text-primary-dark/80 text-xs">
                    India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-primary-dark mb-4">Smart Ethnic</h3>
            <p className="text-primary-dark/80 mb-6 max-w-md text-sm sm:text-base">
              Premium quality men&apos;s ethnic wear combining traditional designs with modern comfort.
              Discover authentic ethnic fashion that celebrates heritage and style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-dark hover:text-accent-brown transition-colors">
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-primary-dark hover:text-accent-brown transition-colors">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-primary-dark hover:text-accent-brown transition-colors">
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Links and Contact Block */}
          <div className="grid grid-cols-2 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-primary-dark mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-primary-dark/80 hover:text-accent-brown transition-colors text-sm sm:text-base">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-primary-dark/80 hover:text-accent-brown transition-colors text-sm sm:text-base">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-primary-dark/80 hover:text-accent-brown transition-colors text-sm sm:text-base">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-primary-dark/80 hover:text-accent-brown transition-colors text-sm sm:text-base">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-primary-dark mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary-dark flex-shrink-0" />
                  <a
                    href="mailto:smartethnic97@gmail.com"
                    className="text-primary-dark/80 hover:text-accent-brown transition-colors text-xs sm:text-sm break-all"
                  >
                    smartethnic97@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary-dark flex-shrink-0" />
                  <a
                    href="tel:9825965551"
                    className="text-primary-dark/80 hover:text-accent-brown transition-colors text-xs sm:text-sm"
                  >
                    +91 9825965551
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-dark mt-0.5 flex-shrink-0" />
                  <span className="text-primary-dark/80 text-xs sm:text-sm">
                    India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
