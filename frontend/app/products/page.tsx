"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock product catalog data (matching Day 6 task requirements)[cite: 3]
  const products = [
    { id: 1, name: 'Organic Wild Forest Honey 500g', price: '$24.00', category: 'Honey', rating: 4.8, seller: 'GreenValley Store' },
    { id: 2, name: 'Cold Pressed Pure Mustard Oil 1L', price: '$15.50', category: 'Oil & Ghee', rating: 4.6, seller: 'Organic Farms' },
    { id: 3, name: 'Premium Sundried Medjool Dates 1kg', price: '$32.00', category: 'Dates', rating: 4.9, seller: 'Desert Harvest' },
    { id: 4, name: 'Handcrafted Organic Spice Blend', price: '$12.00', category: 'Spices', rating: 4.7, seller: 'SpiceMaster' },
    { id: 5, name: 'Organic Cashew Nuts 500g', price: '$18.00', category: 'Nuts & Seeds', rating: 4.5, seller: 'NutriBulk' },
    { id: 6, name: 'Natural Herbal Green Tea 250g', price: '$9.50', category: 'Beverages', rating: 4.8, seller: 'TeaCorner' },
  ];

  // Filter products based on search input
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      
      {/* Header & Live Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-500">Explore items from our verified independent vendors</p>
        </div>
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">By {product.seller}</span>
              </div>
              <div className="h-44 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 font-semibold group-hover:bg-orange-50/50 transition">
                📦 Product Preview
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center space-x-1 text-amber-500 text-sm my-1.5">
                <span>★</span>
                <span className="font-medium text-gray-700">{product.rating}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
              <span className="text-lg font-extrabold text-gray-900">{product.price}</span>
              <Link
                href="/cart"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:from-amber-600 hover:to-orange-600 transition shadow-sm shadow-orange-500/20"
              >
                Add to Cart
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">No products found matching your search.</p>
        </div>
      )}

      {/* Subtle Fade-In & Slide Animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}