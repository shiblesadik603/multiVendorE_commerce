"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate saving the new product (in a real app, this would be an API call)
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect back to the seller dashboard product list
      router.push('/dashboard/products');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeInUp">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new listing for your marketplace storefront.</p>
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
            placeholder="e.g., Wireless Noise-Canceling Headphones"
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
              placeholder="99.99"
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
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
          <p className="text-[11px] text-gray-400">Provide a direct image link for your product thumbnail.</p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Description</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed description of your product features and specifications..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing Product...' : 'Publish Product'}
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