"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();

  // Empty State
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart is Empty</h1>
          <p className="text-sm text-gray-500">Looks like you haven&apos;t added anything to your cart yet.</p>
        </div>
        <div>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-blue-500/25 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">Review your items before proceeding to checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-sm font-extrabold text-gray-900">${Number(item.price).toFixed(2)}</p>
                </div>
              </div>

              {/* Quantity controls & Remove */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-600 transition p-2 cursor-pointer"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Order Summary</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Shipping</span>
              <span className="font-bold text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => alert("Checkout flow simulation successful!")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-500/25 transition cursor-pointer"
          >
            Proceed to Checkout
          </button>

          <Link
            href="/products"
            className="block text-center text-xs font-bold text-gray-500 hover:text-gray-800 transition"
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>

    </div>
  );
}