"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>

        {users.map(u => (
          <div key={u.id} className="bg-white p-4 mb-3 rounded shadow">
            <p>{u.name}</p>
            <p className="text-gray-500">{u.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}