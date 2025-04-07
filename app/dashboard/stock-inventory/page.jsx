"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function InventoryDashboardPage() {
  const router = useRouter();

  const features = [
    {
      title: "Stock & Warehouse Management",
      imageUrl: "/sales-crm-sr.jpg",  // Example image URL
      link: "/dashboard/stock-inventory/stock-warehouse-management",
    },
    {
      title: "Procurement & Supplier Management",
      imageUrl: "/sales-crm-sr.jpg",  // Example image URL
      link: "/dashboard/stock-inventory/procurement-supplier-management",
    },
    {
      title: "Stock Allocation",
      imageUrl: "/sales-crm-sr.jpg",  // Example image URL
      link: "/dashboard/stock-inventory/stock-allocation",
    },
    {
      title: "Reports & Analytics",
      imageUrl: "/sales-crm-sr.jpg",  // Example image URL
      link: "/dashboard/stock-inventory/reports-analytics",
    },
  ];

  return (
    <div className="h-full bg-white">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <h1 className="text-2xl font-medium mb-4 lg:hidden">Inventory Dashboard</h1>
        {features.map((feature) => (
          <div
            key={feature.title}
            onClick={() => router.push(feature.link)}
            className="border-0.5 h-[30vh] max-w-lg lg:h-auto shadow-md overflow-hidden rounded-lg cursor-pointer hover:shadow-md transition relative hover:scale-105 duration-200 hover:bg-gray-100"
          >
            <div className="w-full overflow-hidden h-[70%]">
              <Image
                src={feature.imageUrl}
                alt="icon"
                width={0}
                height={0}
                sizes="100vw"
                className="mb-4 w-full"
              />
            </div>
            <p className="text-center text-gray-700 font-medium text-2xl px-4 mt-2">
              {feature.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
