"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.address.trim()) newErrors.address = "Street address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Order placed successfully! Thank you for your purchase.");
      clearCart();
      router.push("/products");
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="text-sm text-gray-500">You need items in your cart to proceed with checkout.</p>
        <Link href="/products" className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Provide your delivery details to complete your order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.fullName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500/20"
                }`}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXXXXXXXX"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500/20"
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="1216"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.postalCode ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500/20"
                  }`}
                />
                {errors.postalCode && <p className="text-xs text-red-500 mt-1 font-medium">{errors.postalCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House 12, Road 5, Block C"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.address ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500/20"
                }`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1 font-medium">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Dhaka"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.city ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500/20"
                }`}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1 font-medium">{errors.city}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm shadow-lg shadow-blue-500/25 transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Processing Order..." : `Place Order ($${subtotal.toFixed(2)})`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Order Summary</h2>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="48px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-bold text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}