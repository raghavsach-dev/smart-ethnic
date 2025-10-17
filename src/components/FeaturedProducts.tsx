
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTopProducts, Product } from '@/lib/firebase';

// Generate random discount between 5-10%
const generateDiscount = () => Math.floor(Math.random() * 6) + 5; // 5-10%

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const topProducts = await getTopProducts();
        // Add discount information to products
        const productsWithDiscounts = topProducts.map(product => {
          console.log('Featured product:', { id: product.id, name: product.name, collectionId: product.collectionId });
          const discountPercent = generateDiscount();
          const originalPrice = Math.round(parseInt(product.price) / (1 - discountPercent / 100));
          return {
            ...product,
            discountPercent,
            originalPrice
          };
        });
        setProducts(productsWithDiscounts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-primary-dark/80 max-w-2xl mx-auto">
            Discover our handpicked selection of premium ethnic wear, crafted with traditional
            techniques and modern comfort in mind.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-12">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-80 md:h-96 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/320/384';
                        }}
                      />
                    </div>
                  </Link>

                  {/* Discount Badge */}
                  {product.discountPercent && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {product.discountPercent}% OFF
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm md:text-base font-semibold text-primary-dark hover:text-secondary-brown transition-colors overflow-hidden text-ellipsis mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-primary-dark">
                        ₹{parseInt(product.price).toLocaleString()}
                      </span>
                      {product.originalPrice && product.discountPercent && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Explore Now Button */}
                  <Link href={`/products/${product.id}`}>
                    <button className="w-full bg-primary-dark text-white py-2 px-4 rounded-lg font-medium hover:bg-accent-brown transition-colors text-sm">
                      Explore Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No featured products available at the moment.</p>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/products"
            className="inline-block bg-secondary-brown text-primary-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-brown transition-colors duration-300 shadow-lg"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
