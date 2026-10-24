"use client";

import { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, Product } from '../../data/products';
import ProductCard from '../../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a network fetch delay to demonstrate loading & skeleton states
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Explore Products</h1>
        <p className="text-sm text-gray-500 mt-1">Browse quality items from verified multi-vendor sellers.</p>
      </div>

      {/* Conditional Rendering: Loading Skeleton vs Loaded Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 rounded-xl w-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              style={{ 
                animation: `fadeInUp 0.6s ease-out ${index * 0.07}s forwards`,
                opacity: 0 
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Smooth Staggered Slide-Up Keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}