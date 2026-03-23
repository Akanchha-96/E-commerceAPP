"use client";
import { useEffect, useState } from "react";
import API from "@/services/api";
import Navbar from "@/components/Navbar";

export default function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    API.get(`/orders?user_id=${user.id}`)
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error("Error fetching orders:", err);
        alert("Failed to load orders");
      });
  }, []);

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
  }
    

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        <h2 className="text-2xl font-bold mb-6">
          My Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">
            No orders yet
          </p>
        ) : (
          <div className="space-y-4">

            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white p-5 rounded-xl shadow"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <p className="font-semibold text-lg">
                      Order #{o.id}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Total: ₹{o.total_amount}
                    </p>
                  </div>

                  
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
                      o.status
                    )}`}
                  >
                    {o.status}
                  </span>

                </div>

                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Delivery Address:</p>

                  <p>{o.shipping_name}</p>
                  <p>{o.shipping_phone}</p>

                  <p>
                    {o.shipping_address_line1}
                    {o.shipping_address_line2 && `, ${o.shipping_address_line2}`}
                  </p>

                  <p>
                    {o.shipping_city}, {o.shipping_state} - {o.shipping_pincode}
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}