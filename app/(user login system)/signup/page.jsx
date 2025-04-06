"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

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
    role: "employee",
    position: "",
    salary: "",
  });

    useEffect(() => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        router.push(`/${JSON.parse(userData).department}-dashboard`);
      }
    }, []);

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
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-gray-50">
      <div className="rounded-lg shadow-md max-w-xl">
        <div className="w-full">
          <img
            src="./erp-banner-signup.jpg"
            alt="erp-banner-signup"
            className="w-full"
          />
        </div>
        <h2 className="text-center text-2xl font-semibold mt-4">
          Create your new account
        </h2>
        <div className="mt-1 text-center">
          <a href="/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </a>
        </div>
        <form className="mt-6 p-2" onSubmit={handleSignup}>
          <div className="bg-white shadow-sm inset-shadow-2xs p-4 rounded-xl">
            <h3 className="mb-3 text-lg underline underline-offset-1 font-semibold">
              Information Section
            </h3>
            {["name", "address", "phone"].map((field) => (
              <InputField
                key={field}
                label={field.replace("Id", " ID")}
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={`Enter ${field}`}
                value={form[field]}
                onChange={handleChange}
              />
            ))}
          </div>

          <div className="bg-white p-4 rounded-xl mt-4 shadow-sm inset-shadow-2xs ">
            <h3 className="mb-3 text-lg underline underline-offset-1 font-semibold">
              Credential Section
            </h3>
            {["employeeId", "email", "password"].map((field) => (
              <InputField
                key={field}
                label={field.replace("Id", " ID")}
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={`Enter ${field}`}
                value={form[field]}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* Department Dropdown */}
          <div className="bg-white p-4 rounded-xl my-4 shadow-sm inset-shadow-2xs ">
            <h3 className="mb-3 text-lg underline underline-offset-1 font-semibold">
              Department Section
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="sales">Sales</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
                <option value="finance">Finance</option>
                <option value="inventory">Inventory</option>
                <option value="production">Production</option>
                <option value="support">Support</option>
              </select>
            </div>

            {/* Role Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {/* Position */}
            <InputField
              label="Position"
              type="text"
              name="position"
              placeholder="Enter position"
              value={form.position}
              onChange={handleChange}
            />

            {/* Salary */}
            <InputField
              label="Salary"
              type="number"
              name="salary"
              placeholder="Enter salary"
              value={form.salary}
              onChange={handleChange}
            />
          </div>
          {/* Submit Button */}
          <Button type="submit" label="Sign Up" />
        </form>
      </div>
    </div>
  );
}
