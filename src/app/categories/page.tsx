import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Shirt,
  Scissors,
  Crown,
  Square,
  Circle,
  Star,
  Sparkles,
  Gem
} from 'lucide-react';

const categories = [
  {
    id: 'shirts',
    name: 'Shirts',
    icon: Shirt,
    description: 'Casual, formal, and printed shirts',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
    iconColor: 'text-blue-600',
    subcategories: ['casual', 'formal', 'printed'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'pants',
    name: 'Pants',
    icon: Scissors,
    description: 'Straight fit, narrow length, and bell bottom pants',
    color: 'bg-green-50 border-green-200 hover:border-green-300',
    iconColor: 'text-green-600',
    subcategories: ['straight fit', 'narrow length', 'bell bottom'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'suits',
    name: 'Suits',
    icon: Crown,
    description: 'Premium 2-piece and 3-piece suits',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-300',
    iconColor: 'text-purple-600',
    subcategories: ['2 piece', '3 piece'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'blazers',
    name: 'Blazers',
    icon: Square,
    description: 'Peak lapel and shawl lapel blazers',
    color: 'bg-red-50 border-red-200 hover:border-red-300',
    iconColor: 'text-red-600',
    subcategories: ['peak lapel', 'shawl lapel'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'jodhpuri',
    name: 'Jodhpuri',
    icon: Star,
    description: 'Classic Jodhpuri suits for special occasions',
    color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300',
    iconColor: 'text-yellow-600',
    subcategories: [],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'indo-western',
    name: 'Indo-Western',
    icon: Sparkles,
    description: 'Modern fusion of Indian and Western styles',
    color: 'bg-pink-50 border-pink-200 hover:border-pink-300',
    iconColor: 'text-pink-600',
    subcategories: [],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'koti-kurta',
    name: 'Koti-Kurta',
    icon: Gem,
    description: 'Printed kurtas and long koti combinations',
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
    iconColor: 'text-indigo-600',
    subcategories: ['printed kurta', 'long koti'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'sherwani',
    name: 'Sherwani',
    icon: Crown,
    description: 'Elegant Sherwani sets for weddings and festivals',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-300',
    iconColor: 'text-orange-600',
    subcategories: [],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'paghdi-shafa',
    name: 'Paghdi/Shafa',
    icon: Star,
    description: 'Traditional headwear for complete ethnic look',
    color: 'bg-teal-50 border-teal-200 hover:border-teal-300',
    iconColor: 'text-teal-600',
    subcategories: [],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'juti-mojdi',
    name: 'Juti/Mojdi',
    icon: Circle,
    description: 'Authentic traditional footwear',
    color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-300',
    iconColor: 'text-cyan-600',
    subcategories: [],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'lowers',
    name: 'Lowers',
    icon: Square,
    description: 'Dhoti and pajama for traditional comfort',
    color: 'bg-lime-50 border-lime-200 hover:border-lime-300',
    iconColor: 'text-lime-600',
    subcategories: ['dhoti', 'pajama'],
    image: '/api/placeholder/400/300'
  }
];

export default function Categories() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
            Our Categories
          </h1>
          <p className="text-xl text-accent-brown max-w-3xl mx-auto">
            Discover our comprehensive collection of premium ethnic wear, carefully organized
            to help you find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${category.color}`}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent className={`h-16 w-16 ${category.iconColor} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  </div>
                  {/* Placeholder for actual images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <IconComponent className={`h-6 w-6 ${category.iconColor}`} />
                    <h3 className="text-xl font-bold text-primary-dark group-hover:text-secondary-brown transition-colors">
                      {category.name}
                    </h3>
                  </div>

                  <p className="text-accent-brown text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  {category.subcategories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-primary-dark uppercase tracking-wide">
                        Styles:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.map((sub, index) => (
                          <span
                            key={index}
                            className="inline-block bg-white/60 text-primary-dark text-xs px-2 py-1 rounded-full border border-white/40"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center text-secondary-brown font-medium group-hover:text-primary-dark transition-colors">
                    <span className="text-sm">Explore {category.name}</span>
                    <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-accent-brown mb-6 max-w-2xl mx-auto">
            Our collection is constantly expanding with new designs and styles.
            Contact us for custom orders or special requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-primary-dark text-cream px-6 py-3 rounded-lg font-semibold hover:bg-accent-brown transition-colors duration-300"
            >
              Browse All Products
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary-dark text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark hover:text-cream transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
