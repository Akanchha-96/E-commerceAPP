"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Error fetching orders:", err);
        alert("Failed to load orders");
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
        await API.put(`/orders/${id}/status`, { status });

        setOrders(prev =>
            prev.map(o =>
                o.id === id ? { ...o, status } : o
            )
        );
    } catch (err) {
        alert("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-600";
      case "SHIPPED":
        return "bg-yellow-100 text-yellow-600";
      case "DELIVERED":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100">

      
      <AdminSidebar />

      
      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            
            <div className="grid grid-cols-4 bg-gray-100 p-4 font-semibold text-gray-700">
              <span>Order ID</span>
              <span>User ID</span>
              <span>Total</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {orders.map((o) => (
              <div
                key={o.id}
                className="grid grid-cols-4 p-4 border-t items-center"
              >
                <span>#{o.id}</span>
                <span>{o.user_id}</span>

                <span className="font-semibold text-blue-600">
                  ₹{o.total_amount}
                </span>

                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full w-fit ${getStatusStyle(
                    o.status
                  )}`}
                >
                  {o.status || "CREATED"}
                </span>
                <div className="flex gap-2">

                  <button
                    onClick={() => updateStatus(o.id, "CONFIRMED")}
                    className="text-blue-500 text-sm hover:underline"
                    disabled={o.status === "CONFIRMED"}
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(o.id, "SHIPPED")}
                    className="text-yellow-500 text-sm hover:underline"
                    disabled={o.status === "SHIPPED"}
                  >
                    Ship
                  </button>

                  <button
                    onClick={() => updateStatus(o.id, "DELIVERED")}
                    className="text-green-500 text-sm hover:underline"
                    disabled={o.status === "DELIVERED"}
                  >
                    Deliver
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