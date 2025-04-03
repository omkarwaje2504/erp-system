"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegEye } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import jsPDF from "jspdf";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InvoicingBillingTransactions() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, paymentRes] = await Promise.all([
          fetch("/api/invoices"),
          fetch("/api/payments"),
        ]);

        const invoiceData = await invoiceRes.json();
        const paymentData = await paymentRes.json();

        setInvoices(invoiceData.invoices || []);
        setPayments(paymentData.payments || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generatePDF = () => {
    if (!selectedInvoice) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Invoice Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${selectedInvoice.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${selectedInvoice.date}`, 20, 50);
    doc.text(`Customer/Vendor: ${selectedInvoice.customerName}`, 20, 60);
    doc.text(`Description: ${selectedInvoice.description || "-"}`, 20, 70);
    doc.text(`Amount: ₹${selectedInvoice.amount}`, 20, 80);
    doc.text(`Status: ${selectedInvoice.status}`, 20, 90);
    doc.save(`Invoice-${selectedInvoice.invoiceNumber}.pdf`);
  };

  const paymentData = {
    labels: ["UPI", "Bank Transfers", "Razorpay", "PayPal", "Cards"],
    datasets: [
      {
        label: "Payment Methods",
        data: [12, 19, 3, 5, 7], // Replace with dynamic data when available
        backgroundColor: [
          "#6366F1",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#3B82F6",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 w-full">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard/accounting-and-finance")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            Invoicing, Billing & Transactions
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Invoicing, Billing & Transactions
        </h1>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Invoice Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-200 p-4 rounded text-center">
          <h3 className="text-md font-semibold">Total Sales Invoices :</h3>
          <p className="text-xl font-bold">
            {invoices.filter((i) => i.type === "sales").length}
          </p>
        </div>
        <div className="bg-gray-200 p-4 rounded text-center">
          <h3 className="text-md font-semibold">Total Purchase Invoices :</h3>
          <p className="text-xl font-bold">
            {invoices.filter((i) => i.type === "purchase").length}
          </p>
        </div>
        <button
          onClick={() =>
            router.push(
              "/dashboard/accounting-and-finance/invoicing-billing-transactions/create-invoice"
            )
          }
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 h-fit"
        >
          Create Invoice
        </button>
      </div>

      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl">
            <h2 className="text-2xl font-bold mb-4">View Invoice</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Invoice Number:</strong> {selectedInvoice.invoiceNumber}
              </p>
              <p>
                <strong>Date:</strong> {selectedInvoice.date}
              </p>
              <p>
                <strong>Customer/Vendor Name:</strong>{" "}
                {selectedInvoice.customerName}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedInvoice.description || "-"}
              </p>
              <p>
                <strong>Status:</strong> {selectedInvoice.status}
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedInvoice.amount}
              </p>
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={generatePDF}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white p-4 shadow rounded mb-6">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Invoice Number</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Customer/Vendor</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{inv.invoiceNumber}</td>
                    <td className="p-2">{inv.date}</td>
                    <td className="p-2">{inv.customerName}</td>
                    <td className="p-2 font-semibold">₹{inv.amount}</td>
                    <td className="p-2 capitalize">
                      <span
                        className={`font-medium ${
                          inv.status === "Paid"
                            ? "text-green-600"
                            : inv.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-2 space-x-2 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowModal(true);
                        }}
                        className="bg-blue-600 text-white px-2 py-1 rounded-sm flex items-center gap-1"
                      >
                        <FaRegEye /> View
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "invoice-data",
                            JSON.stringify(inv)
                          );
                          router.push(
                            `/dashboard/accounting-and-finance/invoicing-billing-transactions/edit-invoice`
                          );
                        }}
                        className="bg-green-600 text-white px-2 py-1 rounded-sm flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Processing Section */}
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Payment Processing
          </h2>
          <div className="bg-white p-4 mb-6 shadow rounded">
            <h4 className="font-semibold mb-4 text-sm text-gray-800">
              Payment Methods Breakdown (Pie Chart)
            </h4>
            <div className="max-w-xs mx-auto">
              <Pie data={paymentData} />
            </div>

            {/* Payment Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Payment Method</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{p.date}</td>
                      <td className="p-2">{p.method}</td>
                      <td className="p-2">₹{p.amount}</td>
                      <td className="p-2 capitalize">Completed</td>
                      <td className="p-2 space-x-2">
                        <button className="text-blue-600">View</button>
                        <button className="text-red-600">Refund</button>
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
