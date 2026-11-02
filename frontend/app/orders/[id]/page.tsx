"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

function OrderDetailContent() {
  const params = useParams();
  const orderId = params?.id || "ORD-2026-001";

  // Mock details for the specific order
  const order = {
    id: orderId,
    date: "May 15, 2026",
    status: "Shipped" as const, // Steps: Pending -> Processing -> Shipped -> Delivered
    shippingAddress: {
      fullName: "John Doe",
      phone: "+880 1700000000",
      address: "House 12, Road 5, Block C",
      city: "Dhaka",
      postalCode: "1216",
    },
    items: [
      {
        id: 1,
        title: "Smart Fitness Tracker Watch",
        price: 129.00,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      },
    ],
    subtotal: 258.00,
    shippingFee: 0.00,
    total: 258.00,
  };

  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order {order.id}</h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Placed on {order.date}</p>
        </div>
        <Link
          href="/orders"
          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition"
        >
          ← Back to Orders
        </Link>
      </div>

      {/* Status Timeline Tracker */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-extrabold text-gray-900">Order Status Timeline</h2>
        <div className="relative flex items-center justify-between max-w-2xl mx-auto py-4">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step} className="flex flex-col items-center relative z-10 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <span className={`text-xs font-bold mt-2 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
            );
          })}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-6 z-0 mx-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ordered Items */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-gray-900">Ordered Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <span className="text-sm font-extrabold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">Delivery Address</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
              <p className="pt-1 text-gray-500">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">Payment Summary</h3>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-400">Loading order details...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}