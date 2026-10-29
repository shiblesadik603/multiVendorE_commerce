"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_PRODUCTS, Product } from '../../../data/products';

export default function SellerProductsPage() {
  // Local state for products to allow interactive archive/delete simulation
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Active' | 'Archived'>('ALL');

  // Handle archive toggle (simulation)
  const handleToggleArchive = (id: number | string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'Archived' ? 'Active' : 'Archived';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const filteredProducts = products.filter((p) => {
    if (filterStatus === 'Active') return p.status !== 'Archived';
    if (filterStatus === 'Archived') return p.status === 'Archived';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeInUp">
      
      {/* Page Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Seller Inventory Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your stores active listings, pricing, and stock levels.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/20 text-sm transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          + Add New Product
        </Link>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {(['ALL', 'Active', 'Archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === status
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status} Listings
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500 font-medium px-2">
          Total Products: <strong>{products.length}</strong>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const isArchived = product.status === 'Archived';
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition">
                      
                      {/* Product Thumbnail & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative h-14 w-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{product.title}</p>
                            <p className="text-xs text-gray-400">ID: #{product.id} • {product.seller}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-black text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>

                      {/* Stock Status */}
                      <td className="py-4 px-6">
                        {isArchived ? (
                          <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                            ⚫ Archived
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                            🟢 Active (In Stock)
                          </span>
                        )}
                      </td>

                      {/* Actions (Edit / Archive) */}
                      <td className="py-4 px-6 text-right space-x-3">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="text-xs font-bold text-blue-600 hover:underline bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleArchive(product.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                            isArchived
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          }`}
                        >
                          {isArchived ? 'Restore' : 'Archive'}
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-500">
                    <p className="font-medium text-base">No listings found in this filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Keyframes Animation Support */}
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