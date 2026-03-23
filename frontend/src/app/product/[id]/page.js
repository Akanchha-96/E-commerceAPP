"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../services/api";

export default function ProductDetails() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data));
  }, [id]);

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    await API.post("/cart/items", {
      user_id: user.id,
      product_id: product.id,
      quantity: 1
    });

    alert("Added to cart");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>{product.name}</h2>

      <img src={product.image_url} width="200" />

      <p>{product.description}</p>
      <p> {product.price}</p>

      <button onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  );
}
