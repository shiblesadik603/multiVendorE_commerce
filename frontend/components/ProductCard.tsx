"use client";

import Image from 'next/image';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = () => {
    alert(`Added "${product?.title || 'Item'}" to cart!`);
  };

  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      
      {/* Product Image & Category Badge */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
          {product.category}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col grow space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
          <span>By {product.seller}</span>
          <span className="flex items-center text-amber-500 font-bold">
            ★ {product.rating}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-orange-500 transition-colors">
          {product.title}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Actions */}
        <div className="pt-3 mt-auto flex items-center justify-between border-t border-gray-100">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">Price</span>
            <span className="text-base sm:text-lg font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm shadow-orange-500/20 cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}