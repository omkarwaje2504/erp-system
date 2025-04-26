"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BarChart, CreditCard, Settings, FileText } from "lucide-react";  // Importing icons from Lucide

export default function AccountingAndFinancePage() {
  const router = useRouter();

  const features = [
    {
      title: "Financial Overview & Reports",
      description: "View financial summaries and detailed reports to monitor company performance.",
      icon: <BarChart size={24} />,
      imageUrl: "/financial-overview.png",
      link: "/dashboard/accounting-and-finance/financial-overview-report",
    },
    {
      title: "Invoicing, Billing & Transactions",
      description: "Manage invoices, track billing, and oversee all financial transactions.",
      icon: <CreditCard size={24} />,
      imageUrl: "/invoicing-billing-transactions.webp",
      link: "/dashboard/accounting-and-finance/invoicing-billing-transactions",
    },
    {
      title: "Chart of Accounts & Finance Settings",
      description: "Configure financial settings and organize accounts for better financial tracking.",
      icon: <Settings size={24} />,
      imageUrl: "/chart-of-accounts-finance-settings.jpg",
      link: "/dashboard/accounting-and-finance/chart-of-accounts-finance-settings",
    },
    {
      title: "Taxation & Compliance",
      description: "Stay compliant with tax regulations and manage taxation processes.",
      icon: <FileText size={24} />,
      imageUrl: "/taxation-compliance.png",
      link: "/dashboard/accounting-and-finance/taxation-compliance",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-full p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Accounting & Finance</h1>
        <p className="text-gray-600 mt-2">
          Streamline your financial processes, manage reports, transactions, and ensure tax compliance.
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
