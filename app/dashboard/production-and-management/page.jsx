"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Factory, List, Monitor, FileText, CheckCircle } from "lucide-react";  // Importing icons from Lucide

export default function ProductionAndManagementPage() {
  const router = useRouter();

  const features = [
    {
      title: "Production Overview",
      description: "Get a complete overview of the production process, track production progress, and monitor efficiency.",
      icon: <Factory size={24} />,
      imageUrl: "/production-overview.jpg",
      link: "/dashboard/production-and-management/production-overview",
    },
    {
      title: "Work Orders Management",
      description: "Create, manage, and track work orders for the production team, ensuring timely delivery and efficiency.",
      icon: <List size={24} />,
      imageUrl: "/work-orders-management.jpg",
      link: "/dashboard/production-and-management/work-orders-management",
    },
    {
      title: "Workstation Management",
      description: "Manage and optimize workstations, ensuring proper allocation of resources and minimizing downtime.",
      icon: <Monitor size={24} />,
      imageUrl: "/workstation-management.jpg",
      link: "/dashboard/production-and-management/workstation-management",
    },
    {
      title: "Reports",
      description: "Generate detailed reports on production performance, quality, and efficiency to assist decision-making.",
      icon: <FileText size={24} />,
      imageUrl: "/reports.jpg",
      link: "/dashboard/production-and-management/report",
    },
    {
      title: "Quality Control & Inspections",
      description: "Ensure product quality by managing inspections and monitoring quality control processes across production lines.",
      icon: <CheckCircle size={24} />,
      imageUrl: "/quality-control.webp",
      link: "/dashboard/production-and-management/quality-control-inspection",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-full p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Production & Management
        </h1>
        <p className="text-gray-600 mt-2">
          Streamline your production processes, manage work orders, and maintain product quality.
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
              <div className="bg-blue-50 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">Explore</span>
                <div className="text-blue-600 flex items-center">
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
