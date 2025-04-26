"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, XCircle, FileText, Calendar, User, ClipboardList, DollarSign } from "lucide-react";
import InputField from "@/components/InputField";

export default function AddInvoice() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: "",
    date: "",
    customerName: "",
    description: "",
    amount: "",
    type: "sales",
    status: "Pending",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("invoice-data");
    if (storedData) {
      setForm(JSON.parse(storedData));
      localStorage.removeItem("invoice-data");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/accounting-and-finance/invoicing-billing-transactions");
      } else {
        alert(data.error || "Failed to submit invoice");
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
              onClick={() => router.push("/dashboard/accounting-and-finance")}
              className="hover:underline flex items-center"
            >
              Accounting & Finance
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Create Invoice</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/accounting-and-finance/invoicing-billing-transactions")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create New Invoice
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Invoice Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter the billing information and transaction details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputField
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={handleChange}
                  required
                  placeholder="INV-0001"
                  icon={<ClipboardList className="absolute left-3 top-2.5 text-gray-400" size={18} />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputField
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  icon={<Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer/Vendor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputField
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Enter name"
                  icon={<User className="absolute left-3 top-2.5 text-gray-400" size={18} />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputField
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  icon={<DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="sales">Sales</option>
                  <option value="purchase">Purchase</option>
                </select>
                <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
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
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <ClipboardList className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Additional details about the invoice"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/accounting-and-finance/invoicing-billing-transactions")}
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
              {loading ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}