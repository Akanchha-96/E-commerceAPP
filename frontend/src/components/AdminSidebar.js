"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className="w-64 min-h-screen bg-white shadow-md p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">
        Admin Panel
      </h2>

      <nav className="flex flex-col gap-4 text-gray-700 font-medium">

        <Link 
        href="/admin/dashboard"
        className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
          Dashboard
        </Link>
        <Link 
        href="/admin/products/create"
        className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
          Create Product
        </Link>
        <Link 
        href="/admin/orders"
        className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
          Orders
        </Link>
      </nav>
    </div>
  );
}