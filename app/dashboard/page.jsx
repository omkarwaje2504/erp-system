"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiSearch } from "react-icons/fi";
import Card from "../../components/card";

const data = [
  { name: "Jan", Sales: 4000, Expenses: 2000, Profit: 1000 },
  { name: "Feb", Sales: 3000, Expenses: 1800, Profit: 1200 },
  { name: "Mar", Sales: 10000, Expenses: 2500, Profit: 6000 },
  { name: "Apr", Sales: 4000, Expenses: 2100, Profit: 1500 },
  { name: "May", Sales: 6000, Expenses: 2700, Profit: 3000 },
  { name: "Jun", Sales: 5000, Expenses: 2900, Profit: 2000 },
  { name: "Jul", Sales: 6000, Expenses: 2500, Profit: 2500 },
];

const recentSales = [
  { name: "Jackson Lee", email: "jackson.lee@example.com", amount: 1999 },
  { name: "Sophia Anderson", email: "sophia.anderson@example.com", amount: 39 },
  { name: "David Edwards", email: "david.edwards@example.com", amount: 299 },
  { name: "Olivia Liu", email: "olivia.liu@example.com", amount: 99 },
  { name: "Michael Kim", email: "michael.kim@example.com", amount: 2499 },
];

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="flex-1 min-h-screen bg-gray-100 p-6">
        <div className="relative flex justify-end mb-6">
          <FiSearch className="absolute left-3 top-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card
            title="Total Revenue"
            amount="$45,231.89"
            discription="+20.1% from last month"
          />
          <Card
            title="New Customers"
            amount="+2,350"
            discription="+180.1% from last month"
          />

          <Card
            title="Sales"
            amount="+12,234"
            discription="+19% from last month"
          />

          <Card
            title="Active Orders"
            amount="573"
            discription="+201 since yesterday"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-5 shadow rounded-lg col-span-2">
            <h2 className="text-lg font-bold mb-4">Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Sales" fill="#2563EB" />
                <Bar dataKey="Expenses" fill="#EF4444" />
                <Bar dataKey="Profit" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-5 shadow rounded-lg">
            <h2 className="text-lg font-bold mb-4">Recent Sales</h2>
            <p className="text-gray-500 text-sm mb-3">
              You made 265 sales this month.
            </p>
            <ul>
              {recentSales.map((sale, index) => (
                <li key={index} className="flex justify-between border-b py-3">
                  <div>
                    <p className="font-semibold">{sale.name}</p>
                    <p className="text-gray-500 text-sm">{sale.email}</p>
                  </div>
                  <p className="font-semibold">
                    +${sale.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
