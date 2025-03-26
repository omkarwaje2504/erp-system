"use client";
import { useState } from "react";

import {
  FiHome,
  FiBox,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiHeadphones,
} from "react-icons/fi";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <div
        className={`h-screen bg-gray-900 text-white p-4 transition-all duration-300 ${
          isSidebarOpen ? "w-[13%]" : "w-16"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-16 ml-1 text-gray-300 hover:text-white"
        >
          {isSidebarOpen ? "☰ Close" : "☰"}
        </button>

        <nav className="flex flex-col space-y-10">
          <a
            href="#"
            className={`flex items-center space-x-3 border-b border-blue-400 ${
              isSidebarOpen ? "px-3 " : "px-1"
            } pb-2 hover:bg-gray-800 rounded-md transition-opacity duration-300`}
          >
            <FiHome className="text-xl" />
            {isSidebarOpen && <span>Dashboard</span>}
          </a>
          <a
            href="#"
            className={`flex items-center space-x-3 border-b border-blue-400 ${
              isSidebarOpen ? "px-3 " : "px-1"
            } pb-2 hover:bg-gray-800  rounded-md`}
          >
            <FiTrendingUp className="text-xl" />
            {isSidebarOpen && <span>Sales & CRM</span>}
          </a>
          <a
            href="#"
            className={`flex items-center space-x-3 border-b border-blue-400 ${
              isSidebarOpen ? "px-3 " : "px-1"
            } pb-2 hover:bg-gray-800  rounded-md`}
          >
            <FiBox className="text-xl" />
            {isSidebarOpen && <span>Inventory</span>}
          </a>
          <a
            href="#"
            className={`flex items-center space-x-3 border-b border-blue-400 ${
              isSidebarOpen ? "px-3 " : "px-1"
            } pb-2 hover:bg-gray-800  rounded-md`}
          >
            <FiUsers className="text-xl" />
            {isSidebarOpen && <span>HR</span>}
          </a>
          <a
            href="#"
            className={`flex items-center space-x-3 border-b border-blue-400 ${
              isSidebarOpen ? "px-3 " : "px-1"
            } pb-2 hover:bg-gray-800  rounded-md`}
          >
            <FiDollarSign className="text-xl" />
            {isSidebarOpen && <span>Finance</span>}
          </a>
          <a
            href="#"
            className={`flex items-center space-x-3 border-b border-blue-400 ${
              isSidebarOpen ? " px-3" : "px-1"
            }  pb-2 hover:bg-gray-800 rounded-md`}
          >
            <FiHeadphones className="text-xl" />
            {isSidebarOpen && <span>Support</span>}
          </a>
        </nav>
      </div>

      <div className="flex-1 min-h-screen bg-gray-100 p-6">{children}</div>
    </div>
  );
}
