"use client";
import Link from "next/link";

export default function SalesLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales & CRM</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md">+ New Lead</button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6 border-b pb-3 bg-gray-200">
        <Link href="/sales" className="px-4 py-2 rounded-md bg-gray-900 text-white">Overview</Link>
        <Link href="/sales/pipeline" className="px-4 py-2 rounded-md bg-gray-200">Pipeline</Link>
        <Link href="/sales/customers" className="px-4 py-2 rounded-md bg-gray-200">Customers</Link>
        <Link href="/sales/opportunities" className="px-4 py-2 rounded-md bg-gray-200">Opportunities</Link>
      </div>

      {children}
    </div>
  );
}
