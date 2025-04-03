"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import { FaSave } from "react-icons/fa";

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
    <div className="pb-6 w-full">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() =>
                router.push("/dashboard/accounting-and-finance")
              }
              className="hover:underline flex items-center"
            >
              Accounting & Finance
            </button>
          </li>
          <li>/</li>
          <li
            className="hover:underline hover:cursor-pointer"
            onClick={() =>
              router.push("/dashboard/accounting-and-finance/invoicing-billing-transactions")
            }
          >
            Invoicing, Billing & Transactions
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">Create Invoice</h1>
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
            label="Invoice Number"
            name="invoiceNumber"
            value={form.invoiceNumber}
            onChange={handleChange}
            required
          />
          <InputField
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <InputField
            label="Customer/Vendor Name"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            required
          />
          <InputField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <InputField
            label="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-sm text-gray-700">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="sales">Sales</option>
                <option value="purchase">Purchase</option>
              </select>
            </div>
           
          </div>
        </form>
      )}
    </div>
  );
}