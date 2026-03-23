"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "ADMIN") {
      router.push("/login");
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        API.get("/products"),
        API.get("/orders"),
        API.get("/users"),
      ]);

      const products = productsRes.data.length;
      const orders = ordersRes.data.length;
      const users = usersRes.data.length;

      const revenue = ordersRes.data.reduce(
        (sum, o) => sum + Number(o.total_amount),
        0
      );

      setStats({ products, orders, users, revenue });

    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <AdminSidebar />

      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">
          Dashboard
        </h1>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

          <div
            onClick={() => router.push("/admin/products")}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg hover:scale-105 transition"
          >
            <p className="text-gray-500">Products</p>
            <h2 className="text-2xl font-bold">{stats.products}</h2>
          </div>

          <div
            onClick={() => router.push("/admin/orders")}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg hover:scale-105 transition"
          >
            <p className="text-gray-500">Orders</p>
            <h2 className="text-2xl font-bold">{stats.orders}</h2>
          </div>

          <div
            onClick={() => router.push("/admin/users")}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg hover:scale-105 transition"
          >
            <p className="text-gray-500">Users</p>
            <h2 className="text-2xl font-bold">{stats.users}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Revenue</p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹{stats.revenue}
            </h2>
          </div>

        </div>

        
        

      </div>
    </div>
  );
}