"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X, Info, FileEdit } from "lucide-react";

export default function ProcurementSupplierPage() {
  const router = useRouter();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [defectiveMaterialRequests, setDefectiveMaterialRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("orders"); // For mobile view toggling between tables

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res1 = await fetch(
          "/api/purchase-request-order?type=purchaseRequestOrder"
        );
        const data1 = await res1.json();
        setPurchaseOrders(data1 || []);

        const res2 = await fetch(
          "/api/purchase-request-order?type=returnHandlingDefectiveMaterial"
        );
        const data2 = await res2.json();
        setDefectiveMaterialRequests(data2 || []);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAddPurchaseRequest = () => {
    router.push(
      "/dashboard/stock-inventory/procurement-supplier-management/add-purchase-request"
    );
  };

  const handleAddReturnRequest = () => {
    router.push(
      "/dashboard/stock-inventory/procurement-supplier-management/add-return-request"
    );
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsRequestModalOpen(true);
  };

  // Filter orders and requests based on search term
  const filteredPurchaseOrders = purchaseOrders.filter(order => 
    order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDefectiveRequests = defectiveMaterialRequests.filter(request => 
    request.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render order cards for mobile view
  const renderOrderCard = (order) => (
    <div key={order.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">{order.item}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          order.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {order.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{order.date}</p>
        </div>
        <div>
          <p className="text-gray-500">Supplier</p>
          <p className="font-medium">{order.supplier}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-500 text-sm">Quantity</p>
        <p className="font-medium">{order.quantity}</p>
      </div>
      
      <div className="flex justify-between mt-3">
        <button
          onClick={() => handleViewOrder(order)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          <Info size={16} className="mr-1" /> View Order
        </button>
        <button
          onClick={() => {
            localStorage.setItem("order", JSON.stringify(order));
            router.push(
              `/dashboard/stock-inventory/procurement-supplier-management/add-purchase-request`
            );
          }}
          className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-100 flex items-center"
        >
          <FileEdit size={16} className="mr-1" /> Edit Order
        </button>
      </div>
    </div>
  );

  // Render request cards for mobile view
  const renderRequestCard = (request) => (
    <div key={request.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">{request.item}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          request.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {request.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{request.date}</p>
        </div>
        <div>
          <p className="text-gray-500">Supplier</p>
          <p className="font-medium">{request.supplier}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-500 text-sm">Issue</p>
        <p className="font-medium">{request.issue}</p>
      </div>
      
      <div className="flex justify-end mt-3">
        <button
          onClick={() => handleViewRequest(request)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          <Info size={16} className="mr-1" /> View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full max-w-full mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600 hidden md:block">
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
          <li className="font-semibold flex items-center">
            Procurement & Supplier Management
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Procurement & Supplier Management
        </h1>
        
        {/* Search bar */}
        <div className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Search orders or requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleAddPurchaseRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Add Purchase Request & Order
        </button>
        <button
          onClick={handleAddReturnRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Request Return for Defective Materials
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      ) : (
        <>
          {/* Mobile Tabs */}
          <div className="md:hidden mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "orders" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500"
                }`}
              >
                Purchase Orders
              </button>
              <button
                onClick={() => setActiveTab("returns")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "returns" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500"
                }`}
              >
                Return Requests
              </button>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden">
            {activeTab === "orders" && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Purchase Requests & Orders</h2>
                {filteredPurchaseOrders.length > 0 ? (
                  filteredPurchaseOrders.map(renderOrderCard)
                ) : (
                  <p className="text-center text-gray-500 py-8">No purchase orders found.</p>
                )}
              </div>
            )}
            
            {activeTab === "returns" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Return Handling for Defective Materials</h2>
                {filteredDefectiveRequests.length > 0 ? (
                  filteredDefectiveRequests.map(renderRequestCard)
                ) : (
                  <p className="text-center text-gray-500 py-8">No return requests found.</p>
                )}
              </div>
            )}
          </div>

          {/* Desktop Tables View */}
          <div className="hidden md:block">
            {/* Purchase Orders Table */}
            <div className="overflow-x-auto mb-8 bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Purchase Requests & Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
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
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPurchaseOrders.length > 0 ? (
                      filteredPurchaseOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.supplier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{order.item}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === "Completed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              View Order
                            </button>
                            <button
                              onClick={() => {
                                localStorage.setItem("order", JSON.stringify(order));
                                router.push(`/dashboard/stock-inventory/procurement-supplier-management/add-purchase-request`);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit Order
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No purchase orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Defective Materials Return Table */}
            <div className="overflow-x-auto mb-4 bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Return Handling for Defective Materials</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDefectiveRequests.length > 0 ? (
                      filteredDefectiveRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {request.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{request.item}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {request.supplier}
                          </td>
                          <td className="px-6 py-4">
                            {request.issue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              request.status === "Completed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={() => handleViewRequest(request)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No return requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Order Modal - Improved for all screen sizes */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsOrderModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Item</h3>
                  <p className="mt-1 text-lg">{selectedOrder.item}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-1">{selectedOrder.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                  <p className="mt-1">{selectedOrder.supplier}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                  <p className="mt-1">{selectedOrder.quantity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 inline-block px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    {selectedOrder.status}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Modal - Improved for all screen sizes */}
      {isRequestModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Return Request Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsRequestModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Item</h3>
                  <p className="mt-1 text-lg">{selectedRequest.item}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-1">{selectedRequest.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                  <p className="mt-1">{selectedRequest.supplier}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Issue</h3>
                  <p className="mt-1">{selectedRequest.issue}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 inline-block px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                    {selectedRequest.status}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}