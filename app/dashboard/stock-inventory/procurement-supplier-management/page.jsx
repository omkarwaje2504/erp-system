"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  return (
    <div className="p-6 w-full">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard/stock-inventory")}
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

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Procurement & Supplier Management
        </h1>
      </div>

      <div className="flex mb-6">
        <button
          onClick={handleAddPurchaseRequest}
          className="bg-gray-600 text-white px-4 py-2 rounded mr-4"
        >
          Add Purchase Request & Order
        </button>
        <button
          onClick={handleAddReturnRequest}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Request Return for Defective Materials
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Purchase Requests & Orders</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-center">Date</th>
                  <th className="p-2 text-center">Supplier</th>
                  <th className="p-2 text-center">Item</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-2 text-center">{order.date}</td>
                    <td className="p-2 text-center">{order.supplier}</td>
                    <td className="p-2 text-center">{order.item}</td>
                    <td className="p-2 text-center">{order.quantity}</td>
                    <td className="p-2 text-center">{order.status}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        View Order
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem("order", JSON.stringify(order));
                          router.push(
                            `/dashboard/stock-inventory/procurement-supplier-management/add-purchase-request`
                          );
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Edit Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          Return Handling for Defective Materials
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-center">Date</th>
                  <th className="p-2 text-center">Item</th>
                  <th className="p-2 text-center">Supplier</th>
                  <th className="p-2 text-center">Issue</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {defectiveMaterialRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="p-2 text-center">{request.date}</td>
                    <td className="p-2 text-center">{request.item}</td>
                    <td className="p-2 text-center">{request.supplier}</td>
                    <td className="p-2 text-center">{request.issue}</td>
                    <td className="p-2 text-center">{request.status}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Supplier:</strong> {selectedOrder.supplier}</p>
                <p><strong>Item:</strong> {selectedOrder.item}</p>
                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {isRequestModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold mb-4">Return Request Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Date:</strong> {selectedRequest.date}</p>
                <p><strong>Item:</strong> {selectedRequest.item}</p>
                <p><strong>Supplier:</strong> {selectedRequest.supplier}</p>
                <p><strong>Issue:</strong> {selectedRequest.issue}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
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
