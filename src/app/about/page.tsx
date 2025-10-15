import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Users, Truck, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-6">
            About Smart Ethnic
          </h1>
          <p className="text-xl text-primary-dark/80 max-w-3xl mx-auto leading-relaxed">
            We are passionate about bringing you the finest collection of men's ethnic wear,
            combining traditional craftsmanship with modern comfort and style.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-primary-dark mb-6">Our Story</h2>
            <div className="space-y-4 text-primary-dark/80 leading-relaxed">
              <p>
                Founded with a vision to preserve and modernize traditional ethnic fashion,
                Smart Ethnic has been serving discerning customers since our inception.
                We believe that traditional clothing should not be confined to special occasions
                but should be a part of everyday elegance.
              </p>
              <p>
                Our journey began with a simple mission: to create ethnic wear that feels
                as comfortable as it looks magnificent. We work closely with skilled artisans
                and use premium fabrics to ensure every piece meets our exacting standards
                of quality and craftsmanship.
              </p>
              <p>
                Today, we proudly serve customers across India, offering a curated collection
                that spans from classic kurtas to elaborate sherwanis, all designed to make
                you look and feel your best.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-primary-dark mb-6">Our Values</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-dark p-3 rounded-lg">
                  <Award className="h-6 w-6 text-cream" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary-dark mb-2">Quality First</h4>
                  <p className="text-primary-dark/80">
                    Every garment undergoes rigorous quality checks to ensure it meets our high standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-dark p-3 rounded-lg">
                  <Users className="h-6 w-6 text-cream" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary-dark mb-2">Customer Satisfaction</h4>
                  <p className="text-primary-dark/80">
                    Your satisfaction is our priority. We offer personalized styling advice and easy returns.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-dark p-3 rounded-lg">
                  <Truck className="h-6 w-6 text-cream" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary-dark mb-2">Reliable Service</h4>
                  <p className="text-primary-dark/80">
                    Fast and secure shipping with tracking across India. Your order arrives on time.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-dark p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-cream" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary-dark mb-2">Authentic Heritage</h4>
                  <p className="text-primary-dark/80">
                    We honor traditional craftsmanship while embracing contemporary design sensibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-dark mb-2">500+</div>
              <div className="text-accent-brown">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-dark mb-2">100+</div>
              <div className="text-accent-brown">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-dark mb-2">50+</div>
              <div className="text-accent-brown">Designs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-dark mb-2">5</div>
              <div className="text-accent-brown">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-primary-dark text-cream rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Premium Ethnic Wear?</h2>
          <p className="text-cream/80 mb-6 max-w-2xl mx-auto">
            Browse our collection or get in touch for personalized recommendations.
            We're here to help you find the perfect traditional outfit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-secondary-brown text-primary-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cream transition-colors duration-300 shadow-lg"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="border-2 border-secondary-brown text-secondary-brown px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-brown hover:text-primary-dark transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
