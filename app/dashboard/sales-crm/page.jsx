"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Tag, ShoppingBag, BarChart3 } from "lucide-react";

export default function SalesCRMPage() {
  const router = useRouter();
  
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeListings: 0,
    pendingSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const features = [
    {
      title: "Selling and Customer Management",
      description: "Manage customer relationships, track leads and monitor sales activities.",
      icon: <Users size={24} />,
      imageUrl: "/sales-crm-scm.jpg",
      link: "/dashboard/sales-crm/selling",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Item and Pricing",
      description: "Manage product catalog, pricing strategies and inventory availability.",
      icon: <Tag size={24} />,
      imageUrl: "/sales-crm-ip.jpg",
      link: "/dashboard/sales-crm/items",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Marketplace Integration",
      description: "Connect with online marketplaces and synchronize product listings.",
      icon: <ShoppingBag size={24} />,
      imageUrl: "/sales-crm-mpi.jpg",
      link: "/dashboard/sales-crm/marketplace",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Sales Report",
      description: "Track performance metrics, analyze sales trends and generate reports.",
      icon: <BarChart3 size={24} />,
      imageUrl: "/sales-crm-sr.jpg",
      link: "/dashboard/sales-crm/sales-report",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  // Fetch data for stats
  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        // Fetch customer data
        const customersRes = await fetch("/api/customers");
        const customersData = await customersRes.json();
        const totalCustomers = customersData.length;

        // Fetch listing data
        const listingsRes = await fetch("/api/listings");
        const listingsData = await listingsRes.json();
        const activeListings = listingsData.filter(
          listing => listing.status === "active"
        ).length;

        // Fetch sales data
        const salesRes = await fetch("/api/sales");
        const salesData = await salesRes.json();
        const pendingSales = salesData.filter(
          sale => sale.status === "pending"
        ).length;

        setStats({
          totalCustomers,
          activeListings,
          pendingSales,
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
          Sales & CRM
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your sales activities, customers, and product listings
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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