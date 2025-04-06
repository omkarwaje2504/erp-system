"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegEye } from "react-icons/fa";
import jsPDF from "jspdf";
import { Bar, Line } from "recharts";
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FinancialOverviewPage() {
  const [taxReports, setTaxReports] = useState([]);
  const [taxCategories, setTaxCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [pendingPayments, setPendingPayments] = useState({});
  const [completedPayments, setCompletedPayments] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taxRes, accountRes, costCenterRes, revenueRes, cashFlowRes, paymentRes] = await Promise.all([
          fetch("/api/tax-reports"),
          fetch("/api/chart-of-accounts"),
          fetch("/api/cost-centers"),
          fetch("/api/sales-orders"),
          fetch("/api/payments"),
          fetch("/api/payments"),
        ]);

        const taxData = await taxRes.json();
        const accountData = await accountRes.json();
        const costCenterData = await costCenterRes.json();
        const revenueData = await revenueRes.json();
        const cashFlowData = await cashFlowRes.json();
        const paymentData = await paymentRes.json();

        setTaxReports(taxData.reports || []);
        setTaxCategories(taxData.categories || []);
        setAccounts(accountData.accounts || []);
        setCostCenters(costCenterData.centers || []);
        setRevenueData(revenueData.data || []);
        setCashFlowData(cashFlowData.data || []);
        setPendingPayments(paymentData.pending || {});
        setCompletedPayments(paymentData.completed || {});
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Total Revenue calculation (assuming tax reports represent revenue)
  const totalRevenue = taxReports.reduce((sum, r) => sum + r.amount, 0);

  // Total Expenses calculation (if tax reports have expense data)
  const totalExpenses = taxReports.reduce((sum, r) => sum + (r.expenses || 0), 0);

  // Net Profit/Loss calculation
  const netProfitLoss = totalRevenue - totalExpenses;

  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue Trends",
        data: revenueData,
        backgroundColor: "#4B5563",
      },
    ],
  };

  const cashFlowChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Cash Flow",
        data: cashFlowData,
        borderColor: "#16A34A", // Green for positive cash flow
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Financial Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Revenue: ₹${totalRevenue}`, 20, 40);
    doc.text(`Total Expenses: ₹${totalExpenses}`, 20, 50);
    doc.text(`Net Profit/Loss: ₹${netProfitLoss}`, 20, 60);
    doc.save(`FinancialReport-${new Date().toISOString()}.pdf`);
  };

  const outstandingReceivables = pendingPayments.amount || 0;
  const pendingInvoices = pendingPayments.pendingCount || 0;

  const outstandingPayables = completedPayments.amount || 0;
  const paidInvoices = completedPayments.pendingCount || 0;

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Financial Overview & Reports</h1>

      {/* Profit & Loss Summary */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profit & Loss Summary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-600 text-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold">₹{totalRevenue}</p>
          </div>
          <div className="bg-red-600 text-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-1">Total Expenses</h3>
            <p className="text-3xl font-bold">₹{totalExpenses}</p>
          </div>
          <div className="bg-yellow-600 text-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-1">Net Profit/Loss</h3>
            <p className="text-3xl font-bold">₹{netProfitLoss}</p>
          </div>
        </div>

        <Line data={cashFlowChartData} />
      </div>

      {/* Revenue Trends & Cash Flow */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Trends & Cash Flow</h2>
        <div className="max-w-2xl mx-auto">
          <Bar data={revenueChartData} />
        </div>
      </div>

      {/* Outstanding Payments */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Outstanding Payments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-600 text-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-1">Receivables</h3>
            <p className="text-3xl font-bold">₹{outstandingReceivables}</p>
            <p>{pendingInvoices} Pending Invoices</p>
          </div>
          <div className="bg-orange-600 text-white p-6 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-1">Payables</h3>
            <p className="text-3xl font-bold">₹{outstandingPayables}</p>
            <p>{paidInvoices} Pending Invoices</p>
          </div>
        </div>
      </div>

      {/* Merged Reports */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Merged Reports</h2>
        <div className="tabs">
          <ul>
            <li>Profit & Loss Statement</li>
            <li>Balance Sheet</li>
            <li>Cash Flow Report</li>
            <li>Aging Report (Receivables & Payables)</li>
          </ul>
          <div>
            {/* Each report's data will be rendered in tabbed format */}
          </div>
        </div>
      </div>
    </div>
  );
}
