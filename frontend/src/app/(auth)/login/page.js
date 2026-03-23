"use client";
import { useState } from "react";
import {useRouter } from "next/navigation";
import API from "@/services/api";

export default function Login(){
    const router=useRouter();

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/auth/login", { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            
            if (user.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/products");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert(err.response?.data?.error || "Login failed");
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">
                        QuickCart
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Buy your favorite products easily and quickly
                    </p>
                </div>
        
                <form onSubmit={handleLogin} className="space-y-4">

                    <div>
                        
                        <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full mt-1 h-14 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>

                    <div>
                        
                        <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Sign In
                    </button>

                </form>

        
                <div className="flex items-center my-6">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>

        
                <button
                onClick={() => router.push("/register")}
                className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                    Create an Account
                </button>
            </div>
        </div>
    );
}


