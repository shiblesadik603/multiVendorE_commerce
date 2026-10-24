"use client";

import Link from 'next/link';
import { MOCK_PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  // Mock Categories based on your layout reference
  const categories = [
    { name: 'Oil & Ghee', icon: '🏺', count: '12 Items' },
    { name: 'Organic Foods', icon: '🌿', count: '24 Items' },
    { name: 'Pure Honey', icon: '🍯', count: '8 Items' },
    { name: 'Natural Dates', icon: '🌴', count: '15 Items' },
    { name: 'Spices & Herbs', icon: '🌶️', count: '30 Items' },
    { name: 'Nuts & Seeds', icon: '🥜', count: '18 Items' },
    { name: 'Beverages', icon: '🫖', count: '10 Items' },
    { name: 'Premium Rice', icon: '🌾', count: '14 Items' },
  ];

  // Grab the first 4 products to display as top sellers
  const topProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      
      {/* 1. Hero / Promotional Banner Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Big Banner */}
        <div className="lg:col-span-2 bg-linear-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-md">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              100% Organic Marketplace
            </span>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">
              Quality Products For Everyones Health & Home
            </h1>
            <p className="text-amber-100 text-sm sm:text-base">
              Explore trusted independent vendors offering farm-fresh goods, pure honey, and authentic organic items.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-sm shadow hover:bg-amber-50 transition"
              >
                Shop Collection Now
              </Link>
            </div>
          </div>
          {/* Decorative Background Blob */}
          <div className="absolute right-0 bottom-0 opacity-10 text-9xl font-bold select-none pointer-events-none">
            🛒
          </div>
        </div>

        {/* Side Promo Card */}
        <div className="bg-linear-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md border border-stone-700">
          <div className="space-y-3">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Featured Deal</span>
            <h2 className="text-2xl font-bold">Wild Organic Honey Collection</h2>
            <p className="text-stone-400 text-sm">Harvested directly from protected forests. Certified 100% pure.</p>
          </div>
          <div className="pt-6">
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Explore Deal</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
          <Link href="/products" className="text-sm font-semibold text-blue-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href="/products"
              className="bg-white border border-gray-200/80 rounded-xl p-4 text-center hover:shadow-md hover:border-blue-500 transition group flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Top Selling Products Section (Integrated with MOCK_PRODUCTS & ProductCard) */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Top Selling Products</h2>
          <Link href="/products" className="text-sm font-semibold text-blue-600 hover:underline">
            Browse Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}