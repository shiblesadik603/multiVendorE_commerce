"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string>("Customer");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  // Mock recent orders preview
  const recentOrders = [
    {
      id: "ORD-2026-001",
      date: "May 15, 2026",
      total: 3999.00,
      status: "Shipped",
    },
    {
      id: "ORD-2026-002",
      date: "May 18, 2026",
      total: 199.99,
      status: "Processing",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="border-b border-gray-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile, shipping addresses, and view order history.</p>
        </div>
        <span className="w-fit text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
          Role: {isMounted ? userRole : "Customer"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Recent Orders Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">Recent Orders</h2>
              <Link href="/orders" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">{order.id}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Placed on {order.date}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                    >
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Profile & Addresses */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">Profile Information</h3>
            <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <p><strong className="text-gray-900">Name:</strong> John Doe</p>
              <p><strong className="text-gray-900">Email:</strong> buyer@multivendor.com</p>
              <p><strong className="text-gray-900">Account Type:</strong> {isMounted ? userRole : "Customer"}</p>
            </div>
          </div>

          {/* Shipping Addresses Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-gray-900">Saved Address</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800">Edit</button>
            </div>
            <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <p className="font-bold text-gray-900">Primary Address</p>
              <p>House 12, Road 5, Block C</p>
              <p>Dhaka - 1216</p>
              <p className="pt-1 text-gray-500">Phone: +880 1700000000</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}