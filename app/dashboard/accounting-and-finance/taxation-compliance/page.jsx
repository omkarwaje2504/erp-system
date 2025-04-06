"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TaxationCompliancePage() {
  const [taxReports, setTaxReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [fiscalYear, setFiscalYear] = useState("2023-24");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportRes = await fetch("/api/tax-reports");
        const reportData = await reportRes.json();
        setTaxReports(reportData.reports || []);
        
        // Calculate Audit Trail based on the fetched reports
        const generatedAuditLogs = reportData.reports.map(report => {
          return {
            action: `Filing Report: ${report.reportType}`,
            user: "System",
            timestamp: report.createdAt,
          };
        });
        setAuditLogs(generatedAuditLogs);
        
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Tax Audit Calculation based on Reports
  const totalTax = taxReports.reduce((sum, r) => sum + r.amount, 0);
  const pendingCount = taxReports.filter((r) => r.status === "pending").length;
  const nextFilingDue = taxReports.find((r) => r.status === "pending")?.period || "N/A";

  const barChartData = {
    labels: taxReports.map((r) => r.period),
    datasets: [
      {
        label: "Tax Collected",
        data: taxReports.map((r) => r.amount),
        backgroundColor: "#4B5563",
      },
    ],
  };

  const downloadPDF = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Tax Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Report Type: ${report.reportType}`, 20, 40);
    doc.text(`Period: ${report.period}`, 20, 50);
    doc.text(`Tax Amount: ₹${report.amount}`, 20, 60);
    doc.text(`Status: ${report.status}`, 20, 70);
    doc.save(`TaxReport-${report.period}.pdf`);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Taxation & Compliance
      </h1>

      {/* GST / VAT Reports Section */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            GST / VAT Reports & Filing
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
              <option value="2021-22">2021-22</option>
            </select>
            <button
              onClick={() => router.push("/dashboard/accounting-and-finance/taxation-compliance/add")}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Generate Tax Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-100 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Total Tax Collected</p>
            <p className="text-xl font-bold">₹{totalTax}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Pending Tax Filings</p>
            <p className="text-xl font-bold">{pendingCount}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Next Filing Due</p>
            <p className="text-xl font-bold">{nextFilingDue}</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Report Type</th>
              <th className="p-2 text-left">Period</th>
              <th className="p-2 text-left">Tax Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            {taxReports.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{r.reportType}</td>
                <td className="p-2">{r.period}</td>
                <td className="p-2">₹{r.amount}</td>
                <td className="p-2 capitalize">{r.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => downloadPDF(r)}
                    className="text-blue-600 hover:underline"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sales Tax Compliance Report Chart */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Sales Tax & Compliance Reports
        </h2>
        <div className="bg-gray-100 p-4 rounded text-sm mb-4">
          Bar Graph: Showing tax amounts collected per month
        </div>
        <div className="max-w-2xl mx-auto">
          <Bar data={barChartData} />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Invoice Number</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Tax Type</th>
                <th className="p-2 text-left">Tax Amount</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {taxReports.map((r, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2">INV{1000 + idx}</td>
                  <td className="p-2">{r.period}</td>
                  <td className="p-2">{r.reportType}</td>
                  <td className="p-2">₹{r.amount}</td>
                  <td className="p-2">Paid</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Audit Trail for Financial Records
        </h2>
        <div className="bg-gray-100 p-4 rounded text-sm mb-4">
          Timeline View: Shows recent tax-related activities (e.g., tax filings, modifications)
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Action Taken</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.user}</td>
                <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
