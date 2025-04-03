"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import { FaSave } from "react-icons/fa";

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
    <div className="pb-6 w-full">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:underline flex items-center"
            >
              Dashboard
            </button>
          </li>
          <li>/</li>
          <li
            className="font-semibold flex items-center hover:underline hover:cursor-pointer"
            onClick={() => router.push("/dashboard/taxation")}
          >
            Taxation
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Generate</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Generate Tax Report
        </h1>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <FaSave className="pr-1" /> Save
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <form className="space-y-4 bg-white p-6 shadow rounded">
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Report Type
            </label>
            <select
              name="reportType"
              value={form.reportType}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="GST">GST</option>
              <option value="VAT">VAT</option>
              <option value="Sales Tax">Sales Tax</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Period
            </label>
            <select
              name="period"
              value={form.period}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Period</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <InputField
            label="Tax Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Status (Filed, Pending)
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="filed">Filed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </form>
      )}
    </div>
  );
}
