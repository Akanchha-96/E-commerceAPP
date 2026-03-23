"use client";
import { useState } from "react";
import {useRouter } from "next/navigation";
import API from "@/services/api";

export default function Register(){
    const router=useRouter();
    const [form,setForm]=useState({
        "name":"",
        "email":"",
        "password":""
    });


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered!");
      router.push("/login");
    } catch (err) {
      console.error("Register error:", err);
      alert("Registration failed");
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">
                        QuickCart
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        New User? Register here!!!!
                    </p>
                </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input 
            placeholder="Name" 
            className="w-full mt-1 h-14 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e)=>setForm({...form,name:e.target.value})} 
            />
          </div> 
          <div>
            <input 
            placeholder="Email" 
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e)=>setForm({...form,email:e.target.value})} 
            />
          </div> 
          <div>
            <input 
            type="password" 
            placeholder="Password" 
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e)=>setForm({...form,password:e.target.value})} 
            />
          </div>
          
          <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
                    
            <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        
        <button 
        className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
        onClick={() => router.push("/login")}>
          Already an User? Login
        </button>
      </div>
    </div>
  );
}