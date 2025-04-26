"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, XCircle, Wallet, MinusCircle, PlusCircle, Banknote, BadgeDollarSign } from "lucide-react";

export default function EditPayslipPage() {
  const [formData, setFormData] = useState({
    basicSalary: "",
    deductions: "",
    bonuses: "",
    netSalary: "",
    payslipStatus: "Pending",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedPayslip = localStorage.getItem("payslipData");
    if (storedPayslip) {
      const payslip = JSON.parse(storedPayslip);
      setFormData({
        ...payslip,
        netSalary: calculateNetSalary(payslip.basicSalary, payslip.deductions, payslip.bonuses)
      });
      setLoading(false);
    } else {
      setError("No payslip data found");
      setLoading(false);
    }
  }, []);

  const calculateNetSalary = (basic, deductions, bonuses) => {
    return (parseFloat(basic) + parseFloat(bonuses) - parseFloat(deductions)).toFixed(2);
  };

  const handleChange = (e) => {
    const newData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    
    if (["basicSalary", "deductions", "bonuses"].includes(e.target.name)) {
      newData.netSalary = calculateNetSalary(
        newData.basicSalary || 0,
        newData.deductions || 0,
        newData.bonuses || 0
      );
    }
    
    setFormData(newData);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/payslip", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basicSalary: parseFloat(formData.basicSalary),
          deductions: parseFloat(formData.deductions),
          bonuses: parseFloat(formData.bonuses),
          netSalary: parseFloat(formData.netSalary),
        })
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/hr/payroll-payments");
      } else {
        alert(data.error || "Error updating payslip");
      }
    } catch (err) {
      alert("Error saving payslip");
    } finally {
      setSaving(false);
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
              onClick={() => router.push("/dashboard/hr")}
              className="hover:underline flex items-center"
            >
              HR Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Edit Payslip</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/hr/payroll-payments")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Edit Payslip
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Wallet className="mr-2" size={20} />
            Salary Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Update employee compensation and payment status
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600 font-medium">{error}</div>
        ) : (
          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic Salary <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <BadgeDollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deductions
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <MinusCircle className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonuses/Incentives
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="bonuses"
                    value={formData.bonuses}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <PlusCircle className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Net Salary
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="netSalary"
                    value={formData.netSalary}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    disabled
                  />
                  <Banknote className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payslip Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="payslipStatus"
                    value={formData.payslipStatus}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                  <Wallet className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push("/dashboard/hr/payroll-payments")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <XCircle size={18} className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save size={18} className="mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}