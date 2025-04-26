"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, XCircle, User, Package, Hash, IndianRupee, ClipboardList } from "lucide-react";
import InputField from "@/components/InputField";

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
    setForm(prev => ({ ...prev, [name]: value }));
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
              onClick={() => router.push("/dashboard/sales-crm")}
              className="hover:underline flex items-center"
            >
              Sales CRM
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">New Sales Order</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/sales-crm/selling/sales-orders")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create Sales Order
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ClipboardList className="mr-2" size={20} />
            Order Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter customer order information and transaction details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Customer Name"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              required
              icon={<User className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Product"
              name="product"
              value={form.product}
              onChange={handleChange}
              required
              icon={<Package className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              required
              icon={<Hash className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Price (₹)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              icon={<IndianRupee className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <ClipboardList className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/sales-crm/selling/sales-orders")}
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
              {loading ? "Saving..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}