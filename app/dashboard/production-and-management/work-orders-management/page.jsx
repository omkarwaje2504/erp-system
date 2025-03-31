"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserEdit, FaPlusCircle } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";

export default function WorkOrderManagement() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/work-orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch work orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="pb-6 w-full">
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
            Work-Orders Management
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Work Orders Management
        </h1>
        <button
          onClick={() =>
            router.push(
              "/dashboard/production-and-management/work-orders-management/add"
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <FaPlusCircle />
          Add New work Order
        </button>
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
                  localStorage.setItem(
                    "work-order-data",
                    JSON.stringify(selectedOrder)
                  );
                  router.push(
                    "/dashboard/production-and-management/work-orders-management/add"
                  );
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Edit
              </button>
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
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <>
          {orders.length > 0 ? (
            <div className="mt-6">
              <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg p-4 bg-white">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr className="text-left border-b text-lg font-semibold text-gray-700">
                      <th className="py-2">Work Order ID & Name</th>
                      <th className="py-2">Assigned To</th>
                      <th className="py-2">Start & Completion Date</th>
                      <th className="py-2">Efficiency</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td>
                          {order.workOrderId} - {order.workOrderName}
                        </td>
                        <td>{order.assignedTo}</td>
                        <td>
                          {order.startDate} → {order.completionDate}
                        </td>
                        <td>{order.efficiency}</td>
                        <td>
                          <span
                            className={`px-3 py-1 inline-block text-white font-medium rounded ${
                              order.status === "Completed"
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowModal(true);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 text-sm rounded my-3 hover:bg-green-600 transition duration-200 flex items-center gap-x-1"
                          >
                            View <FaRegEye />
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem(
                                "work-order-data",
                                JSON.stringify(order)
                              );
                              router.push(
                                "/dashboard/production-and-management/work-orders-management/add"
                              );
                            }}
                            className="bg-green-500 text-white px-2 py-1 text-sm rounded my-3 hover:bg-green-600 transition duration-200 flex items-center gap-x-1"
                          >
                            Edit
                            <FaUserEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden grid grid-cols-1 gap-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
                  >
                    <h3 className="text-lg font-bold mb-2">
                      {order.workOrderId} - {order.workOrderName}
                    </h3>
                    <p>
                      <strong>Assigned:</strong> {order.assignedTo}
                    </p>
                    <p>
                      <strong>Dates:</strong> {order.startDate} →{" "}
                      {order.completionDate}
                    </p>
                    <p>
                      <strong>Efficiency:</strong> {order.efficiency}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-3 py-[2px] inline-block text-white font-medium rounded ${
                          order.status === "Completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600 transition duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem(
                          "work-order-data",
                          JSON.stringify(order)
                        );
                        router.push("/dashboard/work-orders-management/add");
                      }}
                      className="mt-3 bg-green-500 text-white px-[10px] py-[5px] text-sm rounded hover:bg-green-[600]"
                    >
                      Edit <FaUserEdit className="inline-block ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No work orders found.
            </div>
          )}
        </>
      )}
    </div>
  );
}
