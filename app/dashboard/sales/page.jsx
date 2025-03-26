"use client";
import SalesLayout from "../components/SalesLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { stage: "Leads", opportunities: 50 },
  { stage: "Qualified", opportunities: 35 },
  { stage: "Proposal", opportunities: 20 },
  { stage: "Negotiation", opportunities: 10 },
  { stage: "Closed Won", opportunities: 5 },
  { stage: "Closed Lost", opportunities: 8 },
];

const customers = [
  { name: "Blue Ocean Logistics", contact: "Robert Taylor", email: "robert@email.com", status: "Active", value: "$89,300" },
  { name: "TechNova Inc.", contact: "Sarah Johnson", email: "sarah@email.com", status: "Active", value: "$78,500" },
  { name: "Quantum Solutions", contact: "David Wilson", email: "david@email.com", status: "Active", value: "$56,800" },
  { name: "Acme Corporation", contact: "John Smith", email: "john.smith@email.com", status: "Active", value: "$45,000" },
  { name: "Sunshine Foods", contact: "Emily Davis", email: "emily@email.com", status: "Active", value: "$34,200" },
];

export default function SalesOverview() {
  return (
    <SalesLayout>
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 shadow rounded-lg">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold">$45,231.89</h2>
          <p className="text-green-600 text-sm">+20.1% from last month</p>
        </div>
        <div className="bg-white p-5 shadow rounded-lg">
          <p className="text-gray-500">New Customers</p>
          <h2 className="text-2xl font-bold">+2,350</h2>
          <p className="text-green-600 text-sm">+180.1% from last month</p>
        </div>
        <div className="bg-white p-5 shadow rounded-lg">
          <p className="text-gray-500">Sales</p>
          <h2 className="text-2xl font-bold">+12,234</h2>
          <p className="text-green-600 text-sm">+19% from last month</p>
        </div>
        <div className="bg-white p-5 shadow rounded-lg">
          <p className="text-gray-500">Conversion Rate</p>
          <h2 className="text-2xl font-bold">24.3%</h2>
          <p className="text-green-600 text-sm">+4.3% from last month</p>
        </div>
      </div>

      {/* Sales Pipeline & Top Customers */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 shadow rounded-lg col-span-2">
          <h2 className="text-lg font-bold mb-4">Sales Pipeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={salesData}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="stage" />
              <Tooltip />
              <Bar dataKey="opportunities" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Top Customers</h2>
          <ul>
            {customers.slice(0, 5).map((customer, index) => (
              <li key={index} className="flex justify-between border-b py-3">
                <div>
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-gray-500 text-sm">{customer.contact}</p>
                </div>
                <p className="font-semibold">{customer.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SalesLayout>
  );
}
