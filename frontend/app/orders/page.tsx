"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  itemsCount: number;
}

export default function OrdersPage() {
  // Mock order history for frontend development
  const [orders] = useState<Order[]>([
    {
      id: "ORD-2026-001",
      date: "May 15, 2026",
      total: 3999.00,
      status: "Shipped",
      itemsCount: 2,
    },
    {
      id: "ORD-2026-002",
      date: "May 18, 2026",
      total: 199.99,
      status: "Processing",
      itemsCount: 1,
    },
  ]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">View your order history and track active shipments.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            📦
          </div>
          <h2 className="text-lg font-bold text-gray-900">No orders found</h2>
          <p className="text-sm text-gray-500">You havent placed any orders yet.</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-gray-900">{order.id}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Placed on {order.date} • {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-400 block uppercase font-bold">Total Amount</span>
                  <span className="text-base font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-bold px-5 py-2.5 rounded-xl text-xs transition border border-gray-200 hover:border-blue-200"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}