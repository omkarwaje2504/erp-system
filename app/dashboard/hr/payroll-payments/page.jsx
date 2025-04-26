"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaDownload,
  FaFileInvoice,
  FaSearch,
  FaUser,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { Info, X, ArrowRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PayrollPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, payrollRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/payslip"),
      ]);

      if (!usersRes.ok || !payrollRes.ok) throw new Error("Data fetch failed");

      const usersData = await usersRes.json();
      const payrollData = await payrollRes.json();

      const filteredEmployees =
        usersData.users?.filter((user) => user.role === "employee") || [];
      setEmployees(filteredEmployees);
      setPayrollData(payrollData.payslips || []);
    } catch (err) {
      setError("Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayslips = async () => {
    try {
      const res = await fetch("/api/payslip/generate-all", { method: "POST" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Error generating payslips:", err);
    }
  };

  const handleDownloadPayslip = (payroll) => {
    const { employee, basicSalary, deductions, bonuses, netSalary, date } =
      payroll;
    const doc = new jsPDF();

    // Set default styles
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Company Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Clan India Lifestyle ERP", 15, 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "123 Business Street\nTech City, TC 45678\nTel: (555) 123-4567",
      15,
      25
    );

    // Payslip Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PAYSLIP", 150, 15, { align: "right" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Date: ${new Date(date).toLocaleDateString()}`, 150, 20, {
      align: "right",
    });
    doc.text(`Payslip ID: #${payroll.id}`, 150, 25, { align: "right" });

    // Employee Information
    doc.setFont("helvetica", "bold");
    doc.text("Employee Details:", 15, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${employee.name}`, 15, 50);
    doc.text(`Employee ID: ${employee.employeeId}`, 15, 55);
    doc.text(`Position: ${employee.position}`, 15, 60);
    doc.text(`Department: ${employee.department}`, 15, 65);

    // Salary Breakdown Table
    const headers = [["Description", "Amount (₹)"]];
    const data = [
      ["Basic Salary", formatCurrency(basicSalary)],
      ["Overtime/Bonus", formatCurrency(bonuses)],
      ["Deductions", `-${formatCurrency(deductions)}`],
      ["Net Salary", formatCurrency(netSalary)],
    ];

    autoTable(doc, {
      startY: 75,
      head: [["Description", "Amount (₹)"]],
      body: [
        ["Basic Salary", formatCurrency(basicSalary)],
        ["Overtime/Bonus", formatCurrency(bonuses)],
        ["Deductions", `-${formatCurrency(deductions)}`],
        ["Net Salary", formatCurrency(netSalary)]
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255 
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 60, halign: 'right' }
      }
    });
  

    // Payment Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary:", 15, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(`Net Payable: ₹${formatCurrency(netSalary)}`, 15, finalY + 5);
    doc.text(`Payment Method: Direct Deposit`, 15, finalY + 10);
    doc.text(`Bank Account: •••• 6789`, 15, finalY + 15);

    // Footer
    doc.setFontSize(8);
    doc.text(
      "This is a computer-generated document that requires no signature.",
      15,
      280
    );
    doc.text(
      "For queries contact: payroll@techcorp.com | Tel: (555) 123-4567 Ext. 789",
      15,
      285
    );

    // Security Features
    doc.setFontSize(6);
    doc.setTextColor(200);
    doc.text(`Confidential - ${employee.employeeId}`, 190, 290, {
      align: "right",
    });

    // Watermark
    doc.setGState(new doc.GState({ opacity: 0.07 }));
    doc.setFontSize(48);
    doc.setTextColor(200);
    doc.text("Clan India Lifestyle ERP", 45, 150, { angle: 45 });

    // Save PDF
    doc.save(`${employee.name.replace(" ", "_")}_Payslip_${date}.pdf`);
  };

  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.includes(searchTerm) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayslips = payrollData.filter(
    (payslip) =>
      payslip.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.employee.employeeId.includes(searchTerm)
  );

  const renderEmployeeCard = (employee) => {
    const payroll = payrollData.find((p) => p.employeeId === employee.id);
    return (
      <div key={employee.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold">{employee.name}</h3>
            <p className="text-sm text-gray-600">{employee.employeeId}</p>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              payroll
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {payroll ? payroll.payslipStatus : "Pending"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <p className="text-gray-500">Department</p>
            <p className="font-medium">{employee.department}</p>
          </div>
          <div>
            <p className="text-gray-500">Position</p>
            <p className="font-medium">{employee.position}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {payroll ? (
            <button
              onClick={() => {
                localStorage.setItem("payslipData", JSON.stringify(payroll));
                router.push("/dashboard/hr/payroll-payments/edit-payslip");
              }}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md flex items-center"
            >
              <FaFileInvoice className="mr-2" /> Edit Payslip
            </button>
          ) : (
            <button
              onClick={() => alert("Generate individual payslip feature")}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-md flex items-center"
            >
              <FaMoneyCheckAlt className="mr-2" /> Generate
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPayslipCard = (payslip) => (
    <div key={payslip.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{payslip.employee.name}</h3>
          <p className="text-sm text-gray-600">{payslip.employee.employeeId}</p>
        </div>
        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
          {payslip.id}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-gray-500">Net Salary</p>
          <p className="font-medium">₹{payslip.netSalary}</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <p
            className={`font-medium ${
              payslip.payslipStatus === "Paid"
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {payslip.payslipStatus}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleDownloadPayslip(payslip)}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md flex items-center"
        >
          <FaDownload className="mr-2" /> Download
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full max-w-full mx-auto">
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
          <li className="font-semibold flex items-center">
            Payroll & Payments
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Payroll Management
        </h1>

        <div className="w-full md:w-auto flex gap-4 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={handleGeneratePayslips}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaFileInvoice className="mr-2" /> Generate All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : (
        <>
          {/* Employees Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Employee List
            </h2>
            <div className="md:hidden">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(renderEmployeeCard)
              ) : (
                <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                  No employees found
                </div>
              )}
            </div>
            <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => {
                      const payroll = payrollData.find(
                        (p) => p.employeeId === employee.id
                      );
                      return (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {employee.name}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {employee.employeeId}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {employee.department}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {employee.position}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                payroll
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {payroll ? payroll.payslipStatus : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {payroll ? (
                              <button
                                onClick={() => {
                                  localStorage.setItem(
                                    "payslipData",
                                    JSON.stringify(payroll)
                                  );
                                  router.push(
                                    "/dashboard/hr/payroll-payments/edit-payslip"
                                  );
                                }}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                              >
                                Edit
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  alert("Generate individual payslip feature")
                                }
                                className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200"
                              >
                                Generate
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payslips Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaMoneyCheckAlt className="mr-2 text-green-600" /> Generated
              Payslips
            </h2>
            <div className="md:hidden">
              {filteredPayslips.length > 0 ? (
                filteredPayslips.map(renderPayslipCard)
              ) : (
                <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                  No payslips generated
                </div>
              )}
            </div>
            <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto mt-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payslip ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayslips.length > 0 ? (
                    filteredPayslips.map((payslip) => (
                      <tr key={payslip.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          #{payslip.id}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">
                              {payslip.employee.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {payslip.employee.employeeId}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          ₹{payslip.basicSalary}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          ₹{payslip.deductions}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          ₹{payslip.netSalary}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              payslip.payslipStatus === "Paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {payslip.payslipStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDownloadPayslip(payslip)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No payslips generated
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modals for detailed views */}
      {/* Add similar modals as in previous examples for detailed views */}
    </div>
  );
}
