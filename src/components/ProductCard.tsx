'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  originalPrice?: number;
  image: string;
  category?: string;
  discountPercent?: number;
  collectionId?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  discountPercent,
  collectionId
}: ProductCardProps) {

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <Link href={`/products/${id}`}>
          <div className="relative h-80 md:h-96 overflow-hidden">
            <Image
              src={image}
              alt={name}
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
        {discountPercent && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-sm md:text-base font-semibold text-primary-dark hover:text-secondary-brown transition-colors overflow-hidden text-ellipsis mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary-dark">
              ₹{parseInt(price).toLocaleString()}
            </span>
            {originalPrice && discountPercent && (
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Explore Now Button */}
        <Link href={`/products/${id}`}>
          <button className="w-full bg-primary-dark text-white py-2 px-4 rounded-lg font-medium hover:bg-accent-brown transition-colors text-sm">
            Explore Now
          </button>
        </Link>
      </div>
    </div>
  );
}
