"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegEye, FaEdit } from "react-icons/fa";
import Link from "next/link";

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        console.log("Staff data:", data.users);
        setStaffList(data.users);
      } catch (error) {
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

  console.log(staffList);
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Staff Management
      </h1>

      <div className="flex justify-end mb-6">
        <Link href="/dashboard/hr/staff-management/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add New Staff
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <table className="w-full text-sm bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Date of Joining</th>
              <th className="p-2 text-left">Salary</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{staff.name}</td>
                <td className="p-2">{staff.employeeId}</td>
                <td className="p-2">{staff.email}</td>
                <td className="p-2">{staff.department}</td>
                <td className="p-2">
                  {new Date(staff.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">₹{staff.salary}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(staff)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mx-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleEdit(staff)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    <FaRegEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
