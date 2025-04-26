"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ChevronDown, X, Info, Plus, UserCog, ArrowRight } from "lucide-react";

export default function SellingCustomerManagement() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/get-customers", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setCustomers(data.customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        setError("Error fetching customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Open customer details modal
  const openModal = (customerData) => {
    setSelectedCustomer(customerData);
    setIsModalOpen(true);
  };

  // Close customer details modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    localStorage.setItem("customer-data", JSON.stringify(customer));
    router.push("/dashboard/sales-crm/selling/add");
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render customer card for mobile view
  const renderCustomerCard = (customer) => (
    <div key={customer.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">{customer.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {customer.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">Customer ID</p>
          <p className="font-medium">{customer.id}</p>
        </div>
        <div>
          <p className="text-gray-500">Contact No.</p>
          <p className="font-medium">{customer.contact}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-500 text-sm">Description</p>
        <p className="text-sm mt-1">{customer.description}</p>
      </div>
      
      <div className="flex justify-between mt-3">
        <button
          onClick={() => openModal(customer)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          <Info size={16} className="mr-1" /> Details
        </button>
        <button
          onClick={() => handleEditCustomer(customer)}
          className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-100 flex items-center"
        >
          <UserCog size={16} className="mr-1" /> Edit
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
              onClick={() => router.push("/dashboard/sales-crm")}
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
              Selling and Customer Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            Customer Management
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Selling and Customer Management
        </h1>
        
        {/* Search bar */}
        <div className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard/sales-crm/selling/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add New Lead
        </button>
        
        <button
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center justify-center gap-2"
          onClick={() => router.push("/dashboard/sales-crm/selling/sales-orders")}
        >
          <ArrowRight size={18} />
          Sales Order Management
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
          {/* Mobile Cards View */}
          <div className="md:hidden">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(renderCustomerCard)
            ) : (
              <p className="text-center text-gray-500 py-8">No customers found.</p>
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
                      Customer ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact No.
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
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          {customer.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            customer.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => openModal(customer)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit Customer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal for Customer Details */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Customer Details</h2>
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
                  <h3 className="text-sm font-medium text-gray-500">Customer Name</h3>
                  <p className="mt-1 text-lg">{selectedCustomer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer ID</h3>
                  <p className="mt-1 text-lg">{selectedCustomer.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                  <p className="mt-1 text-lg">{selectedCustomer.contact}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedCustomer.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedCustomer.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{selectedCustomer.description || "No description available"}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEditCustomer(selectedCustomer);
                  closeModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}