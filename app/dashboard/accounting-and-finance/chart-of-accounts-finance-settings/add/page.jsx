"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  XCircle,
  BookOpen,
  Landmark,
  Coins,
  ClipboardList,
} from "lucide-react";
import InputField from "@/components/InputField";

export default function AddChartOfAccount() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    balance: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    const stored = localStorage.getItem("chart-of-account-data");
    if (stored) {
      setForm(JSON.parse(stored));
      localStorage.removeItem("chart-of-account-data");
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
      const res = await fetch("/api/chart-of-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(
          "/dashboard/accounting-and-finance/chart-of-accounts-finance-settings"
        );
      } else {
        alert(data.error || "Failed to save account");
      }
    } catch (err) {
      console.error("Submit Error:", err);
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
          <li className="font-semibold flex items-center">Create Account</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              router.push(
                "/dashboard/accounting-and-finance/chart-of-accounts-finance-settings"
              )
            }
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create New Account
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <BookOpen className="mr-2" size={20} />
            Account Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Configure financial account parameters and settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputField
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter account name"
                  icon={
                    <ClipboardList
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expense</option>
                </select>
                <Landmark
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <ChevronLeft
                  className="absolute right-3 top-2.5 text-gray-400 transform rotate-270"
                  size={18}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Balance
              </label>
              <div className="relative">
                <InputField
                  name="balance"
                  type="number"
                  value={form.balance}
                  onChange={handleChange}
                  placeholder="0.00"
                  icon={
                    <Coins
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <BookOpen
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <ChevronLeft
                  className="absolute right-3 top-2.5 text-gray-400 transform rotate-270"
                  size={18}
                />
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
              placeholder="Enter account description"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/accounting-and-finance/chart-of-accounts-finance-settings"
                )
              }
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
              {loading ? "Saving..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
