"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    employeeId: "",
    email: "",
    password: "",
    department: "sales",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  
    const data = await response.json();
    if (response.ok) {
      alert("User registered successfully!");
      router.push("/");
    } else {
      alert(data.error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-center text-lg font-semibold">Sign Up</h2>
        <form className="mt-6" onSubmit={handleSignup}>
          {["name", "address", "phone", "employeeId", "email", "password"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-gray-700 text-sm mb-1 capitalize">
                {field.replace("Id", " ID")}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={`Enter ${field}`}
                value={form[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200"
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
