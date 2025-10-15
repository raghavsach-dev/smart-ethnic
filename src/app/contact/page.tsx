import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-dark mb-4">Contact Us</h1>
          <p className="text-lg text-primary-dark/80 max-w-2xl mx-auto">
            Get in touch with us for any questions about our premium ethnic wear collection.
            We're here to help you find the perfect traditional outfit.
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

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-primary-dark mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-brown focus:border-transparent outline-none transition-colors"
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
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-brown focus:border-transparent outline-none transition-colors"
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
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-brown focus:border-transparent outline-none transition-colors"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-brown focus:border-transparent outline-none transition-colors"
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

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary-dark mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-brown focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-dark text-cream py-4 px-6 rounded-lg font-semibold text-lg hover:bg-accent-brown transition-colors duration-300 shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
