'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getTopProducts, Product } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Pagination constants
const PRODUCTS_PER_PAGE = 20;

// Category interface
interface Category {
  id: string;
  name: string;
  desc: string;
  image: string;
}

function Products() {
  const searchParams = useSearchParams();

  // Product data and loading states
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(50000); // Default high value
  const [maxProductPrice, setMaxProductPrice] = useState(50000); // Will be updated when products load
  const [sortBy, setSortBy] = useState('Newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Load initial products
  useEffect(() => {
    loadInitialProducts();
  }, []);

  // Handle URL category parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const collectionsRef = collection(db, 'collections');
        const snapshot = await getDocs(collectionsRef);
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const loadInitialProducts = async () => {
    try {
      setLoading(true);
      const products = await getTopProducts();
      const productsWithDiscounts = products.map(product => ({
        ...product,
        discountPercent: Math.floor(Math.random() * 6) + 5, // 5-10% discount
        originalPrice: Math.round(parseInt(product.price) / (1 - (Math.floor(Math.random() * 6) + 5) / 100))
      }));

      setAllProducts(productsWithDiscounts);

      // Calculate max price from all products
      const rawMaxPrice = Math.max(...productsWithDiscounts.map(product => parseInt(product.price)));
const stepSize = 500;
      const calculatedMaxPrice = Math.ceil(rawMaxPrice / stepSize) * stepSize;
      setMaxProductPrice(calculatedMaxPrice);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique materials from all products
  const availableMaterials = Array.from(
    new Set(
      allProducts
        .map(product => product.material)
        .filter((material): material is string => material !== undefined && material.trim() !== '')
    )
  ).sort();

  // Filter and sort products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.collectionId && product.collectionId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.collectionId === selectedCategory;
    const matchesPrice = parseInt(product.price) <= maxPrice;
    const matchesMaterials = selectedMaterials.length === 0 || (product.material && selectedMaterials.includes(product.material as string));

    return matchesSearch && matchesCategory && matchesPrice && matchesMaterials;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return parseInt(a.price) - parseInt(b.price);
      case 'Price: High to Low':
        return parseInt(b.price) - parseInt(a.price);
      case 'Newest':
      default:
        return 0; // Keep original order for now
    }
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, maxPrice, sortBy, selectedMaterials]);

  // Calculate pagination data
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Pagination helpers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="lg:w-80">
            {/* Professional Menu Bar */}
            <div className="bg-secondary-brown rounded-xl shadow-lg p-6 mb-6 border border-accent-brown mt-32">
              <div className="flex flex-col gap-4">
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
                <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-accent-brown rounded-lg focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none bg-primary-dark text-cream appearance-none"
                  >
                    <option value="Newest">Newest</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="h-4 w-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Categories Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-accent-brown rounded-lg focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none bg-primary-dark text-cream appearance-none"
                  >
                    <option value="All">All Products</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                  ))}
                </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="h-4 w-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
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

                {/* Material Filter */}
                {availableMaterials.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark mb-3">
                      Material
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableMaterials.map(material => (
                        <label key={material} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(material)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMaterials(prev => [...prev, material]);
                              } else {
                                setSelectedMaterials(prev => prev.filter(m => m !== material));
                              }
                            }}
                            className="rounded border-accent-brown text-accent-brown focus:ring-accent-brown"
                          />
                          <span className="text-sm text-primary-dark">{material}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                <div className="pt-4 border-t border-accent-brown">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setSelectedMaterials([]);
                      setMaxPrice(maxProductPrice);
                      setSortBy('Newest');
                      setCurrentPage(1);
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
            {/* Products Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary-dark mb-4">All Products</h1>
              <p className="text-lg text-primary-dark max-w-2xl mx-auto">
                Discover our complete collection of premium ethnic wear, featuring traditional craftsmanship and modern comfort.
              </p>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <p className="text-primary-dark">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
                {sortedProducts.length === 0 && 'No products found'}
                </p>
              </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-dark"></div>
            </div>
            ) : (
              <>
            {/* Products Grid */}
                {currentProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {currentProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl shadow-md">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-primary-dark mb-2">No products found</h3>
                <p className="text-primary-dark mb-6 max-w-md mx-auto">
                      Try adjusting your search criteria or clearing filters.
                </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                        setSelectedMaterials([]);
                      setMaxPrice(maxProductPrice);
                        setSortBy('Newest');
                    }}
                      className="bg-primary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-brown transition-colors"
                  >
                    Clear Filters
                  </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {getVisiblePages().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && goToPage(page)}
                          disabled={page === '...'}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            page === currentPage
                              ? 'bg-primary-dark text-white border-primary-dark'
                              : page === '...'
                              ? 'border-gray-200 text-gray-400 cursor-default'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                  <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      Next →
                  </button>
              </div>
            )}
              </>
        )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Products />
    </Suspense>
  );
}
