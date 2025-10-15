'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal, X, Plus, Edit, Trash2, Package, Tag, Percent, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

const allProducts = [
  // Shirts
  {
    id: '1',
    name: 'Premium Cotton Casual Shirt',
    price: 2499,
    originalPrice: 3499,
    image: '/api/placeholder/400/400',
    category: 'shirts',
    subcategory: 'casual',
    rating: 4.8,
    isNew: true,
    isSale: true
  },
  {
    id: '2',
    name: 'Classic Formal Shirt',
    price: 3299,
    image: '/api/placeholder/400/400',
    category: 'shirts',
    subcategory: 'formal',
    rating: 4.6,
    isNew: false,
    isSale: false
  },
  {
    id: '3',
    name: 'Designer Printed Shirt',
    price: 2799,
    image: '/api/placeholder/400/400',
    category: 'shirts',
    subcategory: 'printed',
    rating: 4.7,
    isNew: true,
    isSale: false
  },

  // Pants
  {
    id: '4',
    name: 'Straight Fit Formal Pants',
    price: 1899,
    originalPrice: 2499,
    image: '/api/placeholder/400/400',
    category: 'pants',
    subcategory: 'straight fit',
    rating: 4.5,
    isNew: false,
    isSale: true
  },
  {
    id: '5',
    name: 'Narrow Length Chinos',
    price: 2199,
    image: '/api/placeholder/400/400',
    category: 'pants',
    subcategory: 'narrow length',
    rating: 4.4,
    isNew: true,
    isSale: false
  },
  {
    id: '6',
    name: 'Bell Bottom Retro Pants',
    price: 2599,
    image: '/api/placeholder/400/400',
    category: 'pants',
    subcategory: 'bell bottom',
    rating: 4.6,
    isNew: false,
    isSale: false
  },

  // Suits
  {
    id: '7',
    name: 'Classic Two Piece Suit',
    price: 8999,
    originalPrice: 11999,
    image: '/api/placeholder/400/400',
    category: 'suits',
    subcategory: '2 piece',
    rating: 4.9,
    isNew: false,
    isSale: true
  },
  {
    id: '8',
    name: 'Premium Three Piece Suit',
    price: 12999,
    image: '/api/placeholder/400/400',
    category: 'suits',
    subcategory: '3 piece',
    rating: 4.8,
    isNew: true,
    isSale: false
  },

  // Blazers
  {
    id: '9',
    name: 'Peak Lapel Blazer',
    price: 6799,
    originalPrice: 7999,
    image: '/api/placeholder/400/400',
    category: 'blazers',
    subcategory: 'peak lapel',
    rating: 4.7,
    isNew: false,
    isSale: true
  },
  {
    id: '10',
    name: 'Shawl Lapel Evening Blazer',
    price: 7299,
    image: '/api/placeholder/400/400',
    category: 'blazers',
    subcategory: 'shawl lapel',
    rating: 4.6,
    isNew: true,
    isSale: false
  },

  // Jodhpuri
  {
    id: '11',
    name: 'Festive Jodhpuri Suit',
    price: 11999,
    image: '/api/placeholder/400/400',
    category: 'jodhpuri',
    rating: 4.8,
    isNew: false,
    isSale: false
  },

  // Indo-Western
  {
    id: '12',
    name: 'Indo-Western Fusion Jacket',
    price: 4599,
    originalPrice: 5999,
    image: '/api/placeholder/400/400',
    category: 'indo-western',
    rating: 4.7,
    isNew: true,
    isSale: true
  },

  // Koti-Kurta
  {
    id: '13',
    name: 'Printed Kurta Set',
    price: 2899,
    image: '/api/placeholder/400/400',
    category: 'koti-kurta',
    subcategory: 'printed kurta',
    rating: 4.5,
    isNew: false,
    isSale: false
  },
  {
    id: '14',
    name: 'Long Koti with Kurta',
    price: 3999,
    image: '/api/placeholder/400/400',
    category: 'koti-kurta',
    subcategory: 'long koti',
    rating: 4.8,
    isNew: true,
    isSale: false
  },

  // Sherwani
  {
    id: '15',
    name: 'Designer Sherwani Set',
    price: 8999,
    originalPrice: 12999,
    image: '/api/placeholder/400/400',
    category: 'sherwani',
    rating: 4.9,
    isNew: false,
    isSale: true
  },

  // Paghdi/Shafa
  {
    id: '16',
    name: 'Traditional Paghdi',
    price: 799,
    image: '/api/placeholder/400/400',
    category: 'paghdi/shafa',
    rating: 4.3,
    isNew: false,
    isSale: false
  },

  // Juti/Mojdi
  {
    id: '17',
    name: 'Embroidered Juti',
    price: 1299,
    image: '/api/placeholder/400/400',
    category: 'juti/mojdi',
    rating: 4.6,
    isNew: true,
    isSale: false
  },

  // Lowers
  {
    id: '18',
    name: 'Cotton Dhoti',
    price: 1599,
    image: '/api/placeholder/400/400',
    category: 'lowers',
    subcategory: 'dhoti',
    rating: 4.4,
    isNew: false,
    isSale: false
  },
  {
    id: '19',
    name: 'Silk Pajama',
    price: 1899,
    originalPrice: 2499,
    image: '/api/placeholder/400/400',
    category: 'lowers',
    subcategory: 'pajama',
    rating: 4.5,
    isNew: true,
    isSale: true
  }
];

const categoryOptions = [
  { id: 'All', name: 'All Categories' },
  { id: 'shirts', name: 'Shirts' },
  { id: 'pants', name: 'Pants' },
  { id: 'suits', name: 'Suits' },
  { id: 'blazers', name: 'Blazers' },
  { id: 'jodhpuri', name: 'Jodhpuri' },
  { id: 'indo-western', name: 'Indo-Western' },
  { id: 'koti-kurta', name: 'Koti-Kurta' },
  { id: 'sherwani', name: 'Sherwani' },
  { id: 'paghdi/shafa', name: 'Paghdi/Shafa' },
  { id: 'juti/mojdi', name: 'Juti/Mojdi' },
  { id: 'lowers', name: 'Lowers' }
];

const collections = [
  {
    id: 'shirts',
    name: 'Shirts',
    image: '/api/placeholder/400/400',
    description: 'Premium cotton shirts',
    itemCount: 3
  },
  {
    id: 'pants',
    name: 'Pants',
    image: '/api/placeholder/400/400',
    description: 'Comfortable formal pants',
    itemCount: 3
  },
  {
    id: 'suits',
    name: 'Suits',
    image: '/api/placeholder/400/400',
    description: 'Complete suit sets',
    itemCount: 2
  },
  {
    id: 'blazers',
    name: 'Blazers',
    image: '/api/placeholder/400/400',
    description: 'Elegant blazers',
    itemCount: 2
  },
  {
    id: 'jodhpuri',
    name: 'Jodhpuri',
    image: '/api/placeholder/400/400',
    description: 'Traditional Jodhpuri suits',
    itemCount: 1
  },
  {
    id: 'indo-western',
    name: 'Indo-Western',
    image: '/api/placeholder/400/400',
    description: 'Fusion wear',
    itemCount: 1
  },
  {
    id: 'koti-kurta',
    name: 'Koti-Kurta',
    image: '/api/placeholder/400/400',
    description: 'Kurta and koti sets',
    itemCount: 2
  },
  {
    id: 'sherwani',
    name: 'Sherwani',
    image: '/api/placeholder/400/400',
    description: 'Royal sherwani sets',
    itemCount: 1
  },
  {
    id: 'paghdi/shafa',
    name: 'Paghdi/Shafa',
    image: '/api/placeholder/400/400',
    description: 'Traditional headwear',
    itemCount: 1
  },
  {
    id: 'juti/mojdi',
    name: 'Juti/Mojdi',
    image: '/api/placeholder/400/400',
    description: 'Traditional footwear',
    itemCount: 1
  },
  {
    id: 'lowers',
    name: 'Lowers',
    image: '/api/placeholder/400/400',
    description: 'Dhoti and pajama',
    itemCount: 2
  }
];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Popularity'];

// Calculate maximum price from all products and ensure it's divisible by step size
const rawMaxPrice = Math.max(...allProducts.map(product => product.price));
const stepSize = 500;
const maxProductPrice = Math.ceil(rawMaxPrice / stepSize) * stepSize;

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(maxProductPrice);
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('collections'); // 'collections' or 'products'

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    let matchesPrice = true;
    matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Rating':
        return b.rating - a.rating;
      case 'Newest':
      default:
        return b.isNew ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="lg:w-80">
            {/* Professional Menu Bar */}
            <div className="bg-secondary-brown rounded-xl shadow-lg p-6 mb-6 border border-accent-brown">
              <div className="flex flex-col gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-primary-dark rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('collections')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'collections'
                        ? 'bg-primary-dark text-cream shadow-sm'
                        : 'text-primary-dark hover:bg-white'
                    }`}
                  >
                    Collections
                  </button>
                  <button
                    onClick={() => setViewMode('products')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'products'
                        ? 'bg-primary-dark text-cream shadow-sm'
                        : 'text-primary-dark hover:bg-white'
                    }`}
                  >
                    All Products
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-accent-brown rounded-lg focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none bg-primary-dark text-cream"
                  />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-accent-brown rounded-lg focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none bg-primary-dark text-cream"
                >
                  {sortOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-accent-brown">
              <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </h3>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-dark mb-3">
                    Price Range
                  </label>

                  {/* Price Display */}
                  <div className="flex justify-center items-center mb-3">
                    <span className="text-sm text-primary-dark font-medium">
                      Up to ₹{maxPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Dual Range Slider */}
                  <div className="relative py-4">
                    {/* Track Background */}
                    <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-3 bg-accent-brown/30 rounded-full border border-accent-brown/50"></div>

                    {/* Selected Range Track */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 h-3 bg-primary-dark rounded-full shadow-sm"
                      style={{
                        left: '0%',
                        width: `${Math.min((maxPrice / maxProductPrice) * 100, 100)}%`
                      }}
                    ></div>

                    {/* Single Max Price Slider */}
                    <input
                      type="range"
                      min="0"
                      max={maxProductPrice}
                      step="500"
                      value={maxPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setMaxPrice(Math.max(0, value));
                      }}
                      className="absolute w-full h-3 bg-transparent appearance-none cursor-pointer range-slider-max"
                      style={{ zIndex: 3 }}
                    />
                  </div>

                </div>

                {/* Clear Filters */}
                <div className="pt-4 border-t border-accent-brown">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setMaxPrice(maxProductPrice);
                      setSortBy('Newest');
                    }}
                    className="flex items-center gap-2 text-primary-dark hover:text-accent-brown transition-colors font-medium px-4 py-2 w-full justify-center"
                  >
                    <X className="h-4 w-4" />
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Content Area */}
        {viewMode === 'collections' ? (
          /* Collections View */
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary-dark mb-4">Our Collections</h1>
              <p className="text-lg text-primary-dark max-w-2xl mx-auto">
                Explore our curated collections of premium men's ethnic wear, each crafted with traditional craftsmanship and modern comfort.
              </p>
            </div>

            {/* Collection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections
                .filter(collection =>
                  collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  collection.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((collection) => (
                  <div
                    key={collection.id}
                    onClick={() => {
                      setSelectedCategory(collection.id);
                      setViewMode('products');
                    }}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-primary-dark mb-1">{collection.name}</h3>
                        <p className="text-primary-dark/90 text-sm">{collection.description}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-accent-brown font-medium">
                          {collection.itemCount} items
                        </span>
                        <span className="text-primary-dark font-semibold group-hover:text-accent-brown transition-colors">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* Products View */
          <div>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-primary-dark">
                  {selectedCategory === 'All' ? 'All Products' : categoryOptions.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <p className="text-primary-dark mt-1">
                  Showing {sortedProducts.length} of {allProducts.length} products
                </p>
              </div>
              <button
                onClick={() => setViewMode('collections')}
                className="flex items-center gap-2 text-primary-dark hover:text-accent-brown transition-colors font-medium"
              >
                ← Back to Collections
              </button>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl shadow-md">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-primary-dark mb-2">No products found</h3>
                <p className="text-primary-dark mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or browse our collections.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setMaxPrice(maxProductPrice);
                    }}
                    className="bg-primary-dark text-cream px-6 py-3 rounded-lg font-medium hover:bg-accent-brown transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setViewMode('collections')}
                    className="border border-cream text-cream px-6 py-3 rounded-lg font-medium hover:bg-cream hover:text-primary-dark transition-colors"
                  >
                    View Collections
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
