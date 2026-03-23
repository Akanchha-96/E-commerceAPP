"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "../../../../../services/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function EditProduct() {

  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock_quantity: ""
  });

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => {
        setForm({
          name: res.data.name,
          price: res.data.price,
          stock_quantity: res.data.stock_quantity
        });
      });
  }, [id]);

  const handleUpdate = async () => {

    await API.put(`/products/admin/products/edit/${id}`, form);

    alert("Updated");
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar/>
      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">
          Edit Product
        </h1>

        <div className="max-w-2xl bg-white p-6 rounded-xl shadow">

          <form onSubmit={handleUpdate} className="space-y-4">
            <input 
              name="name"
              placeholder="Product Name"
              value={form.name}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={(e)=>setForm({...form,name:e.target.value})}
              required
            />
            <input 
              name="price"
              type="number"
              placeholder="Price"
              value={form.price} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e)=>setForm({...form,price:e.target.value})}
              required
            />
            <input 
              name="stock_quantity"
              type="number"
              placeholder="Stock quantity"
              value={form.stock_quantity} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e)=>setForm({...form,stock_quantity:e.target.value})}
              required
            />

            <div className="flex gap-4">

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Update Product
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