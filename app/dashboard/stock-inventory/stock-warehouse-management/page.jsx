"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ArrowRightLeft, ChevronDown, X, Info } from "lucide-react";

export default function StockWarehousePage() {
  const router = useRouter();
  const [rawMaterials, setRawMaterials] = useState([]);
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [selectedWarehouseFrom, setSelectedWarehouseFrom] = useState("");
  const [selectedWarehouseTo, setSelectedWarehouseTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("raw");
  
  // Fetch products and separate raw materials and finished goods based on status
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/item-and-pricing");
        const data = await res.json();
        const rawMaterialsData = data.filter(
          (product) =>
            product.productOrders.length > 0 &&
            product.productOrders[0]?.status !== "Completed"
        );
        const finishedGoodsData = data.filter(
          (product) =>
            product.productOrders.length > 0 &&
            product.productOrders[0]?.status === "Completed"
        );

        setRawMaterials(rawMaterialsData || []);
        setFinishedGoods(finishedGoodsData || []);
      } catch (err) {
        setError("Error fetching stock products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Open product details modal
  const openModal = (productData) => {
    setSelectedProduct(productData);
    setIsModalOpen(true);
  };

  // Close product details modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Open stock transfer modal
  const openTransferModal = (productData) => {
    setSelectedProduct(productData);
    setIsTransferModalOpen(true);
  };

  // Close stock transfer modal
  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  // Handle the transfer of stock
  const handleStockTransfer = async () => {
    if (
      transferQuantity <= 0 ||
      !selectedWarehouseFrom ||
      !selectedWarehouseTo
    ) {
      alert("Please provide valid transfer details.");
      return;
    }

    try {
      const res = await fetch("/api/production-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: transferQuantity,
          fromWarehouse: selectedWarehouseFrom,
          toWarehouse: selectedWarehouseTo,
          section: "stock-movement",
          category: selectedProduct.category,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Stock transferred successfully.");
        closeTransferModal();
      } else {
        alert("Error during stock transfer.");
      }
    } catch (err) {
      console.error(err);
      alert("Error during stock transfer.");
    }
  };

  // Filter products based on search term
  const filteredRawMaterials = rawMaterials.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFinishedGoods = finishedGoods.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render product cards for mobile view
  const renderProductCard = (product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">{product.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          product.productOrders[0]?.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {product.productOrders[0]?.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">Available Stock</p>
          <p className="font-medium">{product.stock}</p>
        </div>
        <div>
          <p className="text-gray-500">Reorder Level</p>
          <p className="font-medium">
            {product.productOrders.reduce((acc, order) => acc + order.quantity, 0)}
          </p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-500 text-sm">Warehouse</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {product.productOrders.map((order, idx) => (
            <div key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">
              {order.warehouse}: {order.quantity}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-3">
        <button
          onClick={() => openModal(product)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          <Info size={16} className="mr-1" /> Details
        </button>
        <button
          onClick={() => openTransferModal(product)}
          className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-100 flex items-center"
        >
          <ArrowRightLeft size={16} className="mr-1" /> Transfer
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
            Stock & Warehouse Management
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Stock & Warehouse Management
        </h1>
        
        {/* Search bar */}
        <div className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
          {/* Mobile Tabs */}
          <div className="md:hidden mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("raw")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "raw" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500"
                }`}
              >
                Raw Materials
              </button>
              <button
                onClick={() => setActiveTab("finished")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "finished" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500"
                }`}
              >
                Finished Goods
              </button>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden">
            {activeTab === "raw" && (
              <div className="mb-6">
                {filteredRawMaterials.length > 0 ? (
                  filteredRawMaterials.map(renderProductCard)
                ) : (
                  <p className="text-center text-gray-500 py-8">No raw materials found.</p>
                )}
              </div>
            )}
            
            {activeTab === "finished" && (
              <div>
                {filteredFinishedGoods.length > 0 ? (
                  filteredFinishedGoods.map(renderProductCard)
                ) : (
                  <p className="text-center text-gray-500 py-8">No finished goods found.</p>
                )}
              </div>
            )}
          </div>

          {/* Desktop Tables View */}
          <div className="hidden md:block">
            {/* Raw Materials Table */}
            <div className="overflow-x-auto mb-8 bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Raw Materials</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warehouse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reorder Level
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
                    {filteredRawMaterials.length > 0 ? (
                      filteredRawMaterials.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {product.productOrders.map((order, idx) => (
                                <div key={idx} className="flex items-center">
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">
                                    {order.warehouse}: {order.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.productOrders.reduce(
                              (acc, order) => acc + order.quantity,
                              0
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              product.productOrders[0]?.status === "Completed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {product.productOrders[0]?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={() => openModal(product)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => openTransferModal(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Transfer Stock
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No raw materials found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Finished Goods Table */}
            <div className="overflow-x-auto mb-4 bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Finished Goods</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warehouse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reorder Level
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
                    {filteredFinishedGoods.length > 0 ? (
                      filteredFinishedGoods.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {product.productOrders.map((order, idx) => (
                                <div key={idx} className="flex items-center">
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">
                                    {order.warehouse}: {order.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.productOrders.reduce(
                              (acc, order) => acc + order.quantity,
                              0
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              product.productOrders[0]?.status === "Completed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {product.productOrders[0]?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={() => openModal(product)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => openTransferModal(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Transfer Stock
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No finished goods found.
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

      {/* Modal for Stock Details - Improved for all screen sizes */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Details</h2>
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
                  <h3 className="text-sm font-medium text-gray-500">Product Name</h3>
                  <p className="mt-1 text-lg">{selectedProduct.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Available Stock</h3>
                  <p className="mt-1 text-lg">{selectedProduct.stock}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Warehouse</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedProduct.productOrders.map((order, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-md">
                        {order.warehouse}: {order.quantity}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reorder Level</h3>
                  <p className="mt-1 text-lg">
                    {selectedProduct.productOrders.reduce(
                      (acc, order) => acc + order.quantity, 0
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{selectedProduct.description || "No description available"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1">{selectedProduct.category}</p>
                </div>
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

      {/* Transfer Stock Modal - Improved for all screen sizes */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Transfer Stock</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeTransferModal}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Product</h3>
                <p className="text-lg font-medium">{selectedProduct?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Warehouse
                </label>
                <select
                  value={selectedWarehouseFrom}
                  onChange={(e) => setSelectedWarehouseFrom(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Warehouse</option>
                  {selectedProduct?.productOrders?.map((order, idx) => (
                    <option key={idx} value={order.warehouse}>
                      {order.warehouse} ({order.quantity} available)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Warehouse
                </label>
                <select
                  value={selectedWarehouseTo}
                  onChange={(e) => setSelectedWarehouseTo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Warehouse</option>
                  <option value="WH-1">Warehouse 1</option>
                  <option value="WH-2">Warehouse 2</option>
                  <option value="WH-3">Warehouse 3</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Transfer
                </label>
                <input
                  type="number"
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={closeTransferModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStockTransfer}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                disabled={transferQuantity <= 0 || !selectedWarehouseFrom || !selectedWarehouseTo}
              >
                Transfer Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}