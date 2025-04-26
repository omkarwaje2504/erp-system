"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Save, XCircle, Calendar, Package, Layers } from "lucide-react";

export default function AddStockAllocation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    batchNo: "",
    production: "",
    materials: "",
    status: "",
    description: "",
    productId: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/item-and-pricing");
        const data = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const stocks = localStorage.getItem("stocks");
    if (stocks) {
      const parsedStocks = JSON.parse(stocks);
      setFormData(parsedStocks);
      setIsEdit(true);
    }
    localStorage.removeItem("stocks");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : "",
      };

      await fetch("/api/stock-allocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      
      router.push("/dashboard/stock-inventory/stock-allocation");
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 w-full mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600 hidden md:block">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard/stock-inventory/stock-allocation")}
              className="hover:underline flex items-center"
            >
              Stock Allocation
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            {isEdit ? "Edit" : "Add"} Stock Allocation
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/stock-inventory/stock-allocation")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {isEdit ? "Edit" : "Add"} Stock Allocation
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Package className="mr-2" size={20} />
            Batch Information
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter the details for the stock allocation batch
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleChange}
                required
                placeholder="Enter batch number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Production Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="production"
                value={formData.production}
                onChange={handleChange}
                required
                placeholder="Enter production line"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Materials <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                required
                placeholder="Enter materials used"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.productId})
                    </option>
                  ))}
                </select>
                <Layers className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description of this batch allocation"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/stock-inventory/stock-allocation")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <XCircle size={18} className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save size={18} className="mr-2" />
              {loading ? "Saving..." : "Save Allocation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}