"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function SalesReportPage() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    orderCount: 0,
    conversionRate: 0,
    inventory: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("charts");
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, salesRes, marketRes] = await Promise.all([
          fetch("/api/item-and-pricing"),
          fetch("/api/sales-orders"),
          fetch("/api/marketplace-orders"),
        ]);
        const [products, salesOrders, marketplaceOrders] = await Promise.all([
          productRes.json(),
          salesRes.json(),
          marketRes.json(),
        ]);

        const allOrders = [...salesOrders, ...marketplaceOrders.orders];
        const orderCount = allOrders.length;
        const inventory = products.reduce((sum, p) => sum + (p.stock || 0), 0);
        const totalRevenue = salesOrders.reduce(
          (sum, order) => sum + order.quantity * order.price,
          0
        );

        const topProducts = products.map((p) => {
          const orders = salesOrders.filter((o) => o.product === p.name);
          const sales = orders.reduce((sum, o) => sum + o.quantity, 0);
          const revenue = orders.reduce(
            (sum, o) => sum + o.quantity * o.price,
            0
          );
          return { name: p.name, sales, revenue };
        });

        const top5 = topProducts
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        const catMap = {};
        products.forEach((p) => {
          catMap[p.category] = (catMap[p.category] || 0) + (p.stock || 0);
        });
        const catTotal = Object.values(catMap).reduce((a, b) => a + b, 0);
        const catData = Object.entries(catMap).map(([name, value]) => ({
          name,
          value: Math.round((value / catTotal) * 100),
        }));

        const revData = Array.from({ length: 12 }, (_, i) => ({
          name: new Date(0, i).toLocaleString("default", { month: "short" }),
          revenue: Math.floor(Math.random() * 10000) + 1000,
        }));

        setMetrics({
          totalRevenue,
          orderCount,
          conversionRate: 2.5,
          inventory,
        });
        setTopProducts(top5);
        setRevenueData(revData);
        setCategoryData(catData);
        setRecentOrders(salesOrders);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  const renderStatusBadge = (status) => {
    const statusColors = {
      Confirmed: "bg-green-500",
      Pending: "bg-yellow-500",
      Dispatched: "bg-blue-500",
      Processing: "bg-purple-500",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-white text-xs ${
          statusColors[status] || "bg-gray-500"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 md:p-6">
      <nav className="mb-3 text-gray-600">
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
          <li className="font-semibold flex items-center">Sales Report</li>
        </ol>
      </nav>

      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-4xl font-bold text-gray-800">
          Sales Report Dashboard
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: formatCurrency(metrics.totalRevenue),
            change: "+20.1%",
          },
          {
            title: "Total Orders",
            value: metrics.orderCount,
            change: "+15%",
          },
          {
            title: "Conversion Rate",
            value: `${metrics.conversionRate.toFixed(2)}%`,
            change: "+2.5%",
          },
          {
            title: "Inventory Items",
            value: metrics.inventory,
            change: "+12.5%",
          },
        ].map((metric, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500 mb-1">
              {metric.title}
            </div>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-gray-500">
              {metric.change} from last month
            </p>
          </div>
        ))}
      </div>

      <div className="flex border-b mb-4">
        {["charts", "details"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "charts" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Top Performing Products
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Units Sold" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "details" && (
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="text-left py-2 pl-4">Order ID</th>
                <th className="text-left py-2 pl-4">Customer</th>
                <th className="text-left py-2 pl-4">Product</th>
                <th className="text-right py-2 pl-4">Qty</th>
                <th className="text-right py-2 pl-4">Amount</th>
                <th className="text-left py-2 pl-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2 pl-4 font-medium">{order.id}</td>
                  <td className="py-2 pl-4">{order.customerName}</td>
                  <td className="py-2 pl-4">{order.product}</td>
                  <td className="py-2 pl-4 text-right">{order.quantity}</td>
                  <td className="py-2 pl-4 text-right">
                    {formatCurrency(order.quantity * order.price)}
                  </td>
                  <td className="py-2 pl-4">{renderStatusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
