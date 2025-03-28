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
  ExternalLink,
  Trash2,
  Users,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";

const sidebarItems = [
  {
    icon: <ShoppingCart />,
    label: "Stoick & Inventory",
    href: "/dashboard/stock-inventory",
    highlight: "stock-inventory",
  },
  {
    icon: <TrendingUp />,
    label: "Sales & CRM",
    href: "/dashboard/sales-crm",
    highlight: "sales-crm",
  },
  {
    icon: <Users />,
    label: "HR",
    href: "/dashboard/hr",
    highlight: "hr",
  },
  {
    icon: <FileText />,
    label: "Accounting and finance",
    href: "/dashboard/accounting",
    highlight: "accounting",
  },
  {
    icon: <Factory />,
    label: "Production",
    href: "/dashboard/production",
    highlight: "production",
  },
  {
    icon: <PieChart />,
    label: "Reports",
    href: "/dashboard/reports",
    highlight: "reports",
  },
  {
    icon: <List />,
    label: "Business overview",
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

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Notification Sidebar */}
      <div
        className={`
        fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg z-50 
        transform transition-transform duration-300 ease-in-out
        ${isNotificationOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button
            onClick={toggleNotifications}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="divide-y">
          <NotificationItem />
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      {isMobile && !isMobileSidebarOpen && !isNotificationOpen && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 bg-white shadow-md p-2 rounded-lg"
        >
          <Menu size={24} />
        </button>
      )}

      <div className="flex w-full">
        {/* Sidebar */}

        <div
          className={`
            fixed md:static z-40 top-0 left-0 h-full w-64 xl:w-[16rem] lg:w-[32vw] bg-white shadow-lg 
            transform transition-transform duration-300 ease-in-out
            ${
              isMobile
                ? isMobileSidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
                : "translate-x-0"
            }
          `}
        >
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Clan India Lifestyle ERP
            </h2>
            {isMobile && (
              <button
                onClick={toggleMobileSidebar}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={isMobile ? toggleMobileSidebar : undefined}
                    className={`
                      flex items-center space-x-3 p-3 w-full text-left rounded-lg
                      ${
                        pathname === item.href
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col md:ml-0">
          <header className="flex justify-end items-center p-4 px-4 md:px-10">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleNotifications}
                className="text-gray-600 hover:text-gray-800 relative"
              >
                <Bell size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  2
                </span>
              </button>
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  <UserCircle2 size={32} className="text-gray-500" />
                  <div className="leading-3 hidden md:block">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.role}</p>
                  </div>
                </div>

                {/* Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push("/dashboard/user-profile");
                      }}
                    >
                      Update Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-grow p-4 w-full md:p-6 bg-white overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

const NotificationItem = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
      setInterval(() => {
        fetchNotifications(user.id);
      }, 10000);
    }
  }, []);

  const fetchNotifications = async (uid) => {
    try {
      const res = await fetch(`/api/notifications?userId=${uid}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeleteNotification(notification.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-gray-500 py-4">
          No notifications found.
        </div>
      )}
    </>
  );
};
