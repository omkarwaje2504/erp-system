"use client";

import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch employee data and payroll data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        // Filter employees with role 'employee'
        const filteredEmployees = data.users.filter(
          (user) => user.role === "employee"
        );

        setEmployees(filteredEmployees || []);

        // Fetch the payroll data for the filtered employees
        const payrollRes = await fetch("/api/payslip");
        const payrollData = await payrollRes.json();
        setPayrollData(payrollData.payslips || []);
      } catch (err) {
        setError("Error fetching employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to generate payslips for all employees
  const handleGeneratePayslips = async () => {
    try {
      const res = await fetch("/api/payslip/generate-all", {
        method: "POST",
      });

      if (res.ok) {
        fetchData();
      } else {
        console.log("Error generating payslips");
      }
    } catch (err) {
      console.log("Error generating payslips");
    }
  };

  const handleDownloadPayslip = (payroll) => {
    const { employee, basicSalary, deductions, bonuses, netSalary } = payroll;

    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Add content to the PDF
    doc.text(`Payslip for: ${employee.name} (${employee.employeeId})`, 10, 10);
    doc.text(`Department: ${employee.department}`, 10, 20);
    doc.text(`Position: ${employee.position}`, 10, 30);
    doc.text(`Basic Salary: ₹${basicSalary}`, 10, 40);
    doc.text(`Deductions: ₹${deductions}`, 10, 50);
    doc.text(`Bonuses/Incentives: ₹${bonuses}`, 10, 60);
    doc.text(`Net Salary: ₹${netSalary}`, 10, 70);

    // Save the generated PDF
    doc.save(`${employee.name}_Payslip.pdf`);
  };



  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Payroll & Payments
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          {/* Generate Payslips for All Employees Button */}
          <div className="mt-4">
            <button
              onClick={handleGeneratePayslips}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Generate Payslips for All Employees
            </button>
          </div>

          {/* Employee List Table */}
          <div className="mb-8 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Employee List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-center">Employee Name</th>
                    <th className="p-2 text-center">Employee ID</th>
                    <th className="p-2 text-center">Department</th>
                    <th className="p-2 text-center">Position</th>
                    <th className="p-2 text-center">Role</th>
                    <th className="p-2 text-center">Payslip Status</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => {
                    const payroll = payrollData.find(
                      (payroll) => payroll.employeeId === employee.id
                    );
                    return (
                      <tr key={employee.id}>
                        <td className="p-2 text-center">{employee.name}</td>
                        <td className="p-2 text-center">
                          {employee.employeeId}
                        </td>
                        <td className="p-2 text-center">
                          {employee.department}
                        </td>
                        <td className="p-2 text-center">{employee.position}</td>
                        <td className="p-2 text-center">{employee.role}</td>
                        <td className="p-2 text-center">
                          {payroll ? payroll.payslipStatus : "Not Generated"}
                        </td>
                        <td className="p-2 text-center">
                          {payroll ? (
                            <button
                              onClick={() => {
                                router.push(
                                  "/dashboard/hr/payroll-payments/edit-payslip"
                                );
                                localStorage.setItem(
                                  "payslipData",
                                  JSON.stringify(payroll)
                                );
                              }}
                              className="text-blue-600 hover:underline"
                            >
                              Edit Payslip
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                alert("Generate Payslip for this employee!")
                              }
                              className="text-green-600 hover:underline"
                            >
                              Generate Payslip
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generated Payslips Table */}
          <div className="mb-8 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Generated Payslips</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-center">Employee Name</th>
                    <th className="p-2 text-center">Payslip ID</th>
                    <th className="p-2 text-center">Basic Salary</th>
                    <th className="p-2 text-center">Deductions</th>
                    <th className="p-2 text-center">Bonuses/Incentives</th>
                    <th className="p-2 text-center">Net Salary</th>
                    <th className="p-2 text-center">Payslip Status</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((payroll) => (
                    <tr key={payroll.id}>
                      <td className="p-2 text-center">
                        {payroll.employee.name}
                      </td>
                      <td className="p-2 text-center">{payroll.id}</td>
                      <td className="p-2 text-center">
                        ₹{payroll.basicSalary}
                      </td>
                      <td className="p-2 text-center">₹{payroll.deductions}</td>
                      <td className="p-2 text-center">₹{payroll.bonuses}</td>
                      <td className="p-2 text-center">₹{payroll.netSalary}</td>
                      <td className="p-2 text-center">
                        {payroll.payslipStatus}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={()=>handleDownloadPayslip(payroll)}
                          className="text-blue-600 hover:underline"
                        >
                          Download Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
