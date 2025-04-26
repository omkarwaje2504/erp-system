"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ChevronDown, X, Info } from "lucide-react";

export default function StockAllocationPage() {
  const router = useRouter();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set the number of items per page

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
    setSelectedAllocation(null);
  };

  // Filter allocations based on search term
  const filteredAllocations = allocations.filter(allocation => 
    allocation.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.production.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.materials.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current page allocations
  const indexOfLastAllocation = currentPage * itemsPerPage;
  const indexOfFirstAllocation = indexOfLastAllocation - itemsPerPage;
  const currentAllocations = filteredAllocations.slice(indexOfFirstAllocation, indexOfLastAllocation);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render allocation cards for mobile view
  const renderAllocationCard = (allocation) => (
    <div key={allocation.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">Batch: {allocation.batchNo}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          allocation.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {allocation.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{allocation.date}</p>
        </div>
        <div>
          <p className="text-gray-500">Production</p>
          <p className="font-medium">{allocation.production}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-500 text-sm">Materials</p>
        <p className="font-medium">{allocation.materials}</p>
      </div>
      
      <div className="flex justify-between mt-3">
        <button
          onClick={() => openModal(allocation)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          <Info size={16} className="mr-1" /> View Batch
        </button>
        <button
          onClick={() => {
            localStorage.setItem("stocks", JSON.stringify(allocation));
            router.push(`/dashboard/stock-inventory/stock-allocation/add`);
          }}
          className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-100"
        >
          Edit Batch
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
          <li className="font-semibold flex items-center">Stock Allocation</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Stock Allocation</h1>

        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
          {/* Search bar */}
          <div className="w-full md:w-64 relative">
            <input
              type="text"
              placeholder="Search allocations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* Add button */}
          <button
            onClick={handleAddStockAllocation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex-shrink-0"
          >
            Add Stock Allocation
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="md:hidden">
            {currentAllocations.length > 0 ? (
              currentAllocations.map(renderAllocationCard)
            ) : (
              <p className="text-center text-gray-500 py-8">No allocations found.</p>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto mb-8 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Stock Allocations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Production
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Materials
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
                  {currentAllocations.length > 0 ? (
                    currentAllocations.map((allocation) => (
                      <tr key={allocation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{allocation.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{allocation.batchNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{allocation.production}</td>
                        <td className="px-6 py-4">{allocation.materials}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            allocation.status === "Completed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {allocation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => openModal(allocation)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            View Batch
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem("stocks", JSON.stringify(allocation));
                              router.push(`/dashboard/stock-inventory/stock-allocation/add`);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit Batch
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No stock allocations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l-lg"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {Math.ceil(filteredAllocations.length / itemsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg"
          disabled={currentPage === Math.ceil(filteredAllocations.length / itemsPerPage)}
        >
          Next
        </button>
      </div>

      {/* Modal for Viewing Stock Allocation Details */}
      {isModalOpen && selectedAllocation && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Batch Information</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Batch No</h3>
                <p className="mt-1 text-lg">{selectedAllocation.batchNo}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-lg">{selectedAllocation.date}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Production Line</h3>
                <p className="mt-1 text-lg">{selectedAllocation.production}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Materials</h3>
                <p className="mt-1">{selectedAllocation.materials}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1 inline-block px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  {selectedAllocation.status}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{selectedAllocation.description || "No description available"}</p>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={closeModal}
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
