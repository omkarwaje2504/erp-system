"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Package2, Truck, BarChart3 } from "lucide-react";

export default function InventoryDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalStockItems: 0,
    activeSuppliers: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const features = [
    {
      title: "Stock & Warehouse Management",
      description:
        "Track inventory levels, manage stock locations and monitor warehouse capacity.",
      icon: <Package2 size={24} />,
      imageUrl: "/sales-crm-sr.jpg",
      link: "/dashboard/stock-inventory/stock-warehouse-management",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Procurement & Supplier Management",
      description:
        "Manage suppliers, purchase orders and track procurement performance.",
      icon: <Truck size={24} />,
      imageUrl: "/procurement-supplier-management.webp",
      link: "/dashboard/stock-inventory/procurement-supplier-management",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Stock Allocation",
      description:
        "Allocate inventory to orders, manage reservations and track fulfillment.",
      icon: <BarChart3 size={24} />,
      imageUrl: "/stock-allocation.jpg",
      link: "/dashboard/stock-inventory/stock-allocation",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  // Fetch data for stats (Total Stock Items, Active Suppliers, Pending Orders)
  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        // Fetch data from StockWarehousePage API
        const warehouseRes = await fetch("/api/item-and-pricing");
        const warehouseData = await warehouseRes.json();

        const totalStockItems = warehouseData.reduce(
          (total, product) =>
            total +
            product.productOrders.reduce(
              (total, item) => total + item.quantity,
              0
            ),
          0
        );

        // Fetch data from Procurement & Supplier Management API
        const procurementRes = await fetch(
          "/api/purchase-request-order?type=purchaseRequestOrder"
        );
        const procurementData = await procurementRes.json();

        const activeSuppliers = procurementData.filter(
          (order) => order.status === "In Progress"
        ).length;

        // Fetch data from Stock Allocation API
        const allocationRes = await fetch("/api/stock-allocation");
        const allocationPreData = await allocationRes.json();
        const allocationData = await allocationPreData.allocations;
        const pendingOrders = allocationData.filter(
          (allocation) => allocation.status === "Inactive"
        ).length;
        // Set stats data
        setStats({
          totalStockItems,
          activeSuppliers,
          pendingOrders,
        });
      } catch (err) {
        setError("Error fetching stats data");
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-full p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Inventory Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your inventory, suppliers and stock allocation
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            onClick={() => router.push(feature.link)}
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Card Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={feature.imageUrl}
                alt={feature.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-grow flex flex-col">
              <div
                className={`${feature.bgColor} ${feature.iconColor} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}
              >
                {feature.icon}
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">
                  Explore
                </span>
                <div className={`${feature.iconColor} flex items-center`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
}
