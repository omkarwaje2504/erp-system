"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  TrendingUp,
  List,
  FileText,
  Factory,
  PieChart,
  Bell,
  UserCircle2,
  X,
  Users,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationPanel from "@/components/NotificationPanel";
import Layout from "@/components/Layout";

const sidebarItems = [
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    label: "Stock & Inventory",
    href: "/dashboard/stock-inventory",
    highlight: "stock-inventory",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    label: "Sales & CRM",
    href: "/dashboard/sales-crm",
    highlight: "sales-crm",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "HR",
    href: "/dashboard/hr",
    highlight: "hr",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Accounting and Finance",
    href: "/dashboard/accounting-and-finance",
    highlight: "accounting-and-finance",
  },
  {
    icon: <Factory className="w-5 h-5" />,
    label: "Production",
    href: "/dashboard/production-and-management",
    highlight: "production-and-management",
  },
  {
    icon: <PieChart className="w-5 h-5" />,
    label: "Reports",
    href: "/dashboard/reports",
    highlight: "reports",
  },
  {
    icon: <List className="w-5 h-5" />,
    label: "Business Overview",
    href: "/dashboard/business-overview",
    highlight: "business-overview",
  },
];

export default function DashboardLayout({ children }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pathname, setPathname] = useState("");
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const pathname = window.location.pathname;
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    }
    const getPathnameArray = pathname.split("/");
    sidebarItems.forEach((item) => {
      const path = item.highlight;
      if (getPathnameArray.includes(path)) {
        setPathname(`/dashboard/${path}`);
      }
    });
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-40 top-0 left-0 h-full w-64 bg-white shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${isMobile ? (isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        `}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Clan India Lifestyle ERP</h2>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={isMobile ? () => setIsMobileSidebarOpen(false) : undefined}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors
                    ${pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-4 py-3">
            {isMobile && (
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-50"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            )}

            <div className="flex w-full items-end justify-end space-x-4">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-50"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                >
                  <UserCircle2 className="w-6 h-6 text-gray-600" />
                  <span className="hidden md:block font-medium text-gray-700">
                    {user?.name}
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                    <Link
                      href="/dashboard/user-profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Layout>{children}</Layout>
        </main>
      </div>

      {/* Notification Panel */}
      {isNotificationOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-50"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <NotificationPanel />
          </div>
        </div>
      )}
    </div>
  );
}
