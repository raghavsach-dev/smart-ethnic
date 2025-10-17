'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define the interface for Firebase collections
interface Category {
  id: string;
  name: string;
  desc: string;
  image: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
            Our Collections
          </h1>
          <p className="text-xl text-accent-brown max-w-3xl mx-auto">
            Discover our comprehensive collection of premium ethnic wear, carefully curated
            to help you find exactly what you&apos;re looking for.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-dark"></div>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/400/300';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-white/90 text-sm line-clamp-3">{category.desc}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-primary-dark font-semibold group-hover:text-secondary-brown transition-colors">
                          Explore Collection
                        </span>
                        <svg className="h-5 w-5 text-primary-dark group-hover:text-secondary-brown transition-colors transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl shadow-md">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-2xl font-semibold text-primary-dark mb-2">No Collections Found</h3>
                <p className="text-primary-dark mb-6 max-w-md mx-auto">
                  We&apos;re currently updating our collections. Please check back later.
                </p>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Ready to Explore?
          </h2>
          <p className="text-accent-brown mb-6 max-w-2xl mx-auto">
            Browse our complete product catalog or get in touch for custom orders and special requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-brown transition-colors duration-300"
            >
              Browse All Products
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary-dark text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark hover:text-white transition-colors duration-300"
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
