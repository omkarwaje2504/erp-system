"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Calendar, BarChart2, CreditCard, FileText } from "lucide-react";  // Importing icons from Lucide

export default function HRManagementPage() {
  const router = useRouter();

  const features = [
    {
      title: "Staff Management",
      description: "Manage employee details, roles, and their work schedules efficiently.",
      icon: <Users size={24} />,
      imageUrl: "/staff-management.jpg",
      link: "/dashboard/hr/staff-management",
    },
    {
      title: "Attendance & Leave Management",
      description: "Track employee attendance and manage leave requests seamlessly.",
      icon: <Calendar size={24} />,
      imageUrl: "/attendance-leave-management.jpg",
      link: "/dashboard/hr/attendance-leave-management",
    },
    {
      title: "Performance and Feedback Management",
      description: "Monitor employee performance and gather valuable feedback for growth.",
      icon: <BarChart2 size={24} />,
      imageUrl: "/performance-and-feedback-management.jpg",
      link: "/dashboard/hr/performance-and-feedback-management",
    },
    {
      title: "Payroll & Payments",
      description: "Manage payrolls, salary disbursements, and payment records efficiently.",
      icon: <CreditCard size={24} />,
      imageUrl: "/payroll-payments.png",
      link: "/dashboard/hr/payroll-payments",
    },
    {
      title: "Circulars, Announcements & Tickets",
      description: "Distribute circulars, announcements and manage employee tickets effectively.",
      icon: <FileText size={24} />,
      imageUrl: "/circulars-announcements-and-tickets.jpg",
      link: "/dashboard/hr/circulars-announcements-and-tickets",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-full p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">HR Management</h1>
        <p className="text-gray-600 mt-2">
          Manage and streamline your HR processes including staff management, attendance, payroll, and more.
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
