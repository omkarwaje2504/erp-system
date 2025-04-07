"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  return (
    <div className="p-6 w-full">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600">
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
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Stock & Warehouse Management
        </h1>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          {/* Raw Materials Table */}
          <div className="overflow-x-auto mb-6">
            <h2 className="text-xl font-semibold mb-4">Raw Materials</h2>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-center">Stock Category</th>
                  <th className="p-2 text-center">Available Stock</th>
                  <th className="p-2 text-center">Warehouse</th>
                  <th className="p-2 text-center">Reorder Level</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rawMaterials.map((product) => (
                  <tr key={product.id}>
                    <td className="p-2 text-center">{product.name}</td>
                    <td className="p-2 text-center">{product.stock}</td>
                    <td className="p-2 text-center flex flex-wrap gap-3 items-center max-w-xl">
                      {product.productOrders.map((order, idx) => (
                        <div key={idx} className="flex items-center">
                          <p className="mt-3 flex items-center gap-1">
                            <span className="bg-green-400 px-2 py-1 rounded-md">
                              {order.warehouse}
                            </span>
                            : {order.quantity}
                          </p>
                        </div>
                      ))}
                    </td>
                    <td className="p-2 text-center">
                      {/* Calculate reorder level */}
                      {product.productOrders.reduce(
                        (acc, order) => acc + order.quantity,
                        0
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {product.productOrders[0]?.status}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => openModal(product)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openTransferModal(product)}
                        className="text-red-600 hover:underline"
                      >
                        Transfer Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Finished Goods Table */}
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Finished Goods</h2>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-center">Stock Category</th>
                  <th className="p-2 text-center">Available Stock</th>
                  <th className="p-2 text-center">Warehouse</th>
                  <th className="p-2 text-center">Reorder Level</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {finishedGoods.map((product) => (
                  <tr key={product.id}>
                    <td className="p-2 text-center">{product.name}</td>
                    <td className="p-2 text-center">{product.stock}</td>
                    <td className="p-2 text-center flex flex-wrap gap-3 items-center max-w-xl">
                      {product.productOrders.map((order, idx) => (
                        <div key={idx} className="flex items-center">
                          <p className="mt-3 flex items-center gap-1">
                            <span className="bg-green-400 px-2 py-1 rounded-md">
                              {order.warehouse}
                            </span>
                            : {order.quantity}
                          </p>
                        </div>
                      ))}
                    </td>
                    <td className="p-2 text-center">
                      {/* Calculate reorder level */}
                      {product.productOrders.reduce(
                        (acc, order) => acc + order.quantity,
                        0
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {product.productOrders[0]?.status}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => openModal(product)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openTransferModal(product)}
                        className="text-red-600 hover:underline"
                      >
                        Transfer Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal for Stock Details */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <p>
              <strong>Product Name:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Available Stock:</strong> {selectedProduct.stock}
            </p>
            <p>
              <strong>Warehouse:</strong>{" "}
              {selectedProduct.productOrders[0]?.warehouse}
            </p>
            <p>
              <strong>Reorder Level:</strong>{" "}
              {selectedProduct.productOrders.reduce(
                (acc, order) => acc + order.quantity,
                0
              )}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
          </div>
        </div>
      )}

      {/* Transfer Stock Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={closeTransferModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Transfer Stock</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Warehouse
              </label>
              <select
                value={selectedWarehouseFrom}
                onChange={(e) => setSelectedWarehouseFrom(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Warehouse</option>
                {selectedProduct?.productOrders?.map((order, idx) => (
                  <option key={idx} value={order.warehouse}>
                    {order.warehouse}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Warehouse
              </label>
              <select
                value={selectedWarehouseTo}
                onChange={(e) => setSelectedWarehouseTo(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Warehouse</option>
                <option value="WH-1">Warehouse 1</option>
                <option value="WH-2">Warehouse 2</option>
                <option value="WH-3">Warehouse 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to Transfer
              </label>
              <input
                type="number"
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleStockTransfer}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Transfer Stock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
