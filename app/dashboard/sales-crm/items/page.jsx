"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ItemAndPricingManagement() {
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [warehouse, setWarehouse] = useState("");
  const [reorderQty, setReorderQty] = useState("");
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserData(userData);
    }
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/item-and-pricing", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleSelect = (id) => {
    setSelectedProductId(id);
  };

  const handleReorderSubmit = async () => {
    if (!warehouse || !reorderQty) {
      alert("Please select a warehouse and enter reorder quantity.");
      return;
    }

    const selectedProduct = products.find((p) => p.id === selectedProductId);

    try {
      const res = await fetch("/api/production-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          warehouse,
          quantity: reorderQty,
        }),
      });

      const data = await res.json();

      if (res.ok && userData) {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData.id,
            title: "Production Order Created",
            message: `Reorder placed for ${selectedProduct.name} (${reorderQty} units) to ${warehouse}.`,
            type: "production",
          }),
        });

        alert("Production order submitted successfully!");
        setWarehouse("");
        setReorderQty("");
        setSelectedProductId(null);
      } else {
        alert(data.error || "Failed to submit order");
      }
    } catch (err) {
      alert("Error submitting production order");
      console.error(err);
    }
  };

  return (
    <div className=" space-y-6 w-full mx-auto">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard/sales-crm")}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold">Item & Pricing Management</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Item and Pricing Management
        </h1>
        <button
          onClick={() => router.push("/dashboard/sales-crm/items/add")}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const isLowStock = product.stock < 30;
          const isVeryLow = product.stock <= 5;

          return (
            <div
              key={product.id}
              className={`
          border rounded-lg shadow-sm overflow-hidden 
          transition-all duration-300 
          hover:shadow-md  relative
          ${
            selectedProductId === product.id
              ? "border-blue-500 border-2 scale-105"
              : "border-gray-200"
          }
        `}
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold">{product.name}</h2>
                  <span className="text-sm text-gray-500">
                    #{product.productId}
                  </span>
                </div>

                <p className="text-gray-700 text-sm line-clamp-2">
                  {product.description}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Category: {product.category}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="border rounded p-1 text-center">
                    <span className="block text-gray-600">B2B Price</span>
                    <span className="font-semibold">₹{product.b2bPrice}</span>
                  </div>
                  <div className="border rounded p-1 text-center">
                    <span className="block text-gray-600">B2C Price</span>
                    <span className="font-semibold">₹{product.b2cPrice}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">
                    Stock:
                    <span
                      className={`ml-2 font-semibold ${
                        isVeryLow ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </span>
                  {isVeryLow && (
                    <span className="text-xs text-red-500 font-medium">
                      Low Stock
                    </span>
                  )}
                </div>

                <button
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    localStorage.setItem(
                      "productData",
                      JSON.stringify(product)
                    );
                    router.push(`/dashboard/sales-crm/items/add`);
                  }}
                >
                  Edit Details
                </button>

                {isLowStock && (
                  <div className="h-[2px] w-full bg-red-500 mt-2" />
                )}

                {isLowStock && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(product.id);
                    }}
                    className="w-full mt-2 text-sm text-red-600 font-medium underline hover:text-red-800"
                  >
                    Order More Quantity
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProductId && (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Reorder Product</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Warehouse
              </label>
              <select
                className="w-full border rounded p-2"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              >
                <option>Select Warehouse</option>
                <option value="WH-1">Warehouse 1</option>
                <option value="WH-2">Warehouse 2</option>
                <option value="WH-3">Warehouse 3</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Quantity
              </label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={reorderQty}
                onChange={(e) => setReorderQty(e.target.value)}
                placeholder="Enter reorder quantity"
              />
            </div>

            <div className="flex space-x-2">
              <button
                className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
                onClick={handleReorderSubmit}
              >
                Submit Reorder
              </button>
              <button
                className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100"
                onClick={() => setSelectedProductId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
