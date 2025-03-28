"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { FaSave } from "react-icons/fa";

export default function AddSalesOrder() {
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    quantity: "",
    product: "",
    price: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("product-data");
    if (storedData) {
      setForm(JSON.parse(storedData));
      localStorage.removeItem("product-data");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/sales-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: parseInt(form.quantity),
          price: parseFloat(form.price),
        }),
      });

      if (response.ok) {
        router.push("/dashboard/sales-crm/selling/sales-orders");
      } else {
        alert("Failed to save order");
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-6 w-full mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:underline flex items-center"
            >
              Dashboard
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() =>
                router.push("/dashboard/sales-crm/selling/sales-orders")
              }
              className="hover:underline flex items-center"
            >
              Sales Orders
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add Sales Order</li>
        </ol>
      </nav>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Create New Sales Order
        </h1>
        <Button
          type="button"
          onClick={handleSubmit}
          className="!w-fit bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          isLoading={loading}
          label={
            <>
              <FaSave />
              Save Order
            </>
          }
        />
      </div>

      <form className="p-6 rounded-lg shadow-md space-y-6 bg-white">
        {/* Customer Name */}
        <InputField
          label="Customer Name"
          name="customerName"
          type="text"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Enter customer name"
          required
        />

        {/* Product Text Field */}
        <InputField
          label="Product"
          name="product"
          type="text"
          value={form.product}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />

        {/* Quantity and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            min="1"
            required
          />
          <InputField
            label="Price (₹)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </form>
    </div>
  );
}
