"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddPurchaseRequest() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    supplier: "",
    item: "",
    quantity: 0,
    status: "Pending",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const storedData = localStorage.getItem("order");
    if (storedData) {
      const data = JSON.parse(storedData);
      // Set current date if not provided in stored data
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        ...data,
        date: data.date || today
      });
      localStorage.removeItem("order");
    }
  }, []); // Added dependency array to run only once on mount
  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Ensure the date is in ISO-8601 format
    const formattedDate = new Date(formData.date).toISOString(); 

    const res = await fetch("/api/purchase-request-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        date: formattedDate,  // Pass formatted date
        type: "purchaseRequestOrder",  // type to distinguish the request
      }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Purchase Request added successfully");
      router.push("/dashboard/stock-inventory/procurement-supplier-management");
    } else {
      setError(data.error || "Something went wrong. Please try again.");
    }
  } catch (err) {
    setError("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 w-full">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard/stock-inventory")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            Procurement & Supplier Management
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            Add Purchase Request
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Add Purchase Request
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date ? formData.date.split('T')[0] : new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item
          </label>
          <input
            type="text"
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
