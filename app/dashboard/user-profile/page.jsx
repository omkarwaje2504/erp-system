"use client";

import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function UserProfileEdit() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    employeeId: "",
    email: "",
    password: "",
    department: "",
    role: "",
    position: "",
    salary: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setForm(JSON.parse(userData));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
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
    <div className="min-h-screen flex flex-col  py-10 w-full">
      <div className="w-full lg:p-6 rounded-lg">
        <div className="flex justify-between w-full border-b ">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Edit Your Profile
        </h2>
        <Button type="submit" label="Save Changes"  className="h-fit" onClick={handleSave}/>
        </div>
        <form className="flex flex-wrap w-full space-y-6">
          {/* Info Section */}
          <div className=" w-full lg:w-1/2 p-4 shadow-md">
            <h3 className="text-lg font-semibold underline mb-3">
              Information
            </h3>
            {["name", "address", "phone"].map((field) => (
              <InputField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type="text"
                name={field}
                value={form[field] ?? ""}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* Credentials */}
          <div className=" w-full lg:w-1/2 p-4 shadow-md">
            <h3 className="text-lg font-semibold underline mb-3">
              Credentials
            </h3>
            {["employeeId", "email", "password"].map((field) => (
              <InputField
                key={field}
                label={
                  field === "employeeId"
                    ? "Employee ID"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                type={field === "password" ? "password" : "text"}
                name={field}
                value={form[field] ?? ""}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* Department, Role, Position, Salary */}
          <div className=" w-full lg:w-1/2 p-4 shadow-md">
            <h3 className="text-lg font-semibold underline mb-3">
              Work Details
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Department
              </label>
              <select
                name="department"
                value={form.department ?? ""}
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

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Role</label>
              <select
                name="role"
                value={form.role ?? ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <InputField
              label="Position"
              type="text"
              name="position"
              value={form.position ?? ""}
              onChange={handleChange}
            />

            <InputField
              label="Salary"
              type="number"
              name="salary"
              value={form.salary ?? ""}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
