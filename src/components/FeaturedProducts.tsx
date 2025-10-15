import ProductCard from './ProductCard';

const featuredProducts = [
  {
    id: '1',
    name: 'Premium Cotton Kurta',
    price: 2499,
    originalPrice: 3499,
    image: '/api/placeholder/400/400',
    category: 'koti-kurta',
    rating: 4.8,
    isNew: true,
    isSale: true
  },
  {
    id: '2',
    name: 'Designer Sherwani Set',
    price: 8999,
    image: '/api/placeholder/400/400',
    category: 'sherwani',
    rating: 4.9,
    isNew: false,
    isSale: false
  },
  {
    id: '3',
    name: 'Classic Formal Shirt',
    price: 3299,
    originalPrice: 4299,
    image: '/api/placeholder/400/400',
    category: 'shirts',
    rating: 4.6,
    isNew: false,
    isSale: true
  },
  {
    id: '4',
    name: 'Indo-Western Fusion Jacket',
    price: 4599,
    image: '/api/placeholder/400/400',
    category: 'indo-western',
    rating: 4.7,
    isNew: true,
    isSale: false
  },
  {
    id: '5',
    name: 'Peak Lapel Blazer',
    price: 6799,
    originalPrice: 7999,
    image: '/api/placeholder/400/400',
    category: 'blazers',
    rating: 4.5,
    isNew: false,
    isSale: true
  },
  {
    id: '6',
    name: 'Festive Jodhpuri Suit',
    price: 11999,
    image: '/api/placeholder/400/400',
    category: 'jodhpuri',
    rating: 4.8,
    isNew: false,
    isSale: false
  },
  {
    id: '7',
    name: 'Straight Fit Pants',
    price: 1899,
    image: '/api/placeholder/400/400',
    category: 'pants',
    rating: 4.4,
    isNew: true,
    isSale: false
  },
  {
    id: '8',
    name: 'Two Piece Suit',
    price: 8999,
    originalPrice: 11999,
    image: '/api/placeholder/400/400',
    category: 'suits',
    rating: 4.9,
    isNew: false,
    isSale: true
  },
  {
    id: '9',
    name: 'Traditional Dhoti Set',
    price: 1599,
    image: '/api/placeholder/400/400',
    category: 'lowers',
    rating: 4.6,
    isNew: true,
    isSale: false
  }
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-primary-dark/80 max-w-2xl mx-auto">
            Discover our handpicked selection of premium ethnic wear, crafted with traditional
            techniques and modern comfort in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-block bg-secondary-brown text-primary-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-brown transition-colors duration-300 shadow-lg"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
