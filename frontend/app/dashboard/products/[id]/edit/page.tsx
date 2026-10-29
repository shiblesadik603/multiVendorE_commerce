"use client";

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '../../../../../data/products';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  // Find the product once during initial render
  const foundProduct = MOCK_PRODUCTS.find((p) => String(p.id) === String(productId));

  // Initialize form state directly from foundProduct
  const [title, setTitle] = useState(foundProduct?.title || '');
  const [price, setPrice] = useState(foundProduct ? String(foundProduct.price) : '');
  const [category, setCategory] = useState(foundProduct?.category || 'Electronics');
  const [description, setDescription] = useState(foundProduct?.description || '');
  const [image, setImage] = useState(foundProduct?.image || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!foundProduct) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-gray-500 font-medium">Product not found.</p>
        <Link href="/dashboard/products" className="text-orange-500 font-bold hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate saving the updated product
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard/products');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeInUp">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Product #{productId}</h1>
          <p className="text-sm text-gray-500 mt-1">Update your listing information, pricing, or description.</p>
        </div>
        <Link
          href="/dashboard/products"
          className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Product Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        {/* Price & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Decor">Home & Decor</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Accessories">Accessories</option>
              <option value="AI & Digital Assets">AI & Digital Assets</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Image URL</label>
          <input
            type="url"
            required
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Description</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>

      </form>

      {/* Animation Support */}
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
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

    </div>
  );
}