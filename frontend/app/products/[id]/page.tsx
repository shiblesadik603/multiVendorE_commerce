"use client";

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_PRODUCTS } from '../../../data/products';

// Inner component that safely consumes useParams
function ProductDetailContent() {
  const params = useParams();
  
  const rawId = params?.id;
  const productId = Number(Array.isArray(rawId) ? rawId[0] : rawId);
  
  const product = MOCK_PRODUCTS.find((p) => Number(p.id) === productId);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'seller'>('description');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
        <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="inline-block bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl shadow hover:bg-orange-600 transition">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    alert(`Successfully added ${quantity} x "${product.title}" to your cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 flex items-center space-x-2">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-orange-500">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Product Image Showcase */}
        <div className="relative h-96 sm:h-[480px] w-full bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            className="object-cover"
          />
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10">
            {product.category}
          </span>
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-orange-500 tracking-wider">Verified Vendor Product</span>
              <span className="flex items-center text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full">
                ★ {product.rating} / 5.0 Rating
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500">
              Sold by <span className="font-bold text-gray-800">{product.seller}</span>
            </p>
          </div>

          {/* Price & Stock status */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400 block font-semibold">Price</span>
              <span className="text-3xl font-black text-gray-900">${product.price.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-gray-400 block font-semibold">Availability</span>
              <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                🟢 In Stock (25 units available)
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-gray-900 text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              Add to Cart — ${(product.price * quantity).toFixed(2)}
            </button>
          </div>

        </div>
      </div>

      {/* Tabbed Additional Info Section */}
      <div className="border-t border-gray-100 pt-10 space-y-6">
        <div className="flex space-x-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'description'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Detailed Specifications
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'seller'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            About the Seller ({product.seller})
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-600 leading-relaxed">
          {activeTab === 'description' ? (
            <div className="space-y-3">
              <p><strong>Product ID:</strong> #{product.id}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Quality Assurance:</strong> Sourced directly from verified multi-vendor marketplace partners with rigorous freshness and safety standards.</p>
              <p>{product.description}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p><strong>Seller Name:</strong> {product.seller}</p>
              <p><strong>Rating:</strong> ★ {product.rating} / 5.0</p>
              <p>Partnered with our multi-vendor platform to bring you authentic, premium-grade items with fast and reliable fulfillment.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Main page component wrapped in Suspense to satisfy Next.js 16 requirements
export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500 font-medium">Loading product details...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}