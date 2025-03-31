"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";

export default function SalesOrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/sales-orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
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
              onClick={() => router.push("/dashboard/sales-crm")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard/sales-crm/selling")}
              className="hover:underline flex items-center"
            >
           Selling and Customer Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Sales Orders</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Selling and Customer Management
        </h1>
        <button
          onClick={() =>
            router.push("/dashboard/sales-crm/selling/sales-orders/add")
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <FaPlusCircle />
          Add Order
        </button>
      </div>

      <div className="mb-6">
        <button
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-2"
          onClick={() => router.push("/dashboard/sales-crm/selling")}
        >
          <MdOutlineAssignment />
          Customer Management
        </button>
      </div>

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
                      <th className="py-2">Order ID</th>
                      <th className="py-2">Customer</th>
                      <th className="py-2">Product Name</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Quantity</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td>{order.id.slice(-6)}</td>
                        <td>{order.customerName}</td>
                        <td>{order.product}</td>
                        <td>₹{order.price}</td>
                        <td>{order.quantity}</td>

                        <td>
                          <span
                            className={`px-3 py-1 inline-block text-white font-medium rounded ${
                              order.status === "Completed"
                                ? "bg-green-500"
                                : order.status === "Pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="bg-green-500 text-white px-2 py-1 text-sm rounded my-3 hover:bg-green-600 transition duration-200 flex items-center gap-x-1"
                            onClick={() => {
                              localStorage.setItem(
                                "product-data",
                                JSON.stringify(order)
                              );
                              router.push(
                                `/dashboard/sales-crm/selling/sales-orders/add`
                              );
                            }}
                          >
                            Edit
                            <FaEdit />
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
                      {order.customerName}
                    </h3>
                    <p>
                      <strong>Order ID:</strong> {order.id.slice(-6)}
                    </p>
                    <p>
                      <strong>Product:</strong> {order.product}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {order.quantity}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{order.price}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-3 py-[2px] inline-block text-white font-medium rounded ${
                          order.status === "Completed"
                            ? "bg-green-500"
                            : order.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <button
                      className="mt-3 bg-green-500 text-white px-[10px] py-[5px] text-sm rounded hover:bg-green-600 transition duration-200 flex items-center"
                      onClick={() => {
                        localStorage.setItem(
                          "product-data",
                          JSON.stringify(order)
                        );
                        router.push(
                          `/dashboard/sales-crm/selling/sales-orders/add`
                        );
                      }}
                    >
                      Edit
                      <FaEdit className="inline-block ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No sales orders found.
            </div>
          )}
        </>
      )}
    </div>
  );
}
