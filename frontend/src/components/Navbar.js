"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  // const logout = () => {
  //   localStorage.clear();
  //   router.push("/login");
  // };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6 text-gray-700 font-medium">

        <Link href="/products" className="hover:text-blue-600 transition">
          Products
        </Link>

        <Link href="/cart" className="hover:text-blue-600 transition">
          Cart 
        </Link>

        <Link href="/orders" className="hover:text-blue-600 transition">
          Orders
        </Link>
      </div>
    </nav>
  );
}