"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import AdminSidebar from "@/components/AdminSidebar";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  };

  
  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);

      
      setProducts((prev) => prev.filter((p) => p.id !== id));

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      
      <AdminSidebar />

      
      <div className="flex-1 p-6">

        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>

          <button
            onClick={() => router.push("/admin/products/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </button>
        </div>

        
        {products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            
            <div className="grid grid-cols-5 bg-gray-100 p-4 font-semibold text-gray-700">
              <span>ID</span>
              <span>Name</span>
              <span>Price</span>
              <span>Image</span>
              <span>Actions</span>
            </div>

            
            {products.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-5 p-4 border-t items-center"
              >
                <span>#{p.id}</span>

                <span className="font-medium">{p.name}</span>

                <span className="text-blue-600 font-semibold">
                  ₹{p.price}
                </span>

                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-12 h-12 object-cover rounded"
                />

                <div className="flex gap-3">

                  <button
                    onClick={() => router.push(`/admin/products/edit/${p.id}`)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}