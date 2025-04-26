"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import { Search, Info, X, Plus } from "lucide-react";

export default function SalesOrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open order details modal
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close order details modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Render order card for mobile view
  const renderOrderCard = (order) => (
    <div key={order.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">{order.customerName}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            order.status === "Completed"
              ? "bg-green-100 text-green-800"
              : order.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">Order ID</p>
          <p className="font-medium">{order.id.slice(-6)}</p>
        </div>
        <div>
          <p className="text-gray-500">Product</p>
          <p className="font-medium">{order.product}</p>
        </div>
        <div>
          <p className="text-gray-500">Quantity</p>
          <p className="font-medium">{order.quantity}</p>
        </div>
        <div>
          <p className="text-gray-500">Price</p>
          <p className="font-medium">₹{order.price}</p>
        </div>
      </div>

      <div className="flex justify-between mt-3">
        <button
          onClick={() => openModal(order)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          <Info size={16} className="mr-1" /> Details
        </button>
        <button
          onClick={() => {
            localStorage.setItem("product-data", JSON.stringify(order));
            router.push(`/dashboard/sales-crm/selling/sales-orders/add`);
          }}
          className="bg-green-50 text-green-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-green-100 flex items-center"
        >
          <FaEdit className="mr-1" size={14} /> Edit
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full max-w-full mx-auto">
      {/* Breadcrumbs */}
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Sales Orders
        </h1>

        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {/* Add Order button */}
        <button
          onClick={() =>
            router.push("/dashboard/sales-crm/selling/sales-orders/add")
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add New Order
        </button>
        <button
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-2"
          onClick={() => router.push("/dashboard/sales-crm/selling")}
        >
          <MdOutlineAssignment />
          Customer Management
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="md:hidden">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(renderOrderCard)
            ) : (
              <div className="text-center py-8 text-gray-500">
                No sales orders found.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Customer List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{order.id.slice(-6)}</td>
                        <td className="px-6 py-4 font-medium">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4">{order.product}</td>
                        <td className="px-6 py-4">₹{order.price}</td>
                        <td className="px-6 py-4">{order.quantity}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800 mr-4"
                            onClick={() => openModal(order)}
                          >
                            View Details
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-800"
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
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No sales orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Order ID
                  </h3>
                  <p className="mt-1 text-lg">{selectedOrder.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Customer
                  </h3>
                  <p className="mt-1 text-lg">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product</h3>
                  <p className="mt-1 text-lg">{selectedOrder.product}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Quantity
                    </h3>
                    <p className="mt-1 text-lg">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <p className="mt-1 text-lg">₹{selectedOrder.price}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        selectedOrder.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "product-data",
                    JSON.stringify(selectedOrder)
                  );
                  router.push(`/dashboard/sales-crm/selling/sales-orders/add`);
                  closeModal();
                }}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
              >
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
