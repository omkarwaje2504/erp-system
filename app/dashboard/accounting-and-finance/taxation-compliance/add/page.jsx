"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, XCircle, FileText, Calendar, Coins, ClipboardList } from "lucide-react";
import InputField from "@/components/InputField";

export default function GenerateTaxReport() {
  const [form, setForm] = useState({
    reportType: "",
    period: "",
    amount: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("tax-report-data");
    if (stored) {
      setForm(JSON.parse(stored));
      localStorage.removeItem("tax-report-data");
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
      const res = await fetch("/api/tax-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/dashboard/accounting-and-finance/taxation-compliance");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit tax report");
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
              onClick={() => router.push("/dashboard/accounting-and-finance/taxation-compliance")}
              className="hover:underline flex items-center"
            >
              Taxation Compliance
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Generate Report</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/accounting-and-finance/taxation-compliance")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Generate Tax Report
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={20} />
            Tax Report Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter the required information for tax reporting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="reportType"
                  value={form.reportType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="GST">GST</option>
                  <option value="VAT">VAT</option>
                  <option value="Sales Tax">Sales Tax</option>
                </select>
                <ClipboardList className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reporting Period <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="period"
                  value={form.period}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="">Select Period</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputField
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  placeholder="Enter tax amount"
                  icon={<Coins className="absolute left-3 top-2.5 text-gray-400" size={18} />}
                />
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
                  <option value="">Select Status</option>
                  <option value="filed">Filed</option>
                  <option value="pending">Pending</option>
                </select>
                <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/accounting-and-finance/taxation-compliance")}
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
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}