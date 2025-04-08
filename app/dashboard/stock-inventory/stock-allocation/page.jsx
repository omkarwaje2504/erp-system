"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StockAllocationPage() {
  const router = useRouter();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal open state
  const [selectedAllocation, setSelectedAllocation] = useState(null); // Store selected allocation for modal

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const res = await fetch("/api/stock-allocation");
        const data = await res.json();
        setAllocations(data.allocations || []);
      } catch (err) {
        setError("Error fetching stock allocations");
      } finally {
        setLoading(false);
      }
    };

    fetchAllocations();
  }, []);

  const handleAddStockAllocation = () => {
    router.push("/dashboard/stock-inventory/stock-allocation/add");
  };

  const openModal = (allocation) => {
    setSelectedAllocation(allocation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAllocation(null); // Reset the selected allocation when closing the modal
  };

  return (
    <div className="p-6 w-full">
      {/* Breadcrumbs */}
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

          <li className="font-semibold flex items-center">Stock Allocation</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">Stock Allocation</h1>
        <button
          onClick={handleAddStockAllocation}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Add Stock Allocation
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-center">Date</th>
                  <th className="p-2 text-center">Batch No</th>
                  <th className="p-2 text-center">Production</th>
                  <th className="p-2 text-center">Materials</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((allocation) => (
                  <tr key={allocation.id}>
                    <td className="p-2 text-center">{allocation.date}</td>
                    <td className="p-2 text-center">{allocation.batchNo}</td>
                    <td className="p-2 text-center">{allocation.production}</td>
                    <td className="p-2 text-center">{allocation.materials}</td>
                    <td className="p-2 text-center">{allocation.status}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => openModal(allocation)} // Open modal on click
                        className="text-blue-600 hover:underline mr-4"
                      >
                        View Batch
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "stocks",
                            JSON.stringify(allocation)
                          );
                          router.push(
                            `/dashboard/stock-inventory/stock-allocation/add`
                          );
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Edit Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal for Viewing Stock Allocation Details */}
      {isModalOpen && selectedAllocation && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Batch Information</h2>
            <p>
              <strong>Batch No:</strong> {selectedAllocation.batchNo}
            </p>
            <p>
              <strong>Production Line:</strong> {selectedAllocation.production}
            </p>
            <p>
              <strong>Materials:</strong> {selectedAllocation.materials}
            </p>
            <p>
              <strong>Status:</strong> {selectedAllocation.status}
            </p>
            <p>
              <strong>Description:</strong> {selectedAllocation.description}
            </p>
            <p>
              <strong>Date:</strong> {selectedAllocation.date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
