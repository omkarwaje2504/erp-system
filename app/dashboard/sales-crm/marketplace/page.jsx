"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MarketplaceIntegration() {
  const [platform, setPlatform] = useState("Amazon");
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`/api/marketplace-orders?platform=${platform}`);
      const data = await res.json();
      setOrders(data.orders || []);
    };
    fetchOrders();
  }, [platform]);

  const tabs = ["Amazon", "Flipkart", "Others"];

  return (
    <div className="pb-6 w-full mx-auto">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard/sales-crm")}
              className="hover:underline flex items-center"
            >
              Sales CRM
            </button>
          </li>
          <li>/</li>

          <li className="font-semibold flex items-center">Market Place</li>
        </ol>
      </nav>
      <h1 className="text-4xl font-semibold border-b pb-2">
        Market place integration
      </h1>

      <div className="flex gap-4 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setPlatform(tab)}
            className={`px-6 py-2 border rounded ${
              platform === tab
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white rounded shadow mt-4">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="p-3">Order Id</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No orders found for {platform}.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">
                    <span
                      className={`px-4 py-1 inline-block text-white font-medium rounded ${
                        order.status === "Pending"
                          ? "bg-green-500"
                          : order.status === "Dispatched"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {order.description}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
