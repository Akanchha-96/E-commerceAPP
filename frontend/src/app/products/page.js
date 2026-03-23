"use client";
import { useState,useEffect } from "react";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";
import Navbar from "@/components/Navbar";

export default function Products(){
    const [products,setProducts]=useState([]);

    useEffect(() => {
        API.get("/products")
        .then((res) => {
            console.log("API DATA:", res.data);
            setProducts(res.data);
        })
        .catch((err) => console.error(err));
    }, []);

    const addtocart=async(id)=>{
        const user=JSON.parse(localStorage.getItem("user"));

        await API.post("/cart/items",{
            user_id:user.id,
            product_id:id,
            quantity:1
        });
        alert("Added to cart");
    };
    return(
        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <h2 className="text-2xl font-bold px-6 py-4">Products</h2>
            <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {products.map((p) => (
                    <ProductCard
                    key={p.id}
                    product={p}
                    onAdd={addtocart}
                    />
                ))}

            </div>

        </div>
    );
}