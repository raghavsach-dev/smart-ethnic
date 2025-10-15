import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative text-cream py-20 px-4 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/70 to-accent-brown/90 z-10"></div>

      {/* Content */}
      <div className="relative z-20 container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-secondary-brown">
          Premium Men's Ethnic Wear
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-cream/90 max-w-3xl mx-auto">
          Discover authentic traditional clothing that blends heritage with modern comfort.
          Elevate your style with our curated collection of premium ethnic wear.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-secondary-brown text-primary-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cream transition-colors duration-300 shadow-lg"
          >
            Shop Collection
          </Link>
          <Link
            href="/categories"
            className="border-2 border-secondary-brown text-secondary-brown px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-brown hover:text-primary-dark transition-colors duration-300"
          >
            Browse Categories
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-cream/20 rounded-full z-20"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-secondary-brown/30 rounded-full z-20"></div>
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-secondary-brown/20 rounded-full z-20"></div>
      <div className="absolute top-1/3 right-20 w-8 h-8 bg-cream/30 rounded-full z-20"></div>
    </section>
  );
}
