"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStaff() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    designation: "",
    department: "",
    salary: "",
    dateOfJoining: "",
    terminationDate: "",
    documentUrl: "",
  });

  const router = useRouter();

useEffect(()=>{
    const staffData = localStorage.getItem("staff-data");
    if (staffData) {
        const staff = JSON.parse(staffData);
        setForm({
        name: staff.name || "",
        contact: staff.contact || "",
        address: staff.address || "",
        designation: staff.designation || "",
        department: staff.department || "",
        salary: staff.salary || "",
        dateOfJoining: staff.dateOfJoining || "",
        terminationDate: staff.terminationDate || "",
        documentUrl: staff.documentUrl || "",
        });
        localStorage.removeItem("staff-data");
    }
})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/staffs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/hr/staff-management");
      } else {
        alert(data.error || "Failed to add staff");
      }
    } catch (err) {
      console.error("Error adding staff:", err);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Staff</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border"
          required
        />
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact"
          className="w-full p-2 border"
          required
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          placeholder="Designation"
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          className="w-full p-2 border"
        />
        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full p-2 border"
        />
        <input
          type="date"
          name="dateOfJoining"
          value={form.dateOfJoining}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          type="date"
          name="terminationDate"
          value={form.terminationDate}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          type="file"
          name="documentUrl"
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
