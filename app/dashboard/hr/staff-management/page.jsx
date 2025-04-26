"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegEye, FaEdit, FaSearch, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import { Info, X } from "lucide-react";

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setStaffList(data.users || []);
      } catch (error) {
        setError("Error fetching staff data");
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleEdit = (staff) => {
    localStorage.setItem("staff-data", JSON.stringify(staff));
    router.push(`/dashboard/hr/staff-management/add`);
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mobile card view renderer
  const renderStaffCard = (staff) => (
    <div key={staff.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{staff.name}</h3>
          <p className="text-sm text-gray-600">{staff.department}</p>
        </div>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {staff.employeeId}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{staff.email}</p>
        </div>
        <div>
          <p className="text-gray-500">Joined</p>
          <p className="font-medium">
            {new Date(staff.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Salary</p>
          <p className="font-medium">₹{staff.salary}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => handleEdit(staff)}
          className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md flex items-center"
        >
          <FaEdit className="mr-2" /> Edit
        </button>
        <button
          onClick={() => {
            setSelectedStaff(staff);
            setIsModalOpen(true);
          }}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md flex items-center"
        >
          <FaRegEye className="mr-2" /> View
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full max-w-full mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600 hidden md:block">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Staff Management</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Staff Management
        </h1>

        <div className="w-full md:w-auto flex gap-4">
          {/* Search bar */}
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          {/* Add New Staff Button */}
          <Link href="/dashboard/hr/staff-management/add">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <FaUserPlus className="mr-2" />
              <span className="hidden md:inline">Add Staff</span>
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="md:hidden">
            {filteredStaff.length > 0 ? (
              filteredStaff.map(renderStaffCard)
            ) : (
              <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                No staff members found
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {staff.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {staff.employeeId}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{staff.email}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {staff.department}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(staff.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        ₹{staff.salary}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(staff)}
                          className=" text-yellow-700 px-3 py-1 rounded-md "
                        >
                          <FaEdit className="inline mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStaff(staff);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-700 px-3 py-1 rounded-md "
                        >
                          <FaRegEye className="inline mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No staff members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Staff Details Modal */}
      {isModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Staff Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 text-lg">{selectedStaff.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Employee ID
                </h3>
                <p className="mt-1 text-lg">{selectedStaff.employeeId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg">{selectedStaff.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Department
                </h3>
                <p className="mt-1 text-lg">{selectedStaff.department}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Date Joined
                </h3>
                <p className="mt-1 text-lg">
                  {new Date(selectedStaff.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Salary</h3>
                <p className="mt-1 text-lg">₹{selectedStaff.salary}</p>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
