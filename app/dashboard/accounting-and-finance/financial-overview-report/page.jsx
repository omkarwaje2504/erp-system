"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa6";

export default function ProductionOverview() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/work-orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch work orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered =
      statusFilter === "all"
        ? orders
        : orders.filter(
            (order) => order.status?.toLowerCase() === statusFilter
          );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, statusFilter]);

  const getStatusCount = (status) =>
    orders.filter((order) => order.status?.toLowerCase() === status).length;

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="p-6 w-full">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() =>
                router.push("/dashboard/production-and-management")
              }
              className="hover:underline flex items-center"
            >
              Production and Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            Production Overview
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Production Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-purple-600 text-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">
            Pending Work Orders Count
          </h3>
          <p className="text-3xl font-bold">{getStatusCount("pending")}</p>
        </div>

        <div className="bg-green-600 text-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">
            Completed Work Orders This Month
          </h3>
          <p className="text-3xl font-bold">{getStatusCount("completed")}</p>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-1">Inprogress Work Order</h3>
          <p className="text-3xl font-bold">{getStatusCount("ongoing")}</p>
        </div>
      </div>

      <div className="mt-6 mb-4 flex gap-4 items-center">
        <label className="text-sm font-semibold text-gray-700">
          Filter by Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
        </select>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Work Order Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>ID:</strong> {selectedOrder.workOrderId}
              </p>
              <p>
                <strong>Name:</strong> {selectedOrder.workOrderName}
              </p>
              <p>
                <strong>Assigned To:</strong> {selectedOrder.assignedTo}
              </p>
              <p>
                <strong>Start Date:</strong> {selectedOrder.startDate}
              </p>
              <p>
                <strong>Completion Date:</strong> {selectedOrder.completionDate}
              </p>
              <p>
                <strong>Efficiency:</strong> {selectedOrder.efficiency}
              </p>
              <p>
                <strong>Description:</strong> {selectedOrder.description}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              {selectedOrder.documentUrl && (
                <img
                  src={selectedOrder.documentUrl}
                  alt="Document"
                  className="w-[150px] rounded mt-2 border"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg p-4">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr className="text-left border-b text-lg font-semibold text-gray-700">
                  <th className="p-2">Work order id & name</th>
                  <th className="p-2">Assigned Workstation and employee</th>
                  <th className="p-2">Start & Expected Completion Date</th>
                  <th className="p-2">Production Efficiency</th>
                  <th className="p-2">Production Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">
                      {order.workOrderId} - {order.workOrderName}
                    </td>
                    <td className="p-2">{order.assignedTo}</td>
                    <td className="p-2">
                      {order.startDate} → {order.completionDate}
                    </td>
                    <td className="p-2">{order.efficiency}</td>
                    <td className="p-2 capitalize">
                      <span
                        className={`px-3 py-1 inline-block font-medium rounded ${
                          order.status === "Completed"
                            ? "text-green-500"
                            : order.status === "Pending"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 text-sm rounded my-3 hover:bg-green-600 transition duration-200 flex items-center gap-x-1"
                      >
                        View <FaRegEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}