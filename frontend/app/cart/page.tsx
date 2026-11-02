"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, CartItem } from "../../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [isMounted] = useState(true);

  if (!isMounted) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-gray-400 text-2xl font-bold">
          🛒
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="text-sm text-gray-500">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/products" className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">Review your items before proceeding to checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 px-4 py-2 rounded-xl transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: CartItem) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                <p className="text-sm font-extrabold text-blue-600">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-2 border border-gray-200 rounded-xl px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                >
                  -
                </button>
                <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-600 p-2 transition"
                title="Remove Item"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Order Summary</h2>

          <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Shipping</span>
              <span className="font-bold text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-extrabold text-gray-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm shadow-lg shadow-blue-500/25 transition"
          >
            Proceed to Checkout
          </Link>

          <div className="text-center">
            <Link href="/products" className="text-xs font-bold text-gray-500 hover:text-gray-800">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}