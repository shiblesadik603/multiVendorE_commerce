"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MOCK_PRODUCTS, Product } from '../../data/products';
import ProductCard from '../../components/ProductCard';

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial filter values from URL query parameters
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') || 'featured';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);

  useEffect(() => {
    // Simulate a network fetch delay to demonstrate loading & skeleton states
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Extract unique categories from mock data
  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)))];

  // Update URL query parameters whenever filters change
  const updateQueryParams = (newSearch: string, newCategory: string, newSort: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newCategory && newCategory !== 'All') params.set('category', newCategory);
    if (newSort && newSort !== 'featured') params.set('sort', newSort);

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  };

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateQueryParams(value, selectedCategory, sortBy);
  };

  // Handle Category Change
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateQueryParams(searchQuery, category, sortBy);
  };

  // Handle Sort Change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    updateQueryParams(searchQuery, selectedCategory, value);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    router.push(pathname, { scroll: false });
  };

  // Filtering & Sorting Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // 'featured' / default
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Explore Products</h1>
        <p className="text-sm text-gray-500 mt-1">Browse quality items from verified multi-vendor sellers.</p>
      </div>

      {/* Search, Filter & Sort Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products, vendors, or descriptions..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">Categories:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      {/* Results Count & Active Filters feedback */}
      {!isLoading && (
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
          <span>Showing <strong>{sortedProducts.length}</strong> results</span>
          {(searchQuery || selectedCategory !== 'All' || sortBy !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="text-orange-600 hover:underline font-bold cursor-pointer"
            >
              Clear all filters ✕
            </button>
          )}
        </div>
      )}

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
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product, index) => (
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
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <div className="text-4xl">📦</div>
          <h3 className="text-lg font-bold text-gray-800">No matching products found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query or category filters to find what you are looking for.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow transition cursor-pointer"
          >
            Reset Filters
          </button>
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

// Main page wrapper with Suspense boundary for Next.js 16 compliance
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500 font-medium">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}