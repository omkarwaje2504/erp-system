"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddStockAllocation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    batchNo: "",
    production: "",
    materials: "",
    status: "",
    description: "",
    productId: "", // New field for selecting product
  });
  const [products, setProducts] = useState([]); // To store products fetched from API

  useEffect(() => {
    // Fetch the list of products
    const fetchProducts = async () => {
      const res = await fetch("/api/item-and-pricing"); // Assuming '/api/products' returns a list of products
      const data = await res.json();
      setProducts(data || []);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const stocks = localStorage.getItem("stocks");
    if (stocks) {
      const parsedStocks = JSON.parse(stocks);
      setFormData(parsedStocks);
    }
    localStorage.removeItem("stocks");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the date is in a valid ISO-8601 format (this should happen by default with a date input)
    const formattedData = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : "", // Convert date to ISO string
    };

    await fetch("/api/stock-allocation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData), // Send formatted data
    });
    router.push("/dashboard/stock-inventory/stock-allocation");
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Add Stock Allocation
      </h1>

      <form
        className="p-6 rounded-lg shadow-md space-y-6 bg-white"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batch No
          </label>
          <input
            type="text"
            name="batchNo"
            value={formData.batchNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Production
          </label>
          <input
            type="text"
            name="production"
            value={formData.production}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material
          </label>
          <input
            type="text"
            name="materials"
            value={formData.materials}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Product
          </label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.productId})
              </option>
            ))}
          </select>
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
            <option value="">Select Status</option>
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
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
