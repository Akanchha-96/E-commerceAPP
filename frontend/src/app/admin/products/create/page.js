"use client";

import { useState,useEffect } from "react";
import API from "../../../../services/api";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function CreateProduct() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    image_url: ""
  });

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (!user || user.role !== "ADMIN") {
        router.push("/login");
      }
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/products/admin/products/create", form);

    alert("Product created");
    router.push("/admin/dashboard");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">
          Create Product
        </h1>

        <div className="max-w-2xl bg-white p-6 rounded-xl shadow">

          <form onSubmit={handleSubmit} className="space-y-4">

            
            <input
              name="name"
              placeholder="Product Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              required
            />

            
            <textarea
              name="description"
              placeholder="Description"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              rows="3"
              required
            />

            
            <div className="grid grid-cols-2 gap-4">

              <input
                name="price"
                type="number"
                placeholder="Price"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange}
                required
              />

              <input
                name="stock_quantity"
                type="number"
                placeholder="Stock Quantity"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange}
                required
              />

            </div>

            
            <input
              name="image_url"
              placeholder="Image URL"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            />

            
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            )}

            
            <div className="flex gap-4">

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Create Product
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/products")}
                className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}