"use client";
import { useState,useEffect } from "react";
import API from "../../services/api";
import Navbar from "@/components/Navbar";

export default function Cart(){
    const [items,setItems]=useState([]);
    const [showCheckout, setShowCheckout] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        
        API.get(`/cart?user_id=${user.id}`)
        .then(res => setItems(res.data))
        .catch(err => {
            console.error("Error fetching cart:", err);
            alert("Failed to load cart");
        });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const checkout = async (e) => {
        e.preventDefault();

        try {
        const user = JSON.parse(localStorage.getItem("user"));

        await API.post("/orders", {
            user_id: user.id,
            ...form,
        });

        alert("Order placed successfully 🎉");
        setItems([]);
        setShowCheckout(false);

        } catch(err) {
        console.error(err);
        alert("Checkout failed");
        }
    };

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,0
    );

    const updateQuantity = async (id, newQty) => {
        try {
            if (newQty < 1) {
                await API.delete(`/cart/items/${id}`);

                setItems((prev) => prev.filter((item) => item.id !== id));
                return;
            }
            await API.put(`/cart/items/${id}`, {
                quantity: newQty,
            });
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, quantity: newQty } : item
                )
            );
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update quantity");
        }
    };

    const removeItem = async (id) => {
        try {
            await API.delete(`/cart/items/${id}`);
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Remove error:", err);
            alert("Failed to remove item");
        }
    };

    return(
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6">My Cart</h2>
                {items.length === 0 ? (
                <p className="text-center text-gray-500">
                    Your cart is empty
                </p>
                ) : (
                <div className="space-y-4">

                    {items.map((i) => (
                    <div
                        key={i.id}
                        className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                    >
                        <div>
                        <p className="font-semibold text-gray-800">{i.name}</p>

                        
                        <div className="flex items-center gap-3 mt-2">
                            <button
                            onClick={() => updateQuantity(i.id, i.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                            -
                            </button>

                            
                            <span className="font-medium">{i.quantity}</span>
                            <button
                            onClick={() => updateQuantity(i.id, i.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                            +
                            </button>

                        </div>
                        <button
                        onClick={() => removeItem(i.id)}
                        className="mt-2 text-red-500 text-sm hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                    <p className="font-bold text-blue-600">
                    {i.price * i.quantity}
                    </p>

                </div>
                ))}
                <div className="mt-6 bg-white p-6 rounded-lg shadow flex justify-between items-center">
                    <h3 className="text-xl font-semibold">
                        Total: ₹{total}
                    </h3>

                    <button
                        onClick={()=>setShowCheckout(true)}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                    >
                        Buy Now
                    </button>
                </div>
                {showCheckout && (
                    <form
                    onSubmit={checkout}
                    className="bg-white p-6 rounded-lg shadow space-y-4"
                    >
                        <h3 className="text-lg font-bold">Delivery Details</h3>

                        <input name="name" placeholder="Full Name" className="w-full p-3 border rounded" onChange={handleChange} required />
                        <input name="phone" placeholder="Phone" className="w-full p-3 border rounded" onChange={handleChange} required />

                        <input name="address_line1" placeholder="Address Line 1" className="w-full p-3 border rounded" onChange={handleChange} required />
                        <input name="address_line2" placeholder="Address Line 2 (Optional)" className="w-full p-3 border rounded" onChange={handleChange} />

                        <input name="city" placeholder="City" className="w-full p-3 border rounded" onChange={handleChange} required />
                        <input name="state" placeholder="State" className="w-full p-3 border rounded" onChange={handleChange} required />
                        <input name="pincode" placeholder="Pincode" className="w-full p-3 border rounded" onChange={handleChange} required />

                        <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg"
                        >
                        Place Order
                        </button>
                    </form>
                )}

            </div>
            )}
        </div>
    </div>
  );
}