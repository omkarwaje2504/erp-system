"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  useEffect(() => {
    // Get payslip data from localStorage
    const storedPayslip = localStorage.getItem("payslipData");

    if (storedPayslip) {
      const payslip = JSON.parse(storedPayslip);
      setFormData({
        basicSalary: payslip.basicSalary,
        deductions: payslip.deductions,
        bonuses: payslip.bonuses,
        netSalary: payslip.netSalary,
        payslipStatus: payslip.payslipStatus,
      });
      setLoading(false);
    } else {
      setError("No payslip data found");
      setLoading(false);
    }
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/payslip", {
        method: "PUT", // Sending the data via PUT for update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: formData.employeeId, // Make sure the employee ID is part of the formData
          basicSalary: parseFloat(formData.basicSalary),
          deductions: parseFloat(formData.deductions),
          bonuses: parseFloat(formData.bonuses),
          netSalary: parseFloat(formData.netSalary),
          payslipStatus: formData.payslipStatus,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("Payslip updated successfully!");
        router.push("/dashboard/hr/payroll-payments"); // Redirect back to the payroll page
      } else {
        alert(data.error || "Error updating payslip");
      }
    } catch (err) {
      alert("Error saving payslip");
    }
  };
  

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Payslip</h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Edit Payslip</h2>

          {/* Payslip Edit Form */}
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Basic Salary</label>
              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deductions</label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bonuses/Incentives</label>
              <input
                type="number"
                name="bonuses"
                value={formData.bonuses}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Net Salary</label>
              <input
                type="number"
                name="netSalary"
                value={formData.netSalary}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Payslip Status</label>
              <select
                name="payslipStatus"
                value={formData.payslipStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Payslip
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
