"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import { FaSave } from "react-icons/fa";

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chart-of-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/accounting-and-finance/chart-of-accounts-finance-settings");
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
    <div className="pb-6 w-full">

      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard/accounting-and-finance")}
              className="hover:underline flex items-center"
            >
              Accounting & Finance
            </button>
          </li>
          <li>/</li>
          <li
            className="hover:underline hover:cursor-pointer"
            onClick={() => router.push("/dashboard/accounting-and-finance/chart-of-accounts-finance-settings")}
          >
            Chart of Accounts
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add</li>
        </ol>
      </nav>


      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Create Account
        </h1>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <FaSave className="pr-1" />
          Save
        </button>
      </div>


      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <form className="space-y-4 bg-white p-6 shadow rounded">
          <InputField
            label="Account Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Type (Asset, Liability, Revenue, Expense)
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Revenue">Revenue</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <InputField
            label="Balance"
            name="balance"
            type="number"
            value={form.balance}
            onChange={handleChange}
          />
          <InputField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </form>
      )}
    </div>
  );
}