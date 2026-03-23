"use client";

export default function ProductCard({ product, onAdd }) {

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">

      
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      
      <div className="p-4 space-y-2">

        <h2 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h2>

        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>

        <p className="text-blue-600 font-bold text-lg">
          ₹{product.price}
        </p>

        <button
          onClick={() => onAdd(product.id)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}