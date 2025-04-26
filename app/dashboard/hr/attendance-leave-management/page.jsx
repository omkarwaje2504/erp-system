"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaUpload, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { Info, X, Clock, Calendar } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";

export default function AttendanceLeaveManagement() {
  const router = useRouter();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, leaveRes] = await Promise.all([
          fetch("/api/attendence"),
          fetch("/api/leave"),
        ]);

        if (!attendanceRes.ok || !leaveRes.ok)
          throw new Error("Data fetch failed");

        const attendanceData = await attendanceRes.json();
        const leaveData = await leaveRes.json();

        setAttendanceRecords(attendanceData.attendanceRecords || []);
        setLeaveRequests(leaveData.leaveRequests || []);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAttendanceRecords = attendanceRecords.filter(
    (record) =>
      (selectedDate === "" || record.date === selectedDate) &&
      (record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.includes(searchTerm))
  );

  const filteredLeaveRequests = leaveRequests.filter(
    (request) =>
      (selectedDate === "" ||
        request.leaveStartDate === selectedDate ||
        request.leaveEndDate === selectedDate) &&
      (request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.employeeId.includes(searchTerm))
  );

  const renderAttendanceCard = (record) => (
    <div key={record.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{record.employeeName}</h3>
          <p className="text-sm text-gray-600">{record.employeeId}</p>
        </div>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            record.attendanceStatus === "Present"
              ? "bg-green-100 text-green-800"
              : record.attendanceStatus === "Absent"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {record.attendanceStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Check In</p>
          <p className="font-medium">{record.checkInTime}</p>
        </div>
        <div>
          <p className="text-gray-500">Check Out</p>
          <p className="font-medium">{record.checkOutTime || "--:--"}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Hours</p>
          <p className="font-medium">{record.totalWorkingHours || "--"}</p>
        </div>
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{record.date}</p>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setSelectedRecord(record);
            setIsAttendanceModalOpen(true);
          }}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          <Info size={16} className="mr-1" /> Details
        </button>
      </div>
    </div>
  );

  const renderLeaveCard = (request) => (
    <div key={request.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{request.employeeName}</h3>
          <p className="text-sm text-gray-600">{request.employeeId}</p>
        </div>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            request.status === "Approved"
              ? "bg-green-100 text-green-800"
              : request.status === "Rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <p className="text-gray-500">Leave Type</p>
          <p className="font-medium">{request.leaveType}</p>
        </div>
        <div>
          <p className="text-gray-500">Duration</p>
          <p className="font-medium">
            {request.leaveStartDate} - {request.leaveEndDate}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Reason</p>
          <p className="font-medium line-clamp-1">{request.reasonForLeave}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => handleLeaveAction(request.id, "approve")}
          className="bg-green-100 text-green-700 px-3 py-1 rounded-md flex items-center"
        >
          <FaCheck className="mr-2" /> Approve
        </button>
        <button
          onClick={() => handleLeaveAction(request.id, "reject")}
          className="bg-red-100 text-red-700 px-3 py-1 rounded-md flex items-center"
        >
          <FaTimes className="mr-2" /> Reject
        </button>
      </div>
    </div>
  );

  const handleLeaveAction = async (id, action) => {
    try {
      const res = await fetch(`/api/leave/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "approve" ? "Approved" : "Rejected",
        }),
      });

      if (res.ok) {
        setLeaveRequests((prev) =>
          prev.map((request) =>
            request.id === id
              ? {
                  ...request,
                  status: action === "approve" ? "Approved" : "Rejected",
                }
              : request
          )
        );
      }
    } catch (err) {
      console.error("Error updating leave status:", err);
    }
  };

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
          <li className="font-semibold flex items-center">
            Attendance & Leave Management
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Attendance & Leave Management
        </h1>

        <div className="w-full md:w-auto flex gap-4 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
          <Calendar size={18} className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="focus:outline-none"
          />
        </div>
        {selectedDate && (
          <button
            onClick={() => setSelectedDate("")}
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            Clear Filter <X size={16} className="ml-1" />
          </button>
        )}
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
          {/* Attendance Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
            <div className="md:hidden">
              {filteredAttendanceRecords.length > 0 ? (
                filteredAttendanceRecords.map(renderAttendanceCard)
              ) : (
                <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                  No attendance records found
                </div>
              )}
            </div>
            <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table headers and rows similar to staff management */}
              </table>
            </div>
          </div>

          {/* Leave Requests Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
            <div className="md:hidden">
              {filteredLeaveRequests.length > 0 ? (
                filteredLeaveRequests.map(renderLeaveCard)
              ) : (
                <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                  No leave requests found
                </div>
              )}
            </div>
            <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table headers and rows similar to staff management */}
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modals for details view */}
      {/* Add similar modals as in staff management for attendance and leave details */}
    </div>
  );
}
